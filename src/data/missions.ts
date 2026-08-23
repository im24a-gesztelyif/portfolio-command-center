import type { Mission } from '../types/portfolio'

export const missions: Mission[] = [
  {
    slug: 'flavflix-showcase',
    missionId: 'MIS-001',
    codename: 'FlavFlix',
    title: 'Movie discovery and account experience',
    classification: 'Personal Project',
    priority: 'High',
    markerType: 'Array',
    objective:
      'Explore how a polished media-discovery interface, authenticated profiles, and synchronized user state can be built with a modern React stack.',
    systemRole:
      'A learning project for movie and TV discovery, saved titles, profiles, history, and account-backed preferences.',
    stack: ['Next.js', 'React', 'JavaScript', 'Tailwind CSS', 'Supabase', 'TMDB API'],
    functionality: [
      'Search, discovery, title details, people, companies, and collections backed by TMDB metadata.',
      'Account authentication with multiple profiles and synchronized preferences.',
      'Saved titles, history, progress state, responsive layouts, and metadata attribution.',
    ],
    challenges: [
      'Coordinating remote account data with fast client-side state and caching.',
      'Keeping a large media interface consistent across many responsive routes.',
      'Separating the safe public learning showcase from private playback experiments.',
    ],
    outcome:
      'Built to practise full-stack React patterns, external API integration, authentication, and product-level interface consistency.',
    status: 'In Progress',
    repositoryUrl: 'https://github.com/im24a-gesztelyif/flavflix-showcase',
    surveillanceTarget: { id: 'tgt-flavflix', x: 24, y: 36, radius: 16, markerType: 'Array', label: 'FLAVFLIX' },
  },
  {
    slug: 'guess-the-word',
    missionId: 'MIS-002',
    codename: 'Guess the Word',
    title: 'Real-time multiplayer word game',
    classification: 'Personal Project',
    priority: 'High',
    markerType: 'Relay',
    objective:
      'Build a browser game in which players join rooms, receive progressive hints, submit guesses, and follow a synchronized scoreboard.',
    systemRole:
      'An Express and Socket.IO application with server-authoritative room, round, timer, and scoring state.',
    stack: ['Node.js', 'Express', 'Socket.IO', 'JavaScript', 'HTML', 'CSS'],
    functionality: [
      'Public and private rooms with four-character join codes and host controls.',
      'Timed rounds, progressive hints, skip voting, score calculation, and final standings.',
      'Host migration and room cleanup when players disconnect.',
    ],
    challenges: [
      'Keeping all clients synchronized while timers and room membership change.',
      'Handling disconnects without leaving stale rooms or broken game state.',
    ],
    outcome:
      'A complete multiplayer learning project that demonstrates event-driven backend logic and real-time browser communication.',
    status: 'Completed',
    repositoryUrl: 'https://github.com/im24a-gesztelyif/guess-the-word',
    surveillanceTarget: { id: 'tgt-word', x: 62, y: 27, radius: 13, markerType: 'Relay', label: 'WORD' },
  },
  {
    slug: 'smash-a-meerkat',
    missionId: 'MIS-003',
    codename: 'Smash A Meerkat',
    title: 'Spring Boot reaction game',
    classification: 'Learning Project',
    priority: 'Standard',
    markerType: 'Node',
    objective:
      'Learn server-side Java application structure by implementing a keyboard-controlled reaction game with live state updates.',
    systemRole:
      'A Spring Boot application that serves the interface and synchronizes game state through WebSockets.',
    stack: ['Java 17', 'Spring Boot', 'WebSocket', 'Thymeleaf', 'HTML', 'CSS'],
    functionality: [
      'Randomized targets across keyboard-controlled positions.',
      'Score handling, game lifecycle state, impostor targets, and restart flow.',
      'Thread-safe server state exposed to the browser through WebSocket messages.',
    ],
    challenges: [
      'Coordinating time-based game state between server and browser.',
      'Preventing concurrent inputs from corrupting shared state.',
    ],
    outcome:
      'A focused Java learning project covering Spring services, MVC, WebSockets, and synchronized state.',
    status: 'Completed',
    repositoryUrl: 'https://github.com/im24a-gesztelyif/SmashAMeerkat',
    surveillanceTarget: { id: 'tgt-meerkat', x: 44, y: 63, radius: 11, markerType: 'Node', label: 'MEERKAT' },
  },
  {
    slug: 'florenz',
    missionId: 'MIS-004',
    codename: 'Florenz',
    title: 'Interactive Renaissance learning site',
    classification: 'School Project',
    priority: 'Standard',
    markerType: 'Beacon',
    objective:
      'Present research about Renaissance Florence through a structured, visual, and responsive educational website.',
    systemRole:
      'A multi-page React experience covering the economy, banking, the florin, art, architecture, chronology, and sources.',
    stack: ['React', 'Vite', 'JavaScript', 'Tailwind CSS', 'React Router'],
    functionality: [
      'Topic-specific routes with reusable content and layout components.',
      'Interactive historical timeline and responsive navigation.',
      'Dedicated source documentation for the research and visual material.',
    ],
    challenges: [
      'Turning a large research topic into a readable information hierarchy.',
      'Balancing dense historical content with responsive visual design.',
    ],
    outcome:
      'An independently implemented school project combining research, content architecture, and frontend development.',
    status: 'Completed',
    repositoryUrl: 'https://github.com/im24a-gesztelyif/florenz',
    surveillanceTarget: { id: 'tgt-florenz', x: 76, y: 60, radius: 12, markerType: 'Beacon', label: 'FLORENZ' },
  },
  {
    slug: 'react-shop-demo',
    missionId: 'MIS-005',
    codename: 'React Shop',
    title: 'Product catalogue learning project',
    classification: 'School Project',
    priority: 'Standard',
    markerType: 'Node',
    objective:
      'Practise API consumption, routing, reusable components, search, and pagination in a small commerce-style interface.',
    systemRole:
      'A Vite-powered React catalogue that loads products from DummyJSON and exposes list and detail routes.',
    stack: ['React', 'Vite', 'JavaScript', 'Tailwind CSS', 'React Router', 'DummyJSON'],
    functionality: [
      'Remote product catalogue with loading and failure handling.',
      'Search and page-based navigation over the product API.',
      'Reusable product cards, details, shared layout, and not-found route.',
    ],
    challenges: [
      'Keeping pagination state aligned with search queries.',
      'Building a consistent route and component hierarchy from a starter exercise.',
    ],
    outcome:
      'A practical school exercise for strengthening React fundamentals and external API integration.',
    status: 'In Progress',
    repositoryUrl: 'https://github.com/im24a-gesztelyif/react-shop-demo',
    surveillanceTarget: { id: 'tgt-shop', x: 35, y: 73, radius: 10, markerType: 'Node', label: 'SHOP' },
  },
  {
    slug: 'flask-task-planner',
    missionId: 'MIS-006',
    codename: 'Task Planner',
    title: 'Authenticated Flask and MySQL planner',
    classification: 'School Project',
    priority: 'High',
    markerType: 'Relay',
    objective:
      'Learn backend routing, relational data access, forms, authentication, and CRUD operations through a task-management application.',
    systemRole:
      'A Flask application with modular blueprints and MySQL persistence for users, tasks, priorities, categories, progress, files, and materials.',
    stack: ['Python', 'Flask', 'MySQL', 'WTForms', 'HTML', 'CSS'],
    functionality: [
      'Registration and login with password hashing and session-based access.',
      'Per-user task creation, updates, deletion, categories, priorities, and progress.',
      'Supporting endpoints for materials, files, and task relationships.',
    ],
    challenges: [
      'Keeping database access and route responsibilities separated across blueprints.',
      'Maintaining user ownership boundaries across task operations.',
    ],
    outcome:
      'A full-stack learning project that demonstrates server-rendered forms, authentication, SQL-backed CRUD, and modular Flask structure.',
    status: 'Completed',
    repositoryUrl: 'https://github.com/im24a-gesztelyif/flask-task-planner',
    surveillanceTarget: { id: 'tgt-planner', x: 66, y: 75, radius: 10, markerType: 'Relay', label: 'PLANNER' },
  },
]
