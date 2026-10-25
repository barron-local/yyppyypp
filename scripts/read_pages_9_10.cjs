const fs = require('fs');
const pages = JSON.parse(fs.readFileSync('public/pdf_pages/pages.json', 'utf8'));

console.log('=== PAGE 9 ===');
console.log(pages[8].text);

console.log('\n=== PAGE 10 ===');
console.log(pages[9].text);
