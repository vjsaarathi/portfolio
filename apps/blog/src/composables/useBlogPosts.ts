import { ref, computed, type Ref } from 'vue';
import allPosts from '../data/posts-manifest.js';
import type { BlogPost, Taxonomy } from '../types/blog';

export type SortField = 'date' | 'readingTime' | 'title';
export type SortDirection = 'asc' | 'desc';

export function useBlogPosts() {
  const posts = ref<BlogPost[]>(allPosts);

  const sortBy = ref<SortField>('date');
  const sortDirection = ref<SortDirection>('desc');

  const publishedPosts = computed(() =>
    posts.value.filter(p => !p.draft)
  );

  const sortedPosts = computed(() => {
    const sorted = [...publishedPosts.value];

    sorted.sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;

      let cmp = 0;
      switch (sortBy.value) {
        case 'date':
          cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'readingTime':
          cmp = a.readingTime - b.readingTime;
          break;
        case 'title':
          cmp = a.title.localeCompare(b.title);
          break;
      }

      return sortDirection.value === 'desc' ? -cmp : cmp;
    });

    return sorted;
  });

  function where(field: keyof BlogPost, value: any): BlogPost[] {
    return publishedPosts.value.filter(p => {
      const fieldVal = p[field];
      if (Array.isArray(fieldVal)) return fieldVal.includes(value);
      return fieldVal === value;
    });
  }

  function getPage(slug: string): BlogPost | undefined {
    return posts.value.find(p => p.slug === slug);
  }

  const tagTaxonomy = computed<Taxonomy[]>(() => {
    const tagMap = new Map<string, BlogPost[]>();
    for (const post of publishedPosts.value) {
      for (const tag of post.tags) {
        if (!tagMap.has(tag)) tagMap.set(tag, []);
        tagMap.get(tag)!.push(post);
      }
    }
    return Array.from(tagMap.entries())
      .map(([name, posts]) => ({ name, count: posts.length, posts }))
      .sort((a, b) => b.count - a.count);
  });

  const categoryTaxonomy = computed<Taxonomy[]>(() => {
    const catMap = new Map<string, BlogPost[]>();
    for (const post of publishedPosts.value) {
      for (const cat of post.categories) {
        if (!catMap.has(cat)) catMap.set(cat, []);
        catMap.get(cat)!.push(post);
      }
    }
    return Array.from(catMap.entries())
      .map(([name, posts]) => ({ name, count: posts.length, posts }))
      .sort((a, b) => b.count - a.count);
  });

  const allTags = computed(() => tagTaxonomy.value.map(t => t.name));
  const allCategories = computed(() => categoryTaxonomy.value.map(c => c.name));

  function getSeries(seriesName: string): BlogPost[] {
    return publishedPosts.value
      .filter(p => p.series === seriesName)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  return {
    posts: sortedPosts,
    allPosts: posts,
    sortBy,
    sortDirection,
    where,
    getPage,
    tagTaxonomy,
    categoryTaxonomy,
    allTags,
    allCategories,
    getSeries,
  };
}
