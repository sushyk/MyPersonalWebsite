export const skills: { group: string; items: string[] }[] = [
  {
    group: 'Backend',
    items: ['C#', '.NET', 'ASP.NET Core', 'REST APIs', 'Microservices', 'Clean Architecture', 'TDD', 'PostgreSQL'],
  },
  {
    group: 'Frontend',
    items: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Angular'],
  },
  {
    group: 'AI engineering',
    items: ['Microsoft Agent Framework', 'Agentic RAG', 'Model Context Protocol (MCP)', 'pgvector', 'Ollama', 'OpenAI-compatible APIs'],
  },
  {
    group: 'Cloud and DevOps',
    items: ['Azure', 'AWS', 'Docker', '.NET Aspire', 'OpenTelemetry', 'GitHub Actions', 'Azure DevOps', 'CI/CD'],
  },
];

// TODO(Sushil): add certifications. Section is hidden while empty.
export const certifications: { name: string; issuer: string; year: string; url?: string }[] = [];
