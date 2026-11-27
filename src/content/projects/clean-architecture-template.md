---
title: "Clean Architecture Template for .NET"
summary: "A reusable .NET 10 clean-architecture starter with CQRS, validation and OpenTelemetry wired to the Aspire dashboard or Grafana, runnable from one compose file."
kind: personal
role: "Sole developer — template design and implementation"
period: "2025-2026"
stack: [".NET 10", "ASP.NET Core minimal APIs", "EF Core", "PostgreSQL", "Kafka", "Redis", "OpenTelemetry", "Serilog", "Docker Compose"]
cloud: []
tags: ["backend", "devops", "observability"]
repo: "https://github.com/sushyk/MyCleanArchTemplate"
featured: true
order: 2
---

## The problem

Every new service needs the same plumbing: layering that stays enforced, input validation, consistent error responses, structured logs, traces and metrics, and local dependencies. I got tired of rebuilding it, and of services where telemetry was added last. This template is the starting point I want for a new .NET backend, with observability in place before the first feature.

## Architecture

The solution follows ports and adapters. The Domain project holds entities and repository interfaces. The Application project holds commands, queries, handlers and validators, and depends only on abstractions. Adapters implement them: persistence (EF Core on Postgres), Kafka messaging and the web API (minimal API endpoints). A thin Web project is the composition root, so only it knows every adapter. A shared Core project defines a `Result` type with typed errors.

```text
Web (composition root, OpenTelemetry, Serilog)
  |-- Adapter.WebApi ---------> Application (Mediator commands/queries, FluentValidation)
  |-- Adapter.Persistence ----> Domain (entities, repository interfaces)
  |-- Adapter.Kafka
  `-- Infrastructure

Local dependencies via Docker Compose: Postgres, Kafka, Redis
Telemetry (OTLP): Aspire dashboard profile  or  Grafana LGTM profile
```

## Key decisions

- **Errors as `Result` values, mapped once to ProblemDetails.** Handlers return failures instead of throwing, and a single extension turns them into HTTP responses. Expected failures don't pay for exceptions, and every endpoint responds the same way. The cost is discipline in handlers.
- **A validation pipeline behaviour instead of validation inside handlers.** FluentValidation runs for every command and query in the Mediator pipeline and returns a validation result, so handlers only see valid input.
- **Two interchangeable observability stacks behind Compose profiles.** The app exports OTLP only. `--profile aspire` gives a lightweight dashboard, and `--profile lgtm` gives Grafana with the LGTM stack. Backends can change without touching code.
- **Serilog driven by configuration, with an OpenTelemetry sink.** Logs, traces and metrics share one resource identity and exporter, so they correlate.
- **Adapters as separate projects.** Kafka, persistence and the web API each hide behind an interface, so removing or swapping one doesn't touch the Application layer. The price is more projects and more boilerplate.

## Cloud

The template targets no cloud directly and runs entirely from Docker Compose, so `cloud` is empty. Because it exports plain OTLP and uses Postgres, Kafka and Redis through standard clients, managed equivalents are straightforward targets.

Azure path: Azure Container Apps, Azure Database for PostgreSQL, Azure Cache for Redis, and Application Insights or Azure Monitor through an OTLP collector.
AWS path: ECS or App Runner, RDS, ElastiCache, MSK, and CloudWatch or managed Grafana. Neither has been built.

## What I'd do next

- Enable the architecture tests. The project exists but the dependency rules are still commented out, and enforcement is the point of the template.
- Add a CI workflow that builds, runs tests and builds the container image.
- Add an outbox for Kafka publishing so a database write and its event can't diverge.
