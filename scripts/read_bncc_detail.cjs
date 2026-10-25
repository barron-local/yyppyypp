const fs = require('fs');

function inspectFile(filename) {
  const content = fs.readFileSync('bncc_cache/' + filename, 'utf8');
  console.log('====================================================');
  console.log('FILE:', filename);
  console.log('====================================================');
  
  // Extract all code blocks or headers
  const lines = content.split('\n');
  let inCode = false;
  let codeBuffer = [];
  
  for (let line of lines) {
    if (line.includes('<pre') || line.includes('<code')) {
      inCode = true;
      codeBuffer.push(line);
    } else if (line.includes('</pre>') || line.includes('</code>')) {
      codeBuffer.push(line);
      inCode = false;
    } else if (inCode) {
      codeBuffer.push(line);
    } else if (line.match(/<h[1-4]/i) || line.match(/<strong/i) || line.match(/<p/i)) {
      const clean = line.replace(/<[^>]+>/g, '').trim();
      if (clean.length > 0 && !clean.includes('{') && !clean.includes('function')) {
        console.log('TXT:', clean);
      }
    }
  }

  console.log('\n--- EXTRACTED CODE SNIPPETS ---');
  const codeBlockRegex = /<pre[\s\S]*?<\/pre>/gi;
  const matches = content.match(codeBlockRegex) || [];
  matches.forEach((m, idx) => {
    const cleanCode = m.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
    console.log(`[Snippet ${idx + 1}]`);
    console.log(cleanCode.trim());
    console.log('--------------------');
  });
}

const args = process.argv.slice(2);
args.forEach(inspectFile);
