const fs = require('fs');

const appVue = fs.readFileSync('devops-exam-project/frontend/src/App.vue', 'utf8').replace(/\r\n/g, '\n');
const itemCtrl = fs.readFileSync('devops-exam-project/backend/controllers/item.controller.js', 'utf8').replace(/\r\n/g, '\n');
const apiTest = fs.readFileSync('devops-exam-project/backend/tests/api.test.js', 'utf8').replace(/\r\n/g, '\n');

// Convert backendCode to LF for matching
let bc = fs.readFileSync('src/data/backendCode.js', 'utf8').replace(/\r\n/g, '\n');

function replaceSection(pathName, newContent) {
  const searchStr = 'path: "' + pathName + '"';
  const pos = bc.indexOf(searchStr);
  if (pos === -1) {
    console.error('Not found path:', pathName);
    return;
  }
  const codeIdx = bc.indexOf('code: `', pos);
  const codeStart = codeIdx + 7;
  const codeEnd = bc.indexOf('`\n      },', codeStart) !== -1
    ? bc.indexOf('`\n      },', codeStart)
    : bc.indexOf('`\n    ]\n  },', codeStart);

  if (codeIdx !== -1 && codeEnd !== -1) {
    bc = bc.substring(0, codeStart) + newContent + bc.substring(codeEnd);
    console.log('Successfully updated:', pathName);
  } else {
    console.error('Failed boundary for:', pathName, { codeStart, codeEnd });
  }
}

replaceSection('frontend/src/App.vue', appVue);
replaceSection('backend/controllers/item.controller.js', itemCtrl);
replaceSection('backend/tests/api.test.js', apiTest);

fs.writeFileSync('src/data/backendCode.js', bc, 'utf8');
console.log('All files updated in src/data/backendCode.js!');
