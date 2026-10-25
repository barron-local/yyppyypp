const fs = require('fs');
const pages = JSON.parse(fs.readFileSync('public/pdf_pages/pages.json', 'utf8'));

pages.forEach((p, i) => {
  const text = (p.text || '').replace(/\r/g, '').trim();
  const firstLines = text.split('\n').map(l => l.trim()).filter(Boolean).slice(0, 5).join(' | ');
  console.log(`Page ${i + 1} (${text.length} chars): ${firstLines}`);
});
