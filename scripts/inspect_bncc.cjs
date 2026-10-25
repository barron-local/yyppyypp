const https = require('https');
const fs = require('fs');
const path = require('path');

function get(url) {
  return new Promise((resolve) => {
    https.get(url, { rejectUnauthorized: false }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', err => resolve(''));
  });
}

async function main() {
  const indexHtml = await get('https://vecskill.bncc.ac.th/index.html');
  fs.writeFileSync('bncc_cache/index.html', indexHtml);
  
  const scriptJs = await get('https://vecskill.bncc.ac.th/script.js');
  fs.writeFileSync('bncc_cache/script.js', scriptJs);

  const pageMatches1 = [...indexHtml.matchAll(/data-page="([^"]+)"/g)].map(m => m[1]);
  const pageMatches2 = [...indexHtml.matchAll(/href="pages\/([^"]+)"/g)].map(m => m[1]);
  const scriptMatches = [...scriptJs.matchAll(/pages\/([a-zA-Z0-9_\-]+)\.html/g)].map(m => m[1]);

  const allPages = [...new Set([...pageMatches1, ...pageMatches2, ...scriptMatches])];
  console.log('All found pages:', allPages);

  for (const p of allPages) {
    const filename = p.endsWith('.html') ? p : p + '.html';
    const filePath = path.join('bncc_cache', filename);
    if (!fs.existsSync(filePath)) {
      console.log('Downloading missing page:', filename);
      const content = await get('https://vecskill.bncc.ac.th/pages/' + filename);
      if (content && content.length > 50) {
        fs.writeFileSync(filePath, content);
        console.log('Saved:', filename, 'size:', content.length);
      }
    }
  }
}

main();
