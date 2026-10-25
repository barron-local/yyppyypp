const fs = require('fs');
const data = fs.readFileSync('src/data/examQuestionsAndSolutions.js', 'utf8');
const startIdx = data.indexOf('export const examQuestionsAndSolutions = [');
const endIdx = data.lastIndexOf('];');
const items = eval(data.substring(startIdx + 'export const examQuestionsAndSolutions = '.length, endIdx + 1));
const phase2 = items.filter(x => x.executionPhase === 2);
console.log('Phase 2 items count:', phase2.length);
phase2.forEach(x => console.log(`[${x.id}] ${x.qNum}: ${x.questionText.split('\n')[0]}`));
