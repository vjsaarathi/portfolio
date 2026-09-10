export interface Project {
  name: string;
  description: string;
  language: string;
  url: string;
  stars: number;
  topics: string[];
  featured?: boolean;
}

export const projects: Project[] = [
  {
    name: 'odyssey',
    description: 'My journey through technical and functional waters of corporate life — a comprehensive knowledge base and engineering log.',
    language: 'SCSS',
    url: 'https://github.com/vjsaarathi/odyssey',
    stars: 0,
    topics: ['documentation', 'learning', 'scss', 'architecture'],
    featured: true,
  },
  {
    name: 'airlane',
    description: 'A high-performance systems programming project exploring low-level networking primitives, built in Rust for memory safety.',
    language: 'Rust',
    url: 'https://github.com/vjsaarathi/airlane',
    stars: 0,
    topics: ['rust', 'systems-programming', 'networking', 'async'],
    featured: true,
  },
  {
    name: 'kv',
    description: 'A distributed key-value store implementing the RAFT consensus algorithm from scratch in Java, demonstrating log replication & leader election.',
    language: 'Java',
    url: 'https://github.com/vjsaarathi/kv',
    stars: 0,
    topics: ['distributed-systems', 'raft', 'consensus', 'java', 'storage'],
    featured: true,
  },
  {
    name: 'tms',
    description: 'A concurrent task management system built with Go, featuring clean architecture and RESTful API endpoints.',
    language: 'Go',
    url: 'https://github.com/vjsaarathi/tms',
    stars: 0,
    topics: ['go', 'backend', 'api', 'concurrency'],
    featured: true,
  },
  {
    name: 'bpc',
    description: 'A binary protocol workbench for dissecting and building custom protocols.',
    language: 'Rust',
    url: 'https://github.com/vjsaarathi/bpc',
    stars: 0,
    topics: ['rust', 'binary', 'protocol', 'systems-programming'],
    featured: true,
  },
];
