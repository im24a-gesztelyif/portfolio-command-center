import type { CapabilityCluster } from '../types/portfolio'

export const capabilityClusters: CapabilityCluster[] = [
  {
    id: 'languages',
    title: 'Languages',
    note: 'Languages used across personal and school projects.',
    entries: [
      { label: 'JavaScript', state: 'Working', tags: ['Browser', 'Node.js', 'React'] },
      { label: 'Java', state: 'Working', tags: ['Spring Boot', 'OOP'] },
      { label: 'Python', state: 'Working', tags: ['Flask', 'OOP'] },
      { label: 'C#', state: 'Evaluating', tags: ['.NET', 'Learning'] },
      { label: 'SQL', state: 'Working', tags: ['MySQL', 'Relational data'] },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    note: 'Responsive interfaces, routing, component design, and animation.',
    entries: [
      { label: 'React', state: 'Primary', tags: ['Components', 'Routing', 'State'] },
      { label: 'Next.js', state: 'Working', tags: ['App Router', 'Server routes'] },
      { label: 'Tailwind CSS', state: 'Operational', tags: ['Responsive design', 'Layout'] },
      { label: 'Vite', state: 'Operational', tags: ['Development', 'Builds'] },
    ],
  },
  {
    id: 'backend',
    title: 'Backend and Data',
    note: 'APIs, authentication, persistence, and real-time communication.',
    entries: [
      { label: 'Node.js / Express', state: 'Working', tags: ['HTTP', 'Socket.IO'] },
      { label: 'Spring Boot', state: 'Working', tags: ['MVC', 'WebSocket'] },
      { label: 'Flask', state: 'Working', tags: ['Blueprints', 'WTForms'] },
      { label: 'MySQL / Supabase', state: 'Working', tags: ['SQL', 'Authentication'] },
    ],
  },
  {
    id: 'delivery',
    title: 'Development Workflow',
    note: 'Tools used to build, review, validate, and publish projects.',
    entries: [
      { label: 'Git / GitHub', state: 'Operational', tags: ['Branches', 'Pull requests'] },
      { label: 'GitHub Actions', state: 'Working', tags: ['Lint', 'Build', 'Test'] },
      { label: 'Vercel', state: 'Operational', tags: ['Web deployment', 'Preview'] },
      { label: 'REST APIs', state: 'Operational', tags: ['TMDB', 'DummyJSON'] },
    ],
  },
]
