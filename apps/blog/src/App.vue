<template>
  <section class="blog-section">
    <!-- Single Post View -->
    <div v-if="activePost">
      <button @click="goBack" class="back-button">← Back to Blog</button>
      <BlogPost
        :post="activePost"
        :series-posts="seriesPosts"
        @navigate-tag="navigateToTag"
        @navigate-category="navigateToCategory"
        @navigate-post="selectPost"
      />
    </div>

    <!-- Tag Taxonomy Page -->
    <div v-else-if="activeTag">
      <button @click="goBack" class="back-button">← Back to Blog</button>
      <TaxonomyPage type="tag" :name="activeTag" :posts="tagPosts" @select="selectPost" />
    </div>

    <!-- Category Taxonomy Page -->
    <div v-else-if="activeCategory">
      <button @click="goBack" class="back-button">← Back to Blog</button>
      <TaxonomyPage type="category" :name="activeCategory" :posts="categoryPosts" @select="selectPost" />
    </div>

    <!-- Blog List View (default) -->
    <div v-else>
      <h2 class="section-title">Blog</h2>
      <p class="section-subtitle">
        Thoughts on engineering, architecture, and problem-solving
      </p>

      <!-- Sort Controls -->
      <BlogSortControls
        :sort-by="sortBy"
        :sort-direction="sortDirection"
        @update:sort-by="sortBy = $event"
        @update:sort-direction="sortDirection = $event"
      />

      <!-- Tag & Category Filters -->
      <div class="blog-filters">
        <div class="blog-filters__group">
          <span class="blog-filters__label">Tags</span>
          <div class="blog-filters__chips">
            <button
              v-for="tag in allTags"
              :key="tag"
              class="filter-chip"
              @click="navigateToTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>
        <div class="blog-filters__group" v-if="allCategories.length">
          <span class="blog-filters__label">Categories</span>
          <div class="blog-filters__chips">
            <button
              v-for="cat in allCategories"
              :key="cat"
              class="filter-chip filter-chip--category"
              @click="navigateToCategory(cat)"
            >
              {{ cat }}
            </button>
          </div>
        </div>
      </div>

      <BlogList :posts="posts" @select="selectPost" />
    </div>

    <div class="blog-note" style="margin-top: 2rem;">
      <p>🔧 This section is a <strong>Vue 3</strong> application running inside
        a React shell via Module Federation.</p>
    </div>
  </section>
</template>

<style scoped>
.back-button {
  background: none;
  border: 1px solid var(--color-border-primary);
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  margin-bottom: 2rem;
  border-radius: var(--radius-md);
  transition: all 0.2s;
}
.back-button:hover {
  color: var(--color-text-primary);
  border-color: var(--color-text-primary);
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import BlogList from './components/BlogList.vue';
import BlogPost from './components/BlogPost.vue';
import BlogSortControls from './components/BlogSortControls.vue';
import TaxonomyPage from './components/TaxonomyPage.vue';
import { useBlogPosts } from './composables/useBlogPosts';
import { eventBus } from '@impossible-resume/event-bus';

const {
  posts,
  sortBy,
  sortDirection,
  getPage,
  where,
  allTags,
  allCategories,
  getSeries,
} = useBlogPosts();

const route = ref(window.location.pathname.replace('/portfolio', ''));

function handlePopState() {
  route.value = window.location.pathname.replace('/portfolio', '');
}

let unsubscribeNav: () => void;

onMounted(() => {
  window.addEventListener('popstate', handlePopState);
  unsubscribeNav = eventBus.subscribe(
    'navigation:route_change', 'blog',
    (payload: any) => {
      route.value = payload.data?.to ?? payload.to;
    }
  );
  eventBus.emit('module:viewed', 'blog', { count: posts.value.length });
});

onUnmounted(() => {
  window.removeEventListener('popstate', handlePopState);
  if (unsubscribeNav) unsubscribeNav();
});

const activePost = computed(() => {
  const match = route.value.match(/^\/blog\/(?!tags\/)(?!categories\/)(.+)/);
  if (match) return getPage(match[1]) || null;
  return null;
});

const activeTag = computed(() => {
  const match = route.value.match(/^\/blog\/tags\/(.+)/);
  return match ? decodeURIComponent(match[1]) : null;
});

const activeCategory = computed(() => {
  const match = route.value.match(/^\/blog\/categories\/(.+)/);
  return match ? decodeURIComponent(match[1]) : null;
});

const tagPosts = computed(() =>
  activeTag.value ? where('tags', activeTag.value) : []
);

const categoryPosts = computed(() =>
  activeCategory.value ? where('categories', activeCategory.value) : []
);

const seriesPosts = computed(() =>
  activePost.value?.series
    ? getSeries(activePost.value.series)
    : []
);

function selectPost(post: any) {
  eventBus.emit('navigation:trigger', 'blog', { route: `/blog/${post.slug}` });
}

function navigateToTag(tag: string) {
  eventBus.emit('navigation:trigger', 'blog', {
    route: `/blog/tags/${encodeURIComponent(tag)}`,
  });
}

function navigateToCategory(cat: string) {
  eventBus.emit('navigation:trigger', 'blog', {
    route: `/blog/categories/${encodeURIComponent(cat)}`,
  });
}

function goBack() {
  eventBus.emit('navigation:trigger', 'blog', { route: '/blog' });
}
</script>
