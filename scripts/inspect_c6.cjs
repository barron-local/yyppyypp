const fs = require('fs');
const data = fs.readFileSync('src/data/examQuestionsAndSolutions.js', 'utf8');
const startIdx = data.indexOf('export const examQuestionsAndSolutions = [');
const endIdx = data.lastIndexOf('];');
const items = eval(data.substring(startIdx + 'export const examQuestionsAndSolutions = '.length, endIdx + 1));
const c6 = items.filter(x => x.id.startsWith('c6_'));
c6.forEach(x => {
  console.log('='.repeat(60));
  console.log(`[${x.id}] ${x.questionText}`);
  console.log('Explanation:', x.explanation);
  console.log('Code:\n', x.code);
});
