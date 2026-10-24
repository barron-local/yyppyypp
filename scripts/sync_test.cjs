const fs = require('fs');

const apiTest = fs.readFileSync('devops-exam-project/backend/tests/api.test.js', 'utf8').replace(/\r\n/g, '\n');
let bc = fs.readFileSync('src/data/backendCode.js', 'utf8').replace(/\r\n/g, '\n');

const searchStr = 'path: "backend/tests/api.test.js"';
const pos = bc.indexOf(searchStr);
const codeStart = bc.indexOf('code: `', pos) + 7;
const codeEnd = bc.indexOf('`\n      }\n    ]\n  },', codeStart);

if (pos !== -1 && codeStart !== -1 && codeEnd !== -1) {
  bc = bc.substring(0, codeStart) + apiTest + bc.substring(codeEnd);
  fs.writeFileSync('src/data/backendCode.js', bc, 'utf8');
  console.log('api.test.js updated in src/data/backendCode.js successfully!');
} else {
  console.error('Indices not matched:', { pos, codeStart, codeEnd });
}
