<template>
  <span class="blog-card__reading-time">
    <span class="reading-time__icon">📖</span>
    {{ minutes }} min read
  </span>
</template>

<script setup lang="ts">
defineProps<{
  minutes: number;
}>();
</script>
