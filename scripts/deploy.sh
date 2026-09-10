#!/bin/bash
set -e

echo "Deploying The Impossible Resume to GitHub Pages..."

# Build all applications
bash scripts/build-all.sh

# Deploy dist folder to gh-pages branch
npx gh-pages -d dist --message "Deploy: $(date +%Y-%m-%d_%H:%M:%S)"

echo "Deployment complete! Live at https://vjsaarathi.github.io/portfolio/"
