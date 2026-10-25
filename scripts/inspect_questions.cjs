const fs = require('fs');

const raw = fs.readFileSync('src/data/examQuestionsAndSolutions.js', 'utf8');
const startIdx = raw.indexOf('export const examQuestionsAndSolutions = [');
const endIdx = raw.lastIndexOf('];');

if (startIdx !== -1 && endIdx !== -1) {
  const jsonStr = raw.substring(startIdx + 'export const examQuestionsAndSolutions = '.length, endIdx + 1);
  try {
    const items = eval(jsonStr);
    console.log('Total questions parsed:', items.length);
    const phase8 = items.filter(x => x.executionPhase === 8);
    console.log('Phase 8 (Frontend & Tests) items:', phase8.length);
    phase8.forEach(x => {
      console.log(`[${x.id}] ${x.qNum} (Step ${x.executionStep}): ${x.questionText.split('\n')[0]}`);
    });
  } catch (e) {
    console.error('Eval error:', e.message);
  }
}
