<template>
  <details class="toc" v-if="entries.length > 0" open>
    <summary class="toc__summary">
      <h4 class="toc__title">Table of Contents</h4>
      <span class="toc__chevron">▼</span>
    </summary>
    <ul class="toc__list">
      <TableOfContentsNode
        v-for="entry in entries"
        :key="entry.id"
        :entry="entry"
      />
    </ul>
  </details>
</template>

<script setup lang="ts">
import TableOfContentsNode from './TableOfContentsNode.vue';

defineProps<{
  entries: { level: number; id: string; text: string; children?: any[] }[];
}>();
</script>
