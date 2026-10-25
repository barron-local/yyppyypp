const fs = require('fs');
const path = require('path');

const rootDirs = ['C:\\Program Files', 'C:\\Program Files (x86)', 'C:\\ProgramData', 'C:\\'];

for (const r of rootDirs) {
  try {
    const list = fs.readdirSync(r);
    for (const name of list) {
      const full = path.join(r, name);
      try {
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          // check if games, steam, riot, etc.
          if (['Steam', 'Riot Games', 'Epic Games', 'Garena', 'NVIDIA', 'Package Cache'].some(k => name.toLowerCase().includes(k.toLowerCase()))) {
            console.log(`Found game/installer folder: ${full}`);
          }
        } else if (stat.isFile()) {
          const gb = (stat.size / (1024**3)).toFixed(2);
          if (parseFloat(gb) > 1.0) {
            console.log(`Root file: ${full} (${gb} GB)`);
          }
        }
      } catch(e) {}
    }
  } catch(e) {}
}
