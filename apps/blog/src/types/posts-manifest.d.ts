declare module '*/posts-manifest.js' {
  import type { BlogPost } from './blog';
  const posts: BlogPost[];
  export default posts;
}
