const fs = require('fs');
const pages = JSON.parse(fs.readFileSync('public/pdf_pages/pages.json', 'utf8'));

for (let pNum = 9; pNum <= 28; pNum++) {
  const p = pages[pNum - 1];
  const lines = (p.text || '').split('\n').map(l => l.trim()).filter(Boolean);
  const titles = lines.filter(l => l.includes('ส่วนที่') || l.includes('1.') || l.includes('2.') || l.includes('3.') || l.includes('4.') || l.includes('5.'));
  console.log(`Page ${pNum}:`, titles.slice(0, 4).join(' -- '));
}
