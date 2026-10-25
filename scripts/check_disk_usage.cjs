const fs = require('fs');
const path = require('path');

function getFolderSize(dirPath) {
  let total = 0;
  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      try {
        if (item.isDirectory()) {
          // Skip certain system/reparse directories
          if (['$Recycle.Bin', 'System Volume Information', 'Recovery'].includes(item.name)) continue;
          total += getFolderSize(fullPath);
        } else if (item.isFile()) {
          total += fs.statSync(fullPath).size;
        }
      } catch (e) {}
    }
  } catch (e) {}
  return total;
}

const rootDirs = ['C:\\Users\\Woradech', 'C:\\Program Files', 'C:\\Program Files (x86)', 'C:\\Windows', 'C:\\ProgramData'];
console.log('--- Analyzing C: Drive Major Folders ---');
for (const dir of rootDirs) {
  try {
    const size = getFolderSize(dir);
    console.log(`${dir}: ${(size / (1024**3)).toFixed(2)} GB`);
  } catch (e) {
    console.log(`${dir}: Error`);
  }
}
