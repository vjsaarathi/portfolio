export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  draft: boolean;
  description: string;
  excerpt: string;
  tags: string[];
  categories: string[];
  author: string;
  featured: boolean;
  series: string | null;
  heroImage: string | null;
  readingTime: number;
  content: string;
  tableOfContents: TocEntry[];
  wordCount: number;
  hasMermaid: boolean;
}

export interface TocEntry {
  level: number;
  id: string;
  text: string;
}

export interface Taxonomy {
  name: string;
  count: number;
  posts: BlogPost[];
}
