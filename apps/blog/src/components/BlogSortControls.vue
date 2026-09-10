<template>
  <div class="blog-sort">
    <span class="blog-sort__label">Sort by</span>
    <div class="blog-sort__options">
      <button
        v-for="option in sortOptions"
        :key="option.value"
        :class="['blog-sort__btn', { 'blog-sort__btn--active': sortBy === option.value }]"
        @click="$emit('update:sortBy', option.value)"
      >
        {{ option.label }}
      </button>
    </div>
    <button
      class="blog-sort__direction"
      :title="sortDirection === 'desc' ? 'Descending' : 'Ascending'"
      @click="$emit('update:sortDirection', sortDirection === 'desc' ? 'asc' : 'desc')"
    >
      {{ sortDirection === 'desc' ? '↓' : '↑' }}
    </button>
  </div>
</template>

<script setup lang="ts">
type SortField = 'date' | 'readingTime' | 'title';
type SortDirection = 'asc' | 'desc';

defineProps<{
  sortBy: SortField;
  sortDirection: SortDirection;
}>();

defineEmits<{
  (e: 'update:sortBy', value: SortField): void;
  (e: 'update:sortDirection', value: SortDirection): void;
}>();

const sortOptions = [
  { value: 'date' as SortField, label: 'Date' },
  { value: 'readingTime' as SortField, label: 'Reading Time' },
  { value: 'title' as SortField, label: 'Title' },
];
</script>
