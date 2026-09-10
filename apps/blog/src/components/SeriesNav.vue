<template>
  <div class="series-nav" v-if="seriesPosts.length > 1">
    <h4 class="series-nav__title">
      <span class="series-nav__icon">📚</span>
      Series: {{ seriesName }}
    </h4>
    <ol class="series-nav__list">
      <li
        v-for="post in seriesPosts"
        :key="post.slug"
        :class="['series-nav__item', { 'series-nav__item--current': post.slug === currentSlug }]"
      >
        <a
          v-if="post.slug !== currentSlug"
          class="series-nav__link"
          href="#"
          @click.prevent="$emit('navigate', post)"
        >
          {{ post.title }}
        </a>
        <span v-else class="series-nav__current">{{ post.title }}</span>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  seriesName: string;
  seriesPosts: { slug: string; title: string }[];
  currentSlug: string;
}>();

defineEmits<{
  (e: 'navigate', post: { slug: string; title: string }): void;
}>();
</script>
