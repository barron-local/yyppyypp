const fs = require('fs');
const pages = JSON.parse(fs.readFileSync('public/pdf_pages/pages.json', 'utf8'));

for (let p = 12; p <= 17; p++) {
  console.log(`\n=================== PAGE ${p + 1} ===================`);
  console.log(pages[p].text);
}
