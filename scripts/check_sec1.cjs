const fs = require('fs');
const content = fs.readFileSync('src/data/examQuestionsAndSolutions.js', 'utf8');

const sec1Start = content.indexOf('// ส่วนที่ 1:');
const sec2Start = content.indexOf('// ส่วนที่ 2:');
const sec1Content = content.slice(sec1Start, sec2Start);

const itemRegex = /"id":\s*"([^"]+)"[\s\S]*?"qNum":\s*"([^"]+)"[\s\S]*?"questionText":\s*"([^"]+)"[\s\S]*?"pts":\s*([0-9.]+)/g;
let m;
let count = 0;
while ((m = itemRegex.exec(sec1Content)) !== null) {
  count++;
  console.log(`${count}. [${m[1]}] (${m[2]} - ${m[4]} pts): ${m[3].replace(/\n/g, ' ')}`);
}
