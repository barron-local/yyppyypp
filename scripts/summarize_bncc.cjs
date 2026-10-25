const fs = require('fs');
const path = require('path');

function getSummary(file) {
  const filePath = path.join('bncc_cache', file);
  if (!fs.existsSync(filePath)) return;
  const html = fs.readFileSync(filePath, 'utf8');
  const text = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                   .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                   .replace(/<[^>]+>/g, ' ')
                   .replace(/&nbsp;/g, ' ')
                   .replace(/&lt;/g, '<')
                   .replace(/&gt;/g, '>')
                   .replace(/&amp;/g, '&')
                   .replace(/\s+/g, ' ')
                   .trim();
  console.log(`\n==============================================`);
  console.log(`FILE: ${file} (${text.length} chars)`);
  console.log(`==============================================`);
  console.log(text.slice(0, 600));
}

const targetFiles = [
  'project-overview.html',
  'skill-eval-pws.html',
  'ubuntu-setup.html',
  'technitium-dns.html',
  'caddy-internal-ca.html',
  'registry.html',
  'gitlab.html',
  'runner.html',
  'cicd.html',
  'cicd-example-1.html',
  'cicd-example-2.html',
  'docker.html',
  'portainer.html'
];

targetFiles.forEach(getSummary);
