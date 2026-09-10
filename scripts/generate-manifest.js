const fs = require('fs');
const path = require('path');

const manifestPath = path.resolve(__dirname, '../apps/shell/src/manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

manifest.generatedAt = new Date().toISOString();

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('✓ Updated manifest.json timestamp:', manifest.generatedAt);
