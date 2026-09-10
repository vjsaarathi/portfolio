#!/bin/bash
set -e

echo "Building The Impossible Resume (Module Federation Production Build)..."
echo "=========================================================="

export NODE_ENV=production

# Build apps in order
for app in landing projects blog contact playground devtools shell; do
  echo "Building app: $app..."
  cd "apps/$app"
  bun run build
  cd ../..
  echo "✓ $app built successfully"
done

# Assemble distribution output
echo "Assembling distribution directory (dist/)..."
rm -rf dist
mkdir -p dist/remotes

# Copy shell output to dist root
cp -r apps/shell/dist/* dist/

# Create 404.html fallback for GitHub Pages SPA routing
cp dist/index.html dist/404.html

# Copy each remote output to dist/remotes/<name>/
for remote in landing projects blog contact playground devtools; do
  mkdir -p "dist/remotes/$remote"
  cp -r "apps/$remote/dist/"* "dist/remotes/$remote/"
done

# Copy manifest to dist
cp apps/shell/src/manifest.json dist/manifest.json

echo "=========================================================="
echo "Build complete! Production output assembled in ./dist"
