<script>
  export let output = '';
</script>

<div class="output-preview">
  <div class="output-preview__header">
    <span class="output-preview__dot output-preview__dot--red"></span>
    <span class="output-preview__dot output-preview__dot--yellow"></span>
    <span class="output-preview__dot output-preview__dot--green"></span>
    <span class="output-preview__title">Output</span>
  </div>
  <div class="output-preview__body">
    {#if output}
      <pre class="output-preview__content">{output}</pre>
    {:else}
      <p class="output-preview__empty">Run the code to see output</p>
    {/if}
  </div>
</div>
