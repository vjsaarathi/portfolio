<template>
  <article class="blog-card glass-card" @click="$emit('select', post)">
    <div class="blog-card__hero" v-if="post.heroImage">
      <img :src="resolveAssetUrl(post.heroImage)" :alt="post.title" class="blog-card__hero-img" />
    </div>
    <div class="blog-card__body">
      <div class="blog-card__meta">
        <time>{{ post.date }}</time>
        <ReadingTime :minutes="post.readingTime" />
      </div>
      <div class="blog-card__title-row">
        <h3 class="blog-card__title">{{ post.title }}</h3>
        <span v-if="post.featured" class="blog-card__featured" title="Featured">⭐</span>
      </div>
      <p class="blog-card__excerpt">{{ post.excerpt || post.description }}</p>
      <div class="blog-card__tags">
        <span v-for="tag in post.tags" :key="tag" class="blog-card__tag">{{ tag }}</span>
        <span v-for="cat in post.categories" :key="cat" class="blog-card__tag blog-card__tag--category">{{ cat }}</span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import ReadingTime from './ReadingTime.vue';
import { resolveAssetUrl } from '../utils/assetUrl';

interface BlogPostData {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  date: string;
  readingTime: number;
  tags: string[];
  categories: string[];
  content: string;
  heroImage?: string | null;
  featured: boolean;
}

defineProps<{
  post: BlogPostData;
}>();

defineEmits<{
  (e: 'select', post: BlogPostData): void;
}>();
</script>
