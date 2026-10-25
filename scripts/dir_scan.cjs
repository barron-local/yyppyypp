const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getDirSizeFast(target) {
  try {
    const out = execSync(`cmd /c dir /s /a /-c "${target}"`, { stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf8' });
    const lines = out.trim().split('\n');
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      if (line.includes('bytes') && !line.includes('free')) {
        const m = line.match(/([0-9]+)\s+bytes/);
        if (m) return (parseInt(m[1], 10) / (1024**3)).toFixed(2);
      }
    }
  } catch(e) {}
  return '0.00';
}

const userBase = 'C:\\Users\\Woradech';
const entries = fs.readdirSync(userBase);
console.log('--- User Woradech Subfolders ---');
for (const entry of entries) {
  const full = path.join(userBase, entry);
  try {
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      const size = getDirSizeFast(full);
      if (parseFloat(size) > 0.5) {
        console.log(`${entry}: ${size} GB`);
      }
    }
  } catch(e) {}
}
