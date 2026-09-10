#!/bin/bash
set -e
echo "Deploying The Impossible Resume to GitHub Pages..."

# Build all applications
bash scripts/build-all.sh

# Deploy dist folder to gh-pages branch manually
cd dist
git init
git checkout -b gh-pages
git add .
git commit -m "Deploy: $(date +%Y-%m-%d_%H:%M:%S)"
git remote add origin https://github.com/vjsaarathi/portfolio.git
git push -f origin gh-pages
cd ..
