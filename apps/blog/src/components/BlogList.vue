<template>
  <div class="blog-grid stagger-children">
    <BlogCard
      v-for="post in posts"
      :key="post.id"
      :post="post"
      @select="$emit('select', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import BlogCard from './BlogCard.vue';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: number;
  tags: string[];
  content: string;
  heroImage?: string;
}

defineProps<{
  posts: BlogPost[];
}>();

defineEmits<{
  (e: 'select', post: BlogPost): void;
}>();
</script>
