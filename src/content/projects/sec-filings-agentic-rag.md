---
title: "SEC Filings Agentic RAG"
summary: "Agentic RAG over SEC 10-K filings on .NET 10 and Aspire, with cited answers, measured retrieval quality and an MCP tool server."
kind: personal
role: "Sole developer — design, build, evals, local infrastructure"
period: "2026"
stack: [".NET 10", "Aspire", "Microsoft Agent Framework", "PostgreSQL + pgvector", "MCP", "Ollama", "Azure Functions", "Azure Blob Storage (Azurite)"]
cloud: ["azure"]
tags: ["backend", "ai", "distributed-systems", "observability"]
repo: "https://github.com/sushyk/SECFilingsAgenticRag"
featured: true
order: 1
---

## The problem

10-K filings are long, sectioned documents, and a plain chatbot will confidently answer questions about them from memory. I wanted answers grounded in the actual filing text, with citations, and I wanted to know whether each retrieval technique earned its place instead of assuming it did. The system has to cover both halves of RAG: an indexing phase that turns filings into searchable chunks, and a query phase where an agent decides what to search for.

## Architecture

An init job downloads the latest 10-Ks for five companies from SEC EDGAR and uploads them to blob storage. Indexing is a separate, explicitly triggered Azure Function that runs Microsoft's DataIngestion pipeline: HTML to Markdown, section-aware chunking, cleaning with prompt-injection flagging, embedding, then storage in Postgres with pgvector. The query side is an ASP.NET Core API that hosts three agents over the AG-UI protocol: `chat-only`, `standard-rag` and `agentic-rag`. The agentic one gets its search tools from a separate MCP server. Aspire orchestrates the lot and collects traces and metrics.

```text
SEC EDGAR -> ingestion-init job -> Blob Storage (Azurite locally)
                                        |
              POST /api/index           v
   user ------------------> Azure Function: load > chunk > enrich > embed > store
                                                                       |
                                                      Postgres + pgvector
                                                                       |
 chat CLI --AG-UI--> Agent API (chat-only | standard-rag | agentic-rag)
                          |  MCP client
                          v
                     MCP server (search_filings, list_available_filings)

 Models: Ollama (nomic-embed-text, qwen3:4b)
 Telemetry: OpenTelemetry -> Aspire dashboard
```

## Key decisions

- **Host-agnostic indexing and retrieval libraries.** The pipeline runs inside an Azure Function today but is a plain library, and one search function backs the RAG context provider, the agent tool, an HTTP endpoint and the MCP server. The cost is an extra project boundary; the gain is that hosting stays a separate decision.
- **Separate indexing from querying.** Ingestion is a rare, long-running batch that should cost nothing when idle. Retrieval is latency-sensitive. They scale and deploy independently, and indexing only runs when asked.
- **Tools served over MCP, and my own agent consumes them that way.** One implementation serves the agent, VS Code Copilot and Claude Desktop, and my agent exercises the same path as outside clients. In-process tools would have been faster to write.
- **Postgres with pgvector instead of a dedicated vector database.** It covers metadata filters, full-text hybrid search and conversation storage in one system. A dedicated store would only pay off at a scale this corpus doesn't have.
- **Measured retrieval, not assumed.** A 25-question golden set over 5 filings (824 chunks) compared strategies. Hybrid search (vector plus full-text, fused with RRF) beat vector alone, MRR@10 0.46 against 0.40. LLM reranking and multi-query rewriting made results worse with a 3B local model, so both stay opt-in behind configuration. With 25 questions, small differences are within noise, and the README says so.

## Cloud

Azure pieces are used at the code level. Azure Functions (isolated worker) hosts indexing, and the Azure Blob Storage SDK stores filings, run locally against Azurite through Aspire's Azure Storage integration. Postgres with pgvector maps to Azure Database for PostgreSQL, which my ADR names as the production target. Everything runs locally by default and I haven't deployed it to Azure. Chat can switch to a cloud OpenAI-compatible endpoint by configuration, with embeddings staying local.

AWS path: the Functions host could move to Lambda, blobs to S3 and Postgres to RDS or Aurora with pgvector. This is a possible target, not done work.

## What I'd do next

- Add automated tests (planned phase 9) and a queue-triggered indexing path, so indexing doesn't depend on a long-lived HTTP call.
- Re-run the rerank and multi-query experiments with a larger or cloud model, and add chunk augmentation for the headcount-style questions that retrieval still misses.
- Add authentication and a retention policy for stored conversations. Both are listed as known gaps in the README.
