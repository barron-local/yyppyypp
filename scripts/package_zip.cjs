const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Packaging devops-exam-project into ZIP...');

const projectDir = path.resolve(__dirname, '..', 'devops-exam-project');
const publicZipPath = path.resolve(__dirname, '..', 'public', 'devops-exam-project.zip');
const distZipPath = path.resolve(__dirname, '..', 'dist', 'devops-exam-project.zip');

// We use PowerShell Compress-Archive or tar/zip
// Let's create a temporary clean copy without node_modules
const tempDir = path.resolve(__dirname, '..', 'tmp-zip-staging');
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
fs.mkdirSync(tempDir, { recursive: true });

const targetFolder = path.join(tempDir, 'devops-exam-project');
fs.mkdirSync(targetFolder, { recursive: true });

function copyFiltered(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    const base = path.basename(src);
    if (base === 'node_modules' || base === '.git') return;
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      copyFiltered(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Copying files excluding node_modules...');
copyFiltered(projectDir, targetFolder);

console.log('Compressing to ZIP...');
if (fs.existsSync(publicZipPath)) fs.unlinkSync(publicZipPath);

// Use PowerShell Compress-Archive
const psCmd = `powershell -Command "Compress-Archive -Path '${targetFolder}\\*' -DestinationPath '${publicZipPath}' -Force"`;
execSync(psCmd, { stdio: 'inherit' });

if (fs.existsSync(path.resolve(__dirname, '..', 'dist'))) {
  fs.copyFileSync(publicZipPath, distZipPath);
  console.log('Copied to dist/devops-exam-project.zip');
}

// Clean up tempDir
fs.rmSync(tempDir, { recursive: true, force: true });

const stats = fs.statSync(publicZipPath);
console.log(`ZIP created successfully at ${publicZipPath}`);
console.log(`ZIP file size: ${(stats.size / 1024).toFixed(2)} KB`);
