const fs = require('fs');
const path = require('path');

function getFolderSizeShallow(dir) {
  let size = 0;
  try {
    const list = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of list) {
      const full = path.join(dir, item.name);
      try {
        if (item.isFile()) size += fs.statSync(full).size;
        else if (item.isDirectory()) {
          const sub = fs.readdirSync(full, { withFileTypes: true });
          for (const s of sub) {
            const subFull = path.join(full, s.name);
            if (s.isFile()) size += fs.statSync(subFull).size;
          }
        }
      } catch(e) {}
    }
  } catch(e) {}
  return (size / (1024**3)).toFixed(2);
}

console.log('VirtualBox VMs:', getFolderSizeShallow('C:\\Users\\Woradech\\VirtualBox VMs'), 'GB');
console.log('Docker:', getFolderSizeShallow('C:\\Users\\Woradech\\AppData\\Local\\Docker'), 'GB');
console.log('.android:', getFolderSizeShallow('C:\\Users\\Woradech\\.android'), 'GB');
console.log('Downloads:', getFolderSizeShallow('C:\\Users\\Woradech\\Downloads'), 'GB');
console.log('Desktop:', getFolderSizeShallow('C:\\Users\\Woradech\\Desktop'), 'GB');
