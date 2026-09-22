// Polyfill for Node.js 18.x compatibility (adds styleText and parseEnv to node:util)
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
        open += '\u001b[' + codes[f][0] + 'm';
        close = '\u001b[' + codes[f][1] + 'm' + close;
      }
    }
    return open + text + close;
  };
}

if (!util.parseEnv) {
  util.parseEnv = function (content) {
    const result = {};
    if (!content) return result;
    const lines = String(content).split(/\r?\n/);
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
