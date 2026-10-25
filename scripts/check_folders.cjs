const fs = require('fs');
const path = require('path');

function checkFolderDirect(folderPath) {
  if (!fs.existsSync(folderPath)) return 0;
  let size = 0;
  try {
    const files = fs.readdirSync(folderPath);
    for (const f of files) {
      try {
        const fp = path.join(folderPath, f);
        const s = fs.statSync(fp);
        if (s.isFile()) size += s.size;
      } catch(e) {}
    }
  } catch(e) {}
  return (size / (1024**3)).toFixed(2);
}

const userDirs = [
  'C:\\Users\\Woradech\\Downloads',
  'C:\\Users\\Woradech\\Desktop',
  'C:\\Users\\Woradech\\Documents',
  'C:\\Users\\Woradech\\Videos',
  'C:\\Users\\Woradech\\Pictures',
  'C:\\Users\\Woradech\\VirtualBox VMs',
  'C:\\Users\\Woradech\\AppData\\Local\\Temp',
  'C:\\Users\\Woradech\\AppData\\Local\\npm-cache',
  'C:\\Users\\Woradech\\AppData\\Local\\Docker',
  'C:\\Users\\Woradech\\.cache',
  'C:\\Users\\Woradech\\.gradle',
  'C:\\Users\\Woradech\\.android',
  'C:\\Windows\\Temp'
];

console.log('--- Direct Folder Sizes ---');
for (const d of userDirs) {
  if (fs.existsSync(d)) {
    console.log(`${d}: exists`);
  }
}
