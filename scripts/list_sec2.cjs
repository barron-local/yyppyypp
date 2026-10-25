const fs = require('fs');
const content = fs.readFileSync('src/data/examQuestionsAndSolutions.js', 'utf8');

const regex = /id:\s*'c6_(\d+)'/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const start = match.index;
  const nextMatch = content.indexOf("id: 'c6_", start + 10);
  const block = nextMatch !== -1 ? content.slice(start, nextMatch) : content.slice(start, start + 1500);
  const titleMatch = block.match(/title:\s*['"]([^'"]+)['"]/);
  const scoreMatch = block.match(/score:\s*(\d+)/);
  const officialReqMatch = block.match(/officialRequirement:\s*`([^`]+)`/);
  console.log(`c6_${match[1]} (${scoreMatch ? scoreMatch[1] : '?'} pts): ${titleMatch ? titleMatch[1] : ''}`);
  if (officialReqMatch) {
    console.log('   Official Req:', officialReqMatch[1].trim().slice(0, 100) + '...');
  }
}
