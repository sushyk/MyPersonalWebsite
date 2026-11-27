export interface Role {
  company: string;
  title: string;
  start: string; // e.g. 'Jan 2023'
  end: string; // e.g. 'Present'
  points: string[]; // 2-4 impact bullets, with numbers where possible
}

// TODO(Sushil): fill in from your CV. The Experience section stays hidden while this is empty.
// Example:
// {
//   company: 'Acme Ltd',
//   title: 'Software Engineer',
//   start: 'Jan 2023',
//   end: 'Present',
//   points: [
//     'Split a monolith order API into three services on Azure, cutting p95 latency from 900ms to 250ms.',
//     'Introduced contract tests in Azure DevOps pipelines; release rollbacks dropped from monthly to none in 6 months.',
//   ],
// },
export const experience: Role[] = [];
