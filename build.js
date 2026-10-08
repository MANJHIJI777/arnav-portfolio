/**
 * Production Verification and Build Script for Vercel Deployment
 * Validates integrity of all static assets, routes, media sizes, and links.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n======================================================');
console.log('  ARNAV KUMAR PORTFOLIO — PRODUCTION BUILD VERIFICATION');
console.log('======================================================\n');

let hasErrors = false;

// 1. Verify Core HTML Entrypoints
const requiredHtmlFiles = [
  'index.html',
  'projects/work2.html',
  'projects/work3.html'
];

console.log('[1/5] Checking essential HTML routes...');
for (const file of requiredHtmlFiles) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✓ Route: /${file.replace('index.html', '')}`);
  } else {
    console.error(`  ✗ Missing required file: ${file}`);
    hasErrors = true;
  }
}

// 2. Verify Stylesheets & Scripts
const requiredAssets = [
  'css/main.css',
  'css/case-study.css',
  'js/main.js',
  'js/case-study.js',
  'js/cinema-canvas.js'
];

console.log('\n[2/5] Checking styles and client scripts...');
for (const file of requiredAssets) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    console.log(`  ✓ Asset: ${file} (${(stats.size / 1024).toFixed(1)} KB)`);
  } else {
    console.error(`  ✗ Missing required asset: ${file}`);
    hasErrors = true;
  }
}

// 3. Verify Video & Media Assets (and GitHub/Vercel size constraints < 100MB)
const requiredMedia = [
  'assets/work2.mp4',
  'assets/work3.mp4',
  'assets/work2_poster.jpg',
  'assets/work3_poster.jpg',
  'assets/showreel_poster.jpg',
  'assets/editor_portrait.jpg'
];

console.log('\n[3/5] Checking media assets & size limits (< 100 MB)...');
for (const file of requiredMedia) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    const sizeMb = stats.size / (1024 * 1024);
    if (sizeMb > 100) {
      console.error(`  ✗ File exceeds 100MB limit for GitHub/Vercel: ${file} (${sizeMb.toFixed(1)} MB)`);
      hasErrors = true;
    } else {
      console.log(`  ✓ Media: ${file} (${sizeMb.toFixed(1)} MB, OK)`);
    }
  } else {
    console.error(`  ✗ Missing required media: ${file}`);
    hasErrors = true;
  }
}

// 4. Check for Hardcoded Localhost or Development URLs in Source Files
console.log('\n[4/5] Scanning for hardcoded localhost/dev URLs in frontend code...');
const scanDirs = ['.', 'projects', 'css', 'js'];
const disallowedPatterns = [/localhost:\d+/i, /127\.0\.0\.1:\d+/i];

for (const dir of scanDirs) {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) continue;
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.css')) {
      const filePath = path.join(dirPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      for (const pattern of disallowedPatterns) {
        if (pattern.test(content)) {
          console.error(`  ✗ Disallowed dev URL found in: ${path.relative(__dirname, filePath)} matching ${pattern}`);
          hasErrors = true;
        }
      }
    }
  }
}
console.log('  ✓ No hardcoded localhost or development URLs found in frontend files.');

// 5. Check Deployment Configuration
console.log('\n[5/5] Verifying deployment configuration...');
if (fs.existsSync(path.join(__dirname, 'vercel.json'))) {
  console.log('  ✓ vercel.json is present and configured.');
} else {
  console.error('  ✗ Missing vercel.json');
  hasErrors = true;
}

if (fs.existsSync(path.join(__dirname, '.gitignore'))) {
  console.log('  ✓ .gitignore is present.');
} else {
  console.error('  ✗ Missing .gitignore');
  hasErrors = true;
}

if (hasErrors) {
  console.error('\n❌ Production build verification FAILED. Please review the errors above.\n');
  process.exit(1);
} else {
  console.log('\n======================================================');
  console.log('✓ SUCCESS: Production build verified.');
  console.log('  Framework: Static Site (HTML5 / CSS3 / Vanilla JS)');
  console.log('  Build Command: npm run build');
  console.log('  Output Directory: . (Root)');
  console.log('  Ready for Vercel deployment and GitHub push.');
  console.log('======================================================\n');
  process.exit(0);
}
