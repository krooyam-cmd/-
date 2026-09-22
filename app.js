/**
 * Application Startup File for Plesk Control Panel (Windows Server & Linux)
 * 
 * Plesk Node.js Default Configuration:
 * - Application Startup File: app.js (or server.js)
 * - Application Mode: production
 * - Application Root: / (or domain httpdocs root)
 */

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const distServer = path.join(__dirname, 'dist', 'server.cjs');

try {
  if (fs.existsSync(distServer)) {
    // Load production compiled server bundle (built with esbuild)
    require(distServer);
  } else {
    // Recovery HTTP server: Serves static files if dist/server.cjs is not yet present
    console.warn('dist/server.cjs not found. Starting recovery server...');
    const port = process.env.PORT;
    const server = http.createServer((req, res) => {
      const indexPath = path.join(__dirname, 'dist', 'index.html');
      if (fs.existsSync(indexPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(indexPath).pipe(res);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>ระบบแผนและงบประมาณสถานศึกษา</h1><p>กรุณาตรวจสอบว่ามีโฟลเดอร์ dist/ และไฟล์ dist/server.cjs อยู่ใน httpdocs</p>');
      }
    });

    if (port && isNaN(Number(port))) {
      server.listen(port);
    } else {
      server.listen(Number(port) || 3000, '0.0.0.0');
    }
  }
} catch (err) {
  console.error('Fatal startup error:', err);
  try {
    fs.writeFileSync(path.join(__dirname, 'startup_error.txt'), String(err?.stack || err), 'utf8');
  } catch (_) {}
}
