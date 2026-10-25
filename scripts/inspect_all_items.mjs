import { examQuestionsAndSolutions } from '../src/data/examQuestionsAndSolutions.js';

console.log('Total items in array:', examQuestionsAndSolutions.length);

const groups = {};
let totalPts = 0;
examQuestionsAndSolutions.forEach((item, idx) => {
  groups[item.secId] = groups[item.secId] || [];
  groups[item.secId].push(item);
  totalPts += item.pts;
});

for (let secId in groups) {
  const secItems = groups[secId];
  const secPts = secItems.reduce((sum, it) => sum + it.pts, 0);
  console.log(`\n==================================================`);
  console.log(`Section: ${secId} (${secItems.length} items, ${secPts.toFixed(2)} pts)`);
  console.log(`==================================================`);
  secItems.forEach((it, i) => {
    console.log(`${i+1}. [${it.id}] ${it.qNum} (P.${it.pdfPage}, ${it.pts} pts): ${it.questionText.split('\n')[0].slice(0, 70)}`);
  });
}

console.log('\n>>> TOTAL SCORE ACROSS ALL ITEMS:', totalPts.toFixed(2), 'PTS <<<');
