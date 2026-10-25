const fs = require('fs');
const path = require('path');

const local = 'C:\\Users\\Woradech\\AppData\\Local';
const roaming = 'C:\\Users\\Woradech\\AppData\\Roaming';

function topSubs(dir) {
  const result = [];
  try {
    const list = fs.readdirSync(dir);
    for (const name of list) {
      const full = path.join(dir, name);
      try {
        let size = 0;
        // check 2 levels deep
        function countFast(p, d = 0) {
          if (d > 3) return;
          try {
            const files = fs.readdirSync(p, { withFileTypes: true });
            for (const f of files) {
              const fp = path.join(p, f.name);
              if (f.isFile()) size += fs.statSync(fp).size;
              else if (f.isDirectory()) countFast(fp, d + 1);
            }
          } catch(e) {}
        }
        countFast(full);
        const gb = (size / (1024**3)).toFixed(2);
        if (parseFloat(gb) > 0.5) {
          result.push({ name, gb });
        }
      } catch(e) {}
    }
  } catch(e) {}
  return result;
}

console.log('Local Top:', JSON.stringify(topSubs(local), null, 2));
console.log('Roaming Top:', JSON.stringify(topSubs(roaming), null, 2));
