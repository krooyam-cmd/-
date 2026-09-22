#!/usr/bin/env node
const path = require('path');
const { spawnSync } = require('child_process');

const projectRoot = path.dirname(__dirname);

console.log('>>> [1/3] Applying Node.js 18 compatibility patch...');
try {
  require('./patch-node18.cjs');
} catch (e) {
  console.warn('Patch warning:', e.message);
}

// Ensure NODE_OPTIONS includes polyfill if polyfill-node18.cjs exists
const polyfillFile = path.join(projectRoot, 'polyfill-node18.cjs');
const nodeOptions = process.env.NODE_OPTIONS || '';
const requireFlag = `-r "${polyfillFile}"`;
const env = {
  ...process.env,
  NODE_OPTIONS: nodeOptions.includes('polyfill-node18.cjs') ? nodeOptions : `${nodeOptions} ${requireFlag}`.trim(),
};

console.log('>>> [2/3] Building frontend with Vite...');
const viteBin = path.join(projectRoot, 'node_modules', 'vite', 'bin', 'vite.js');
const viteRes = spawnSync(process.execPath, [polyfillFile, viteBin, 'build'], {
  cwd: projectRoot,
  stdio: 'inherit',
  env,
});

if (viteRes.status !== 0) {
  // Retry with standard vite
  const fallbackVite = spawnSync(process.execPath, [viteBin, 'build'], {
    cwd: projectRoot,
    stdio: 'inherit',
    env,
  });
  if (fallbackVite.status !== 0) {
    console.error('Vite build failed with code', fallbackVite.status);
    process.exit(fallbackVite.status || 1);
  }
}

console.log('>>> [3/3] Bundling backend server (server.ts -> dist/server.cjs)...');
const esbuild = require('esbuild');
esbuild.buildSync({
  entryPoints: [path.join(projectRoot, 'server.ts')],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  packages: 'external',
  sourcemap: true,
  outfile: path.join(projectRoot, 'dist', 'server.cjs'),
});

console.log('>>> Build completed successfully!');
