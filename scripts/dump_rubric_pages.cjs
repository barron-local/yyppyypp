const fs = require('fs');
const pages = JSON.parse(fs.readFileSync('public/pdf_pages/pages.json', 'utf8'));

// Let's inspect pages 8 to 22 which usually contain the evaluation rubrics and scores
for (let i = 6; i < 22; i++) {
  const p = pages[i];
  console.log(`\n======================================================`);
  console.log(`PAGE ${i + 1}`);
  console.log(`======================================================`);
  const lines = (p.text || '').split('\n').map(l => l.trim()).filter(Boolean);
  // filter out standard header
  const contentLines = lines.filter(l => !l.includes('เกณฑ์ กติกา การแข่งขันทักษะวิชาชีพ') && 
                                         !l.includes('ประเภทวิชาอุตสาหกรรมดิจิตอล') && 
                                         !l.includes('กลุ่มอาชีพซอฟต์แวร์และการประยุกต์') &&
                                         !l.includes('สาขาวิชาเทคโนโลยีสารสนเทศ') &&
                                         !l.includes('และสาขาวิชาเครือข่ายคอมพิวเตอร์') &&
                                         !l.includes('ทักษะเทคโนโลยีสารสนเทศด้านโปรแกรมและเครือข่ายด้วยกระบวนการ DevOps'));
  console.log(contentLines.join('\n'));
}
