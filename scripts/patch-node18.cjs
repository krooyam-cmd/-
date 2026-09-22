#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const projectRoot = path.dirname(__dirname);

// 1. Create polyfill-node18.cjs
const polyfillPath = path.join(projectRoot, 'polyfill-node18.cjs');
const polyfillCode = `// Polyfill for Node.js 18.x compatibility (adds styleText and parseEnv to node:util)
const util = require('node:util');

if (!util.styleText) {
  const codes = {
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29],
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    gray: [90, 39],
    grey: [90, 39],
  };

  util.styleText = function (format, text) {
    if (text === undefined) return format || '';
    const formatList = Array.isArray(format) ? format : [format];
    let open = '';
    let close = '';
    for (const f of formatList) {
      if (codes[f]) {
        open += '\\u001b[' + codes[f][0] + 'm';
        close = '\\u001b[' + codes[f][1] + 'm' + close;
      }
    }
    return open + text + close;
  };
}

if (!util.parseEnv) {
  util.parseEnv = function (content) {
    const result = {};
    if (!content) return result;
    const lines = String(content).split(/\\r?\\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        result[key] = val;
      }
    }
    return result;
  };
}

module.exports = util;
`;

fs.writeFileSync(polyfillPath, polyfillCode, 'utf8');
console.log('[Node 18 Compatibility] Created polyfill-node18.cjs');

// 2. Patch rolldown and vite in node_modules if present
const nodeModules = path.join(projectRoot, 'node_modules');
if (fs.existsSync(nodeModules)) {
  function scanAndPatch(dir) {
    try {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const full = path.join(dir, file);
        try {
          const stat = fs.statSync(full);
          if (stat.isDirectory()) {
            if (file === '.bin' || file === '.cache') continue;
            scanAndPatch(full);
          } else if (file.endsWith('.mjs') || file.endsWith('.js')) {
            let content = fs.readFileSync(full, 'utf8');
            let modified = false;

            // Patch named import of styleText from "node:util"
            if (content.includes('from "node:util"') && content.includes('styleText')) {
              content = content.replace(
                /import\s*\{\s*formatWithOptions\s*,\s*styleText\s*\}\s*from\s*["']node:util["'];?/g,
                'import { formatWithOptions } from "node:util"; const styleText = (fmt, txt) => (txt !== undefined ? txt : fmt);'
              ).replace(
                /import\s*\{\s*styleText\s*\}\s*from\s*["']node:util["'];?/g,
                'const styleText = (fmt, txt) => (txt !== undefined ? txt : fmt);'
              );
              modified = true;
            }

            // Patch named import of parseEnv from "node:util" (Node 18 lacks parseEnv)
            if (content.includes('from "node:util"') && (content.includes('parseEnv') || content.includes('parseEnv('))) {
              if (content.includes('parseEnv,') || content.includes(', parseEnv') || content.includes('parseEnv }') || content.includes('{ parseEnv')) {
                content = content.replace(/,\s*parseEnv\b/g, '').replace(/\bparseEnv\s*,\s*/g, '').replace(/\{\s*parseEnv\s*\}/g, '{ }');
                if (!content.includes('const parseEnv =')) {
                  content = content.replace(
                    /(import\s*\{[^}]+\}\s*from\s*["']node:util["'];?)/,
                    `$1\nconst parseEnv = (c) => { const r = {}; if (!c) return r; String(c).split(/\\r?\\n/).forEach(l => { const t = l.trim(); if (!t || t.startsWith('#')) return; const i = t.indexOf('='); if (i > 0) { let v = t.slice(i+1).trim(); if ((v.startsWith('"')&&v.endsWith('"'))||(v.startsWith("'")&&v.endsWith("'"))) v = v.slice(1,-1); r[t.slice(0,i).trim()] = v; } }); return r; };\n`
                  );
                }
                modified = true;
              } else if (!content.includes('const parseEnv =') && content.includes('parseEnv(')) {
                content = content.replace(
                  /(import\s*\{[^}]+\}\s*from\s*["']node:util["'];?)/,
                  `$1\nconst parseEnv = (c) => { const r = {}; if (!c) return r; String(c).split(/\\r?\\n/).forEach(l => { const t = l.trim(); if (!t || t.startsWith('#')) return; const i = t.indexOf('='); if (i > 0) { let v = t.slice(i+1).trim(); if ((v.startsWith('"')&&v.endsWith('"'))||(v.startsWith("'")&&v.endsWith("'"))) v = v.slice(1,-1); r[t.slice(0,i).trim()] = v; } }); return r; };\n`
                );
                modified = true;
              }
            }

            if (modified) {
              fs.writeFileSync(full, content, 'utf8');
              console.log('[Node 18 Compatibility] Patched:', path.relative(projectRoot, full));
            }
          }
        } catch (_) {}
      }
    } catch (_) {}
  }

  const dirsToPatch = ['rolldown', 'vite'];
  for (const d of dirsToPatch) {
    const targetDir = path.join(nodeModules, d);
    if (fs.existsSync(targetDir)) {
      scanAndPatch(targetDir);
    }
  }
}
