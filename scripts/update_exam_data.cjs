const fs = require('fs');
const { sec2Items } = require('./build_sec2_bncc_data.cjs');

const filepath = 'src/data/examQuestionsAndSolutions.js';
const content = fs.readFileSync(filepath, 'utf8');

// Find boundaries of Section 2
const sec2Marker = '// ==========================================================================\n  // ส่วนที่ 2:';
const sec2Start = content.indexOf(sec2Marker);
if (sec2Start === -1) {
  console.error('Could not find sec2Marker');
  process.exit(1);
}

const sec4Marker = '// ==========================================================================\n  // ส่วนที่ 4:';
const sec4Start = content.indexOf(sec4Marker);
if (sec4Start === -1) {
  console.error('Could not find sec4Marker');
  process.exit(1);
}

// Convert sec2Items to formatted JSON-like objects with backticks for multiline strings
function formatItem(item) {
  const codeFormatted = JSON.stringify(item.code);
  const stepsFormatted = JSON.stringify(item.steps, null, 4).replace(/\n/g, '\n    ');
  return `  {
    "id": ${JSON.stringify(item.id)},
    "secId": ${JSON.stringify(item.secId)},
    "qNum": ${JSON.stringify(item.qNum)},
    "pdfPage": ${item.pdfPage},
    "questionText": ${JSON.stringify(item.questionText)},
    "pts": ${item.pts},
    "note": ${JSON.stringify(item.note)},
    "explanation": ${JSON.stringify(item.explanation)},
    "solutionType": ${JSON.stringify(item.solutionType)},
    "lang": ${JSON.stringify(item.lang)},
    "code": ${codeFormatted},
    "steps": ${stepsFormatted},
    "verify": ${JSON.stringify(item.verify)}
  }`;
}

const formattedSec2Items = sec2Items.map(formatItem).join(',\n');

const newSec2Block = `// ==========================================================================
  // ส่วนที่ 2: ตั้งค่าเครือข่ายตามผังระบบเครือข่าย และ DevOps Infra (24 คะแนนเต็ม)
  // หน้า 10, 11, 12 ในเอกสารข้อสอบทางการ
  // (อัปเดตกระบวนการและเทคนิคทางการ 100% ตามแนวทางศูนย์ฝึก VECSkill BNCC)
  // ==========================================================================
${formattedSec2Items},

  `;

const newContent = content.slice(0, sec2Start) + newSec2Block + content.slice(sec4Start);
fs.writeFileSync(filepath, newContent, 'utf8');
console.log('Successfully updated Section 2 in examQuestionsAndSolutions.js!');
