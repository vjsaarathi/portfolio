#!/bin/bash
# Start all microfrontend dev servers concurrently with color-coded labels

npx concurrently \
  --names "shell,landing,projects,blog,contact,playground,devtools" \
  --prefix-colors "cyan,blue,green,yellow,red,white,gray" \
  "cd apps/shell && bun run dev" \
  "cd apps/landing && bun run dev" \
  "cd apps/projects && bun run dev" \
  "cd apps/blog && bun run dev" \
  "cd apps/contact && bun run dev" \
  "cd apps/playground && bun run dev" \
  "cd apps/devtools && bun run dev"
