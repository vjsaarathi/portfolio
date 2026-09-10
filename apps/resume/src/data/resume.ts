export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string[];
  skills: string[];
}

export interface SkillCategory {
  category: string;
  skills: { name: string; level: number }[];
}

export const experiences: Experience[] = [
  {
    role: 'Senior Frontend Architect / Systems Engineer',
    company: 'Distributed Systems & Web Infrastructure',
    period: '2023 — Present',
    description: [
      'Architected module federation microfrontend systems hosting polyglot frameworks (React, Vue 3, Svelte 4) in single host applications.',
      'Built custom runtime event bus infrastructure with real-time telemetry, zero-dependency middleware, and dynamic manifest resolution.',
      'Designed resilient frontend error boundaries with automatic recovery and degraded state fallbacks for high-availability enterprise applications.'
    ],
    skills: ['Module Federation', 'TypeScript', 'React', 'Vue 3', 'Svelte 4', 'Webpack 5', 'Architecture']
  },
  {
    role: 'Systems & Backend Engineer',
    company: 'Open Source & Infrastructure',
    period: '2021 — 2023',
    description: [
      'Implemented distributed consensus algorithms (RAFT) in Java with custom RPC protocol layers for high-throughput KV storage.',
      'Developed low-level networking primitives in Rust (airlane) focusing on memory safety and non-blocking I/O.',
      'Built backend REST APIs in Go (tms) with concurrency patterns, rate limiting, and clean architectural boundaries.'
    ],
    skills: ['Rust', 'Java', 'Go', 'Distributed Systems', 'RAFT Consensus', 'Systems Programming']
  }
];

export const skillCategories: SkillCategory[] = [
  {
    category: 'Architecture & Microfrontends',
    skills: [
      { name: 'Module Federation', level: 95 },
      { name: 'Microfrontends', level: 95 },
      { name: 'Webpack / Bundlers', level: 90 },
      { name: 'Event-Driven Arch', level: 90 },
    ]
  },
  {
    category: 'Frontend Ecosystem',
    skills: [
      { name: 'React & Ecosystem', level: 95 },
      { name: 'TypeScript', level: 95 },
      { name: 'Vue 3', level: 85 },
      { name: 'Svelte 4', level: 85 },
    ]
  },
  {
    category: 'Systems & Languages',
    skills: [
      { name: 'Rust', level: 80 },
      { name: 'Java', level: 85 },
      { name: 'Go', level: 80 },
      { name: 'Distributed Systems', level: 85 },
    ]
  }
];
