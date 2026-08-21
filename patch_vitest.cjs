const fs = require('fs');

// 1. package.json
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts.test = 'vitest run';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2), 'utf8');

// 2. vite.config.ts
let viteConfig = fs.readFileSync('vite.config.ts', 'utf8');

const target = `export default defineConfig({`;
const replacement = `/// <reference types="vitest" />\nexport default defineConfig({\n  test: {\n    environment: 'jsdom',\n    globals: true,\n    setupFiles: './src/test/setup.ts',\n  },`;

if (!viteConfig.includes('vitest')) {
  viteConfig = viteConfig.replace(target, replacement);
  fs.writeFileSync('vite.config.ts', viteConfig, 'utf8');
}
