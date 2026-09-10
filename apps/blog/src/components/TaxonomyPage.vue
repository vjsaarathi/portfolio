<template>
  <div class="taxonomy-page">
    <div class="taxonomy-page__header">
      <span class="taxonomy-page__type">{{ type }}</span>
      <h2 class="taxonomy-page__title">{{ name }}</h2>
      <p class="taxonomy-page__count">{{ posts.length }} post{{ posts.length !== 1 ? 's' : '' }}</p>
    </div>
    <BlogList :posts="posts" @select="$emit('select', $event)" />
  </div>
</template>

<script setup lang="ts">
import BlogList from './BlogList.vue';

defineProps<{
  type: 'tag' | 'category';
  name: string;
  posts: any[];
}>();

defineEmits<{
  (e: 'select', post: any): void;
}>();
</script>
