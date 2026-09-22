/**
 * Application Entry Point for Plesk Windows Server & IISNode
 * 
 * In Plesk Node.js Configuration:
 * - Application Startup File: server.js
 * - Application Mode: production
 * - Application Root: / (or domain httpdocs root)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const distServer = path.join(__dirname, 'dist', 'server.cjs');

if (fs.existsSync(distServer)) {
  // Load production compiled server bundle
  require(distServer);
} else {
  // In development environment or before compile
  import('./server.ts').catch((err) => {
    console.error('Failed to initialize server from server.ts:', err);
  });
}
