const fs = require('fs');
const path = require('path');

function scanDirTopFiles(dir, minSizeMB = 500) {
  const largeFiles = [];
  function walk(currentDir, depth = 0) {
    if (depth > 6) return;
    try {
      const items = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const item of items) {
        const full = path.join(currentDir, item.name);
        try {
          if (item.isFile()) {
            const stat = fs.statSync(full);
            const sizeMB = stat.size / (1024 * 1024);
            if (sizeMB >= minSizeMB) {
              largeFiles.push({ file: full, sizeGB: (sizeMB / 1024).toFixed(2) });
            }
          } else if (item.isDirectory()) {
            if (!['$Recycle.Bin', 'System Volume Information', 'Windows'].includes(item.name)) {
              walk(full, depth + 1);
            }
          }
        } catch(e) {}
      }
    } catch(e) {}
  }
  walk(dir);
  return largeFiles;
}

console.log('--- Finding files larger than 500 MB in C:\\Users ---');
const found = scanDirTopFiles('C:\\Users\\Woradech');
found.sort((a, b) => parseFloat(b.sizeGB) - parseFloat(a.sizeGB));
console.log(JSON.stringify(found.slice(0, 20), null, 2));
