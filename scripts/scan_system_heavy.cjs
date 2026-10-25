const fs = require('fs');
const path = require('path');

function getQuickFolderGB(dir) {
  let size = 0;
  function walk(p, d = 0) {
    if (d > 4) return;
    try {
      const list = fs.readdirSync(p, { withFileTypes: true });
      for (const item of list) {
        const full = path.join(p, item.name);
        if (item.isFile()) size += fs.statSync(full).size;
        else if (item.isDirectory()) walk(full, d + 1);
      }
    } catch(e) {}
  }
  walk(dir);
  return (size / (1024**3)).toFixed(2);
}

console.log('Steam:', getQuickFolderGB('C:\\Program Files (x86)\\Steam'), 'GB');
console.log('Package Cache:', getQuickFolderGB('C:\\ProgramData\\Package Cache'), 'GB');
console.log('Windows Installer:', getQuickFolderGB('C:\\Windows\\Installer'), 'GB');
console.log('Windows WinSxS:', getQuickFolderGB('C:\\Windows\\WinSxS'), 'GB');
