const fs = require('fs');

const raw = fs.readFileSync('src/data/examQuestionsAndSolutions.js', 'utf8');
const startIdx = raw.indexOf('export const examQuestionsAndSolutions = [');
const endIdx = raw.lastIndexOf('];');

if (startIdx !== -1 && endIdx !== -1) {
  const jsonStr = raw.substring(startIdx + 'export const examQuestionsAndSolutions = '.length, endIdx + 1);
  const items = eval(jsonStr);
  const c18 = items.filter(x => x.id.startsWith('c18_') || x.id === 'c20' || x.id === 'c21' || x.id === 'c22');
  c18.forEach(x => {
    console.log(`=== [${x.id}] ${x.questionText.replace(/\n/g, ' ')} ===`);
    console.log(`Keys: ${Object.keys(x).join(', ')}`);
    if (x.code) console.log(`Code preview: ${x.code.slice(0, 100)}...`);
    if (x.steps) console.log(`Steps: ${x.steps.length} steps`);
    console.log('');
  });
}
