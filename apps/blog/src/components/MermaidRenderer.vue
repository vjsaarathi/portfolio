<template>
  <div v-if="error" class="mermaid-error">
    <span class="mermaid-error__icon">⚠</span>
    <span>Failed to load diagram renderer</span>
  </div>

  <Teleport to="body">
    <div
      v-if="fullscreenData"
      class="diagram-overlay"
      @click.self="closeFullscreen"
    >
      <div class="diagram-overlay__panel">
        <div class="diagram-overlay__toolbar">
          <div class="diagram-overlay__actions">
            <button
              class="diagram-action-btn"
              :class="{ 'diagram-action-btn--success': copyFeedback === 'code' }"
              @click="handleCopyCode"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>{{ copyFeedback === 'code' ? 'Copied!' : 'Code' }}</span>
            </button>
            <button
              class="diagram-action-btn"
              :class="{ 'diagram-action-btn--success': copyFeedback === 'svg' }"
              @click="handleCopySvg"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <span>{{ copyFeedback === 'svg' ? 'Copied!' : 'SVG' }}</span>
            </button>
          </div>
          <button
            class="diagram-action-btn diagram-action-btn--close"
            @click="closeFullscreen"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="diagram-overlay__body" v-html="fullscreenData.svg"></div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps<{
  containerRef?: HTMLElement | null;
}>();

const error = ref(false);
const fullscreenData = ref<{ source: string; svg: string } | null>(null);
const copyFeedback = ref<'code' | 'svg' | null>(null);

let copyTimer: ReturnType<typeof setTimeout> | null = null;

const NODE_FILLS = [
  '#e4d6fa', // light purple
  '#fbdce9', // light pink
  '#d6f0df', // light green
  '#faecd6', // light amber
  '#fadece', // light salmon
  '#d6ebfa', // light blue
];
const NODE_STROKES = [
  '#9871e8',
  '#e678a7',
  '#59b877',
  '#e8a946',
  '#db714d',
  '#59a1e8',
];

const COPY_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
const CHECK_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const EXPAND_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>`;

function wrapDiagram(preEl: HTMLElement, source: string, svgContent: string) {
  if (preEl.closest('.diagram-wrapper')) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'diagram-wrapper';

  const toolbar = document.createElement('div');
  toolbar.className = 'diagram-toolbar';

  const copyBtn = document.createElement('button');
  copyBtn.className = 'diagram-toolbar-btn';
  copyBtn.title = 'Copy code';
  copyBtn.innerHTML = COPY_ICON;
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(source).then(() => {
      copyBtn.classList.add('diagram-toolbar-btn--success');
      copyBtn.innerHTML = CHECK_ICON;
      setTimeout(() => {
        copyBtn.classList.remove('diagram-toolbar-btn--success');
        copyBtn.innerHTML = COPY_ICON;
      }, 2000);
    });
  });

  const svgBtn = document.createElement('button');
  svgBtn.className = 'diagram-toolbar-btn';
  svgBtn.title = 'Copy SVG';
  svgBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`;
  svgBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(svgContent).then(() => {
      svgBtn.classList.add('diagram-toolbar-btn--success');
      svgBtn.innerHTML = CHECK_ICON;
      setTimeout(() => {
        svgBtn.classList.remove('diagram-toolbar-btn--success');
        svgBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`;
      }, 2000);
    });
  });

  const fsBtn = document.createElement('button');
  fsBtn.className = 'diagram-toolbar-btn';
  fsBtn.title = 'View fullscreen';
  fsBtn.innerHTML = EXPAND_ICON;
  fsBtn.addEventListener('click', () => {
    fullscreenData.value = {
      source,
      svg: svgContent,
    };
  });

  const rightActions = document.createElement('div');
  rightActions.className = 'diagram-overlay__actions';
  rightActions.appendChild(copyBtn);
  rightActions.appendChild(svgBtn);
  rightActions.appendChild(fsBtn);
  toolbar.appendChild(rightActions);

  preEl.parentNode?.insertBefore(wrapper, preEl);
  wrapper.appendChild(toolbar);
  
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'diagram-content-wrapper';
  contentWrapper.innerHTML = svgContent;
  wrapper.appendChild(contentWrapper);

  preEl.style.display = 'none';
}

async function initMermaid(container?: HTMLElement | null) {
  try {
    const target = container || document;
    const preElements = Array.from(
      target.querySelectorAll('pre.mermaid:not([data-processed])'),
    );
    if (preElements.length === 0) return;

    // Mark as processed immediately to prevent race conditions
    preElements.forEach(pre => pre.setAttribute('data-processed', 'true'));

    // Load excalidraw conversion logic
    const { parseMermaidToExcalidraw } = await import('@excalidraw/mermaid-to-excalidraw');
    const { convertToExcalidrawElements, exportToSvg } = await import('@excalidraw/excalidraw');

    for (const pre of preElements) {
      const b64 = pre.getAttribute('data-source');
      const source = b64 ? atob(b64) : (pre.textContent || '');
      
      try {
        const { elements, files } = await parseMermaidToExcalidraw(source);
        const excalidrawElements = convertToExcalidrawElements(elements);
        
        let colorIndex = 0;
        for (const el of excalidrawElements) {
          if (el.type === 'rectangle' || el.type === 'ellipse' || el.type === 'diamond') {
            const fill = NODE_FILLS[colorIndex % NODE_FILLS.length];
            const stroke = NODE_STROKES[colorIndex % NODE_STROKES.length];
            el.backgroundColor = fill;
            el.strokeColor = stroke;
            el.fillStyle = 'solid';
            if (el.type === 'rectangle') {
              el.roundness = { type: 3 };
            }
            colorIndex++;
          }
        }

        const svgEl = await exportToSvg({
          elements: excalidrawElements,
          files,
          appState: {
            viewBackgroundColor: 'transparent',
            exportBackground: false,
            exportWithDarkMode: true,
          }
        });
        
        svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svgEl.style.maxWidth = '100%';
        svgEl.style.maxHeight = '100%';

        wrapDiagram(pre as HTMLElement, source, svgEl.outerHTML);
      } catch (err) {
        console.error('Failed to convert mermaid diagram to excalidraw', err);
        // Fallback to mermaid or raw string if needed, but for now we skip rendering it.
      }
    }
  } catch (e) {
    console.error('[MermaidRenderer] Failed to load renderer modules:', e);
    error.value = true;
  }
}

function closeFullscreen() {
  fullscreenData.value = null;
  copyFeedback.value = null;
}

function handleCopyCode() {
  if (!fullscreenData.value) return;
  navigator.clipboard.writeText(fullscreenData.value.source).then(() => {
    copyFeedback.value = 'code';
    if (copyTimer) clearTimeout(copyTimer);
    copyTimer = setTimeout(() => { copyFeedback.value = null; }, 2000);
  });
}

function handleCopySvg() {
  if (!fullscreenData.value) return;
  navigator.clipboard.writeText(fullscreenData.value.svg).then(() => {
    copyFeedback.value = 'svg';
    if (copyTimer) clearTimeout(copyTimer);
    copyTimer = setTimeout(() => { copyFeedback.value = null; }, 2000);
  });
}

function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') closeFullscreen();
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
  requestAnimationFrame(() => initMermaid(props.containerRef));
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape);
  if (copyTimer) clearTimeout(copyTimer);
});

watch(
  () => props.containerRef,
  newContainer => {
    if (newContainer) {
      requestAnimationFrame(() => initMermaid(newContainer));
    }
  },
);
</script>
