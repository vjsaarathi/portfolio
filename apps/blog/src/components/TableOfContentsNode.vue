<template>
  <li class="toc-node">
    <div class="toc-node__content">
      <a :href="'#' + entry.id" class="toc__link">{{ entry.text }}</a>
      <button 
        v-if="entry.children && entry.children.length > 0" 
        class="toc-node__toggle"
        @click.prevent="isOpen = !isOpen"
        :aria-expanded="isOpen"
      >
        <span class="toc-node__chevron" :class="{ 'toc-node__chevron--open': isOpen }">▼</span>
      </button>
    </div>
    
    <ul v-if="entry.children && entry.children.length > 0" v-show="isOpen" class="toc-node__children">
      <TableOfContentsNode
        v-for="child in entry.children"
        :key="child.id"
        :entry="child"
      />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  entry: { level: number; id: string; text: string; children?: any[] };
}>();

// Keep level 1 (h1) closed by default if there are many sections, but wait...
// Usually users want to see the top-level sections immediately, and the children inside.
// Wait, if it's top-level (h1) and has children, it's collapsed by default?
// If we collapse it by default, the user sees 19 sections immediately!
const isOpen = ref(false);
</script>

<style scoped>
.toc-node {
  list-style: none;
  margin-top: 4px;
}

.toc-node__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.toc-node__toggle {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-tertiary);
}

.toc-node__toggle:hover {
  color: var(--color-text-primary);
}

.toc-node__chevron {
  font-size: 10px;
  transition: transform 0.2s ease;
  transform: rotate(-90deg);
}

.toc-node__chevron--open {
  transform: rotate(0deg);
}

.toc-node__children {
  padding-left: 12px;
  margin-top: 4px;
  margin-bottom: 4px;
  border-left: 1px solid var(--color-border-primary);
}
</style>
