const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Fast check for common bloat locations
const targetPaths = [
  'C:\\Users\\Woradech\\Downloads',
  'C:\\Users\\Woradech\\Desktop',
  'C:\\Users\\Woradech\\AppData\\Local\\Temp',
  'C:\\Users\\Woradech\\AppData\\Local',
  'C:\\Users\\Woradech\\AppData\\Roaming',
  'C:\\Users\\Woradech\\.VirtualBox',
  'C:\\Users\\Woradech\\VirtualBox VMs',
  'C:\\Users\\Woradech\\.docker',
  'C:\\Windows\\Temp',
  'C:\\Windows\\SoftwareDistribution'
];

console.log('--- Quick Specific Scan ---');
for (const p of targetPaths) {
  if (fs.existsSync(p)) {
    try {
      // Use robocopy /L /S /NJH /NJS /NC /NS to quickly get bytes without listing files
      const cmd = `robocopy "${p}" "C:\\fake_non_existent" /L /S /NJH /NJS /NC /NS /BYTES`;
      let output = '';
      try {
        execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf8' });
      } catch (err) {
        output = err.stdout ? err.stdout.toString() : '';
      }
      // Robocopy summary line contains total bytes or we parse
      const lines = output.trim().split('\n');
      // let's just use a quick recursive node counter with depth limit or dir items
      let totalSize = 0;
      const countSize = (cur, depth = 0) => {
        if (depth > 5) return;
        try {
          const files = fs.readdirSync(cur, { withFileTypes: true });
          for (const f of files) {
            const fp = path.join(cur, f.name);
            if (f.isFile()) totalSize += fs.statSync(fp).size;
            else if (f.isDirectory() && f.name !== 'node_modules') countSize(fp, depth + 1);
          }
        } catch(e) {}
      };
      countSize(p);
      console.log(`${p}: ${(totalSize / (1024**3)).toFixed(2)} GB`);
    } catch (e) {
      console.log(`${p}: Error scanning`);
    }
  } else {
    console.log(`${p}: Not Found`);
  }
}
