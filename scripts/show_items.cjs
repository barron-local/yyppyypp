const fs = require('fs');
const content = fs.readFileSync('src/data/examQuestionsAndSolutions.js', 'utf8');

function showItem(id) {
  const start = content.indexOf('"id": "' + id + '"');
  if (start === -1) {
    console.log('Not found:', id);
    return;
  }
  const end = content.indexOf('"id": "', start + 10);
  const block = end !== -1 ? content.slice(start, end) : content.slice(start, start + 3000);
  console.log('==================== ' + id + ' ====================');
  console.log(block);
}

['c8_1', 'c8_2', 'c11_2', 'c11_3', 'c12_1', 'c12_3'].forEach(showItem);
