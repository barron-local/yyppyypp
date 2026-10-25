const fs = require('fs');
const sec2 = fs.readFileSync('bncc_cache/current_sec2.txt', 'utf8');

const blocks = sec2.split(/\{\s*"id":/g).slice(1);
blocks.forEach((b, i) => {
  const idMatch = b.match(/^\s*"([^"]+)"/);
  const qNumMatch = b.match(/"qNum":\s*"([^"]+)"/);
  const ptsMatch = b.match(/"pts":\s*([0-9.]+)/);
  const qTextMatch = b.match(/"questionText":\s*"([^"]+)"/);
  const hasSteps = b.includes('"steps":');
  const hasCode = b.includes('"code":');
  const hasVerify = b.includes('"verify":');
  console.log(`${i+1}. ID: ${idMatch ? idMatch[1] : '?'}, Q: ${qNumMatch ? qNumMatch[1] : '?'}, Pts: ${ptsMatch ? ptsMatch[1] : '?'}, Code: ${hasCode}, Steps: ${hasSteps}, Verify: ${hasVerify}`);
  console.log('   Text: ' + (qTextMatch ? qTextMatch[1].replace(/\\n/g, ' ') : '').slice(0, 100));
});
