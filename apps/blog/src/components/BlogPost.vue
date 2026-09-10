<template>
  <article class="blog-post">
    <div class="blog-post__hero" v-if="post.heroImage">
      <img :src="resolveAssetUrl(post.heroImage)" :alt="post.title" />
    </div>
    <div class="blog-post__header">
      <div class="blog-post__meta">
        <time>{{ post.date }}</time>
        <ReadingTime :minutes="post.readingTime" />
        <span class="blog-post__wordcount">{{ post.wordCount }} words</span>
        <span v-if="post.featured" class="blog-post__featured-badge">⭐ Featured</span>
      </div>
      <h1 class="blog-post__title">{{ post.title }}</h1>
      <div class="blog-post__tags">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="blog-card__tag blog-card__tag--clickable"
          @click="$emit('navigateTag', tag)"
        >
          {{ tag }}
        </span>
        <span
          v-for="cat in post.categories"
          :key="cat"
          class="blog-card__tag blog-card__tag--category"
          @click="$emit('navigateCategory', cat)"
        >
          {{ cat }}
        </span>
      </div>
    </div>

    <SeriesNav
      v-if="post.series && seriesPosts.length > 1"
      :series-name="post.series"
      :series-posts="seriesPosts"
      :current-slug="post.slug"
      @navigate="$emit('navigatePost', $event)"
    />

    <div class="blog-post__layout">
      <TableOfContents
        v-if="post.tableOfContents.length > 0"
        :entries="post.tableOfContents"
      />
      <div
        ref="contentRef"
        class="blog-post__content"
        v-html="post.content"
        @click="handleContentClick"
      />
    </div>

    <MermaidRenderer
      v-if="post.hasMermaid"
      :container-ref="contentRef"
    />
  </article>
</template>

<script setup lang="ts">
import { ref, watchEffect, onUnmounted } from 'vue';
import ReadingTime from './ReadingTime.vue';
import TableOfContents from './TableOfContents.vue';
import SeriesNav from './SeriesNav.vue';
import MermaidRenderer from './MermaidRenderer.vue';
import { resolveAssetUrl } from '../utils/assetUrl';

const props = defineProps<{
  post: {
    id: string;
    slug: string;
    title: string;
    date: string;
    readingTime: number;
    wordCount: number;
    tags: string[];
    categories: string[];
    content: string;
    heroImage?: string | null;
    featured: boolean;
    series: string | null;
    tableOfContents: { level: number; id: string; text: string }[];
    hasMermaid: boolean;
  };
  seriesPosts: { slug: string; title: string }[];
}>();

defineEmits<{
  (e: 'navigateTag', tag: string): void;
  (e: 'navigateCategory', cat: string): void;
  (e: 'navigatePost', post: { slug: string; title: string }): void;
}>();

const contentRef = ref<HTMLElement | null>(null);

function updateMetaTag(attrName: 'name' | 'property', attrValue: string, content: string) {
  let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
  return el as HTMLMetaElement;
}

const injectedMetaTags: HTMLMetaElement[] = [];

watchEffect(() => {
  if (props.post) {
    document.title = `${props.post.title} | Portfolio Blog`;

    // Clear previously injected meta tags
    injectedMetaTags.forEach(el => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
    injectedMetaTags.length = 0;

    const description = props.post.excerpt || `Read about ${props.post.title}`;
    const url = window.location.href;

    injectedMetaTags.push(
      updateMetaTag('name', 'description', description),
      updateMetaTag('property', 'og:title', props.post.title),
      updateMetaTag('property', 'og:description', description),
      updateMetaTag('property', 'og:type', 'article'),
      updateMetaTag('property', 'og:url', url),
      updateMetaTag('name', 'twitter:card', 'summary_large_image'),
      updateMetaTag('name', 'twitter:title', props.post.title),
      updateMetaTag('name', 'twitter:description', description)
    );

    if (props.post.heroImage) {
      // Need full absolute URL for Open Graph images
      const imgUrl = new URL(resolveAssetUrl(props.post.heroImage), window.location.origin).href;
      injectedMetaTags.push(
        updateMetaTag('property', 'og:image', imgUrl),
        updateMetaTag('name', 'twitter:image', imgUrl)
      );
    }
  }
});

onUnmounted(() => {
  document.title = 'Portfolio';
  injectedMetaTags.forEach(el => {
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  });
});

function handleContentClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  const copyBtn = target.closest('.code-block-copy') as HTMLButtonElement | null;
  if (!copyBtn) return;

  const wrapper = copyBtn.closest('.code-block-wrapper');
  if (!wrapper) return;

  const codeEl = wrapper.querySelector('pre code');
  if (!codeEl) return;

  const codeText = codeEl.textContent || '';
  navigator.clipboard.writeText(codeText).then(() => {
    const textSpan = copyBtn.querySelector('.copy-text');
    if (textSpan) {
      const originalText = textSpan.textContent;
      textSpan.textContent = 'Copied!';
      copyBtn.classList.add('code-block-copy--copied');

      setTimeout(() => {
        textSpan.textContent = originalText;
        copyBtn.classList.remove('code-block-copy--copied');
      }, 2000);
    }
  }).catch((err) => {
    console.error('Failed to copy code:', err);
  });
}
</script>
