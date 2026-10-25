const fs = require('fs');
const content = fs.readFileSync('src/data/examQuestionsAndSolutions.js', 'utf8');

const secMatches = [...content.matchAll(/"secId":\s*"([^"]+)"|secId:\s*'([^']+)'/g)];
const secCounts = {};
secMatches.forEach(m => {
  const id = m[1] || m[2];
  secCounts[id] = (secCounts[id] || 0) + 1;
});
console.log('Question counts by section:', secCounts);

// Let's inspect sectionsMeta
const metaMatch = content.match(/export const sectionsMeta = (\[[\s\S]*?\]);/);
if (metaMatch) {
  try {
    const meta = eval(metaMatch[1]);
    console.log('sectionsMeta:', meta);
  } catch (e) {
    console.log('meta raw:', metaMatch[1].slice(0, 300));
  }
}
