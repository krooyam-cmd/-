#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const projectRoot = path.dirname(__dirname);

// 1. Create polyfill-node18.cjs
const polyfillPath = path.join(projectRoot, 'polyfill-node18.cjs');
const polyfillCode = `// Polyfill for Node.js 18.x compatibility (adds styleText to node:util)
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

module.exports = util;
`;

fs.writeFileSync(polyfillPath, polyfillCode, 'utf8');
console.log('[Node 18 Compatibility] Created polyfill-node18.cjs');

// 2. Patch rolldown in node_modules if present
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
            const content = fs.readFileSync(full, 'utf8');
            if (content.includes('from "node:util"') && content.includes('styleText')) {
              // Replace import { formatWithOptions, styleText } from "node:util";
              const patched = content.replace(
                /import\s*\{\s*formatWithOptions\s*,\s*styleText\s*\}\s*from\s*["']node:util["'];?/g,
                'import { formatWithOptions } from "node:util"; const styleText = (fmt, txt) => (txt !== undefined ? txt : fmt);'
              ).replace(
                /import\s*\{\s*styleText\s*\}\s*from\s*["']node:util["'];?/g,
                'const styleText = (fmt, txt) => (txt !== undefined ? txt : fmt);'
              );
              if (patched !== content) {
                fs.writeFileSync(full, patched, 'utf8');
                console.log('[Node 18 Compatibility] Patched:', path.relative(projectRoot, full));
              }
            }
          }
        } catch (_) {}
      }
    } catch (_) {}
  }

  const rolldownDir = path.join(nodeModules, 'rolldown');
  if (fs.existsSync(rolldownDir)) {
    scanAndPatch(rolldownDir);
  }
}
