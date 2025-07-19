const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const pptPath = process.argv[2];
const outDir = process.argv[3] || path.join('public', 'ppt-slides');

if (!pptPath) {
  console.error('Usage: node scripts/convertPpt.js <path-to-ppt> [output-dir]');
  process.exit(1);
}

if (!fs.existsSync(pptPath)) {
  console.error(`File not found: ${pptPath}`);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const cmd = `libreoffice --headless --convert-to png --outdir "${outDir}" "${pptPath}"`;
try {
  execSync(cmd, { stdio: 'inherit' });
  console.log(`Slides exported to ${outDir}`);
} catch (err) {
  console.error('Conversion failed:', err.message);
  process.exit(1);
}

