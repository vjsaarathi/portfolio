<script>
  export let snippets = {};
  export let selected = '';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function selectSnippet(key) {
    dispatch('select', key);
  }
</script>

<nav class="snippet-gallery glass-card">
  <h3 class="snippet-gallery__title">Architecture Snippets</h3>
  <div class="snippet-gallery__list">
    {#each Object.entries(snippets) as [key, snippet]}
      <button
        class="snippet-gallery__item"
        class:active={selected === key}
        on:click={() => selectSnippet(key)}
      >
        <span class="snippet-gallery__item-title">{snippet.title}</span>
      </button>
    {/each}
  </div>
</nav>
