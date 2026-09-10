<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  export let code = '';
  export let title = '';

  function handleRun() {
    dispatch('run', { code });
  }
</script>

<div class="code-editor">
  <div class="code-editor__header">
    <span class="code-editor__title">{title}</span>
    <div style="display: flex; gap: var(--space-4);">
      <button class="code-editor__copy" on:click={() => navigator.clipboard?.writeText(code)}>
        📋 Copy
      </button>
      <button class="code-editor__run" on:click={handleRun}>
        ▶ Run Code
      </button>
    </div>
  </div>
  <div class="code-editor__body">
    <div class="code-editor__line-numbers">
      {#each code.split('\n') as _, i}
        <span class="code-editor__line-num">{i + 1}</span>
      {/each}
    </div>
    <textarea class="code-editor__code code-editor__textarea" bind:value={code} spellcheck="false"></textarea>
  </div>
</div>
