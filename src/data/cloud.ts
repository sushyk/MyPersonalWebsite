export interface CloudProfile {
  id: 'azure' | 'aws';
  name: string;
  status: string;
  intro: string;
  services: string[];
  next?: string[];
}

// Keep this honest: list only services actually used (Azure) or being studied (AWS).
export const cloud: CloudProfile[] = [
  {
    id: 'azure',
    name: 'Microsoft Azure',
    status: 'Hands-on',
    intro:
      'My day-to-day cloud. I build and ship .NET services on Azure, from serverless functions to App Service with CI/CD and telemetry.',
    services: [
      'Azure Functions',
      'Blob Storage',
      'App Service',
      'Application Insights',
      'Azure DevOps Pipelines',
      '.NET Aspire',
    ],
  },
  {
    id: 'aws',
    name: 'Amazon Web Services',
    status: 'Learning and building',
    intro:
      'I\'m building AWS depth so my designs aren\'t tied to one provider. I map the Azure patterns I use to their AWS equivalents.',
    // TODO(Sushil): adjust to what you are actually studying or have used.
    services: ['Lambda', 'API Gateway', 'S3', 'DynamoDB', 'ECS Fargate', 'AWS CDK'],
    next: [
      'Deploy the SEC filings agentic RAG system to AWS with CDK in C#',
      'AWS Certified Developer – Associate',
    ],
  },
];
