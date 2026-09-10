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
    description: '',
    language: 'Rust',
    url: 'https://github.com/vjsaarathi/airlane',
    stars: 0,
    topics: ['rust'],
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
    name: 'bpc',
    description: 'A binary protocol workbench for dissecting and building custom protocols.',
    language: 'Rust',
    url: 'https://github.com/vjsaarathi/bpc',
    stars: 0,
    topics: ['rust', 'binary', 'protocol', 'systems-programming'],
    featured: true,
  },
];
