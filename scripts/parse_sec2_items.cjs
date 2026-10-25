const fs = require('fs');
const content = fs.readFileSync('src/data/examQuestionsAndSolutions.js', 'utf8');

// evaluate or parse the array of questions
// Since it's ES module, let's parse or extract the sec2 items
const sec2Start = content.indexOf('// ส่วนที่ 2:');
const sec3Start = content.indexOf('// ส่วนที่ 3:');
const sec2Code = content.slice(sec2Start, sec3Start !== -1 ? sec3Start : content.length);

const itemRegex = /{\s*"id":\s*"([^"]+)",[\s\S]*?"qNum":\s*"([^"]+)",[\s\S]*?"pdfPage":\s*(\d+),[\s\S]*?"questionText":\s*"([^"]+)",[\s\S]*?"pts":\s*(\d+)/g;
let m;
let count = 0;
while ((m = itemRegex.exec(sec2Code)) !== null) {
  count++;
  console.log(`${count}. [${m[1]}] (${m[2]} หน้า ${m[3]} - ${m[5]} คะแนน)`);
  console.log(`   ข้อความ: ${m[4].replace(/\n/g, ' ')}`);
}
