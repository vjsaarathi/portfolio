<script>
  import { eventBus } from '@impossible-resume/event-bus';
  import { moduleTracker } from '@impossible-resume/runtime-tracker';
  import { onMount } from 'svelte';
  import CodeEditor from './components/CodeEditor.svelte';
  import OutputPreview from './components/OutputPreview.svelte';
  import SnippetGallery from './components/SnippetGallery.svelte';

  onMount(() => {
    eventBus.emit('module:viewed', 'playground', { section: 'editor' });
  });

  let selectedSnippet = 'ts-console';

  const snippets = {
    'ts-console': {
      title: '1. JS/TS Console Execution',
      language: 'typescript',
      code: `// MISSION: Execute TypeScript/JavaScript and view live console logs!
//
// You can use console.log, console.warn, console.info, and console.error.
// TypeScript annotations like type interfaces and variable types are stripped automatically.

interface Metric {
  name: string;
  value: number;
}

const speedMetric: Metric = { name: "Render FPS", value: 60 };

console.log("🚀 Playground initialized!");
console.info("Executing TS script with metric:", speedMetric);
console.warn("Simulating warning event...");

// Compute sum using JS/TS array methods
const numbers: number[] = [10, 20, 30, 40, 50];
const total: number = numbers.reduce((acc, curr) => acc + curr, 0);

console.log("Calculated array sum:", total);

return { status: "Success", speedMetric, total };`,
      output: '> Ready to run',
    },
    'trigger-nav': {
      title: '2. Global Navigation via Events',
      language: 'javascript',
      code: `// MISSION: Navigate the React Shell from this Svelte remote.
//
// 1. We don't have access to React Router here in Svelte.
// 2. Instead, we emit a 'navigation:trigger' event.
// 3. The React Shell listens for this event and executes the routing.

console.log("Emitting navigation trigger to React Shell...");

eventBus.emit('navigation:trigger', 'playground', { 
  route: '/projects'
});

return "Navigation event emitted! The Shell will now route you to /projects.";`,
      output: '> Ready to run',
    },
    'inspect-modules': {
      title: '3. Query Live Architecture',
      language: 'javascript',
      code: `// MISSION: Query the Runtime Tracker to see live microfrontends.
//
// The Runtime Tracker constantly monitors the module federation 
// lifecycle. We can query it to see exactly what framework each 
// remote is using.

const modules = moduleTracker.getModules();

console.log(\`Found \${modules.length} active microfrontends in workspace\`);
modules.forEach(m => console.info(\`Remote [\${m.name}] running on \${m.framework}\`));

return modules.map(m => ({
  name: m.name,
  status: m.status,
  framework: m.framework
}));`,
      output: '> Ready to run',
    },
    'sim-chaos': {
      title: '4. Chaos Engineering',
      language: 'javascript',
      code: `// MISSION: Inject failure into a remote module.
//
// This platform is resilient. If a remote crashes, the Shell catches it.
// We can test this by emitting a chaos engineering event.

console.warn("Injecting simulated network failure into Contact module...");

eventBus.emit('ops:failure_injected', 'playground', {
  module: 'contact',
  failure: 'disconnect_contact'
});

return "Chaos injected! Go to the Contact page to see the Error Boundary in action.";`,
      output: '> Ready to run',
    },
    'custom-event': {
      title: '5. Broadcast Custom Telemetry',
      language: 'javascript',
      code: `// MISSION: Send a custom event and watch the DevTools catch it.

console.log("Broadcasting telemetry payload...");

eventBus.emit('custom:hello_world', 'playground', {
  message: "I am broadcasting from Svelte to React!"
});

return "Check the Event Timeline in the DevTools to see your custom event!";`,
      output: '> Ready to run',
    }
  };

  function handleSelectSnippet(event) {
    selectedSnippet = event.detail;
    eventBus.emit('playground:snippet_selected', 'playground', { snippet: event.detail });
  }

  let currentCode = '';
  let currentOutput = '';

  $: {
    currentCode = snippets[selectedSnippet].code;
    currentOutput = snippets[selectedSnippet].output;
  }

  function stripTypeScript(code) {
    return code
      .replace(/^(type|interface)\s+\w+[\s\S]*?(\n\n|\n(?=[a-zA-Z]))/gm, '')
      .replace(/:\s*([A-Z][a-zA-Z0-9_<>|&]*|string|number|boolean|any|void|object|unknown|never)(\[\])?(?=[,\)\s=;])/g, '')
      .replace(/\s+as\s+([A-Z][a-zA-Z0-9_]*|string|number|boolean|any)/g, '');
  }

  function handleRunCode(event) {
    const executedCode = event.detail.code;
    currentOutput = '> Executing...';
    eventBus.emit('playground:run_code', 'playground', { length: executedCode.length });

    setTimeout(() => {
      const logs = [];
      
      const customConsole = {
        log: (...args) => {
          logs.push({ type: 'log', message: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') });
        },
        warn: (...args) => {
          logs.push({ type: 'warn', message: '⚠️ ' + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') });
        },
        error: (...args) => {
          logs.push({ type: 'error', message: '❌ ' + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') });
        },
        info: (...args) => {
          logs.push({ type: 'info', message: 'ℹ️ ' + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') });
        }
      };

      try {
        const jsCode = stripTypeScript(executedCode);
        const executor = new Function('eventBus', 'moduleTracker', 'console', jsCode);
        const result = executor(eventBus, moduleTracker, customConsole);

        let outputText = '';
        if (logs.length > 0) {
          outputText += `📋 CONSOLE LOGS (${logs.length}):\n` + logs.map(l => `  [${l.type.toUpperCase()}] ${l.message}`).join('\n') + `\n\n`;
        }
        
        if (result !== undefined) {
          outputText += `RETURN VALUE:\n` + (typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result));
        } else if (logs.length === 0) {
          outputText += `> Code executed cleanly with no logs or return value.`;
        }

        currentOutput = outputText;
      } catch (err) {
        let outputText = '';
        if (logs.length > 0) {
          outputText += `📋 CONSOLE LOGS BEFORE CRASH (${logs.length}):\n` + logs.map(l => `  [${l.type.toUpperCase()}] ${l.message}`).join('\n') + `\n\n`;
        }
        outputText += `❌ RUNTIME ERROR:\n${err.message}`;
        currentOutput = outputText;
      }
    }, 300);
  }
</script>

<section class="playground-section">
  <h2 class="section-title">Playground</h2>
  <p class="section-subtitle">Execute JS/TS code live and inspect architecture telemetry</p>

  <div class="playground-layout">
    <SnippetGallery
      {snippets}
      selected={selectedSnippet}
      on:select={handleSelectSnippet}
    />

    <div class="playground-editor-area">
      <CodeEditor
        bind:code={currentCode}
        title={snippets[selectedSnippet].title}
        on:run={handleRunCode}
      />
      <OutputPreview
        output={currentOutput}
      />
    </div>
  </div>

  <div class="playground-note">
    <p>🔧 This section is a <strong>Svelte 4</strong> application running inside a React shell via Module Federation.</p>
  </div>
</section>
