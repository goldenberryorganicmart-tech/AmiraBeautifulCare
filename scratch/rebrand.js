const fs = require('fs');
const path = require('path');

const replacements = [
  // Email addresses first (preserving correct domain style)
  { regex: /info@RumasWorld\.com/gi, replace: 'info@amirabeautifulcare.com' },
  { regex: /support@RumasWorld\.com/gi, replace: 'support@amirabeautifulcare.com' },
  { regex: /concierge@Rumas\s+World\.com/gi, replace: 'concierge@amirabeautifulcare.com' },
  { regex: /info@rumasworld\.com/gi, replace: 'info@amirabeautifulcare.com' },
  { regex: /support@rumasworld\.com/gi, replace: 'support@amirabeautifulcare.com' },

  // Brand variations
  { regex: /Ruma's World/g, replace: "Amira's Beautiful Care" },
  { regex: /ruma's world/g, replace: "amira's beautiful care" },
  
  { regex: /Rumas World/g, replace: 'Amira Beautiful Care' },
  { regex: /RumasWorld/g, replace: 'AmiraBeautifulCare' },
  { regex: /RUMAS WORLD/g, replace: 'AMIRA BEAUTIFUL CARE' },
  { regex: /RUMASWORLD/g, replace: 'AMIRABEAUTIFULCARE' },
  
  { regex: /rumas world/g, replace: 'amira beautiful care' },
  { regex: /rumasworld/g, replace: 'amirabeautifulcare' },
  
  { regex: /rumas-world/g, replace: 'amira-beautiful-care' },
  { regex: /rumas_world/g, replace: 'amira_beautiful_care' },
  { regex: /Rumas-World/g, replace: 'Amira-Beautiful-Care' },
  
  { regex: /Rumas/g, replace: 'Amira' },
  { regex: /rumas/g, replace: 'amira' }
];

const ignoredDirs = ['.git', 'node_modules', '.next', 'dist', '.agents', 'scratch'];
const ignoredFiles = ['bd-locations.ts', 'rebrand.js', 'package-lock.json', 'tsconfig.tsbuildinfo'];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (ignoredDirs.includes(file)) continue;
      processDirectory(fullPath);
    } else {
      if (ignoredFiles.includes(file)) continue;
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  try {
    // Read as buffer to inspect for binary characteristics safely
    const buffer = fs.readFileSync(filePath);
    
    // Check if it's binary
    let isBinary = false;
    const checkLength = Math.min(buffer.length, 512);
    for (let i = 0; i < checkLength; i++) {
      if (buffer[i] === 0) {
        isBinary = true;
        break;
      }
    }
    if (isBinary) return;

    let content = buffer.toString('utf8');
    let hasChanged = false;

    for (const r of replacements) {
      if (r.regex.test(content)) {
        content = content.replace(r.regex, r.replace);
        hasChanged = true;
      }
    }

    if (hasChanged) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
  }
}

console.log('Starting rebranding process...');
processDirectory(path.resolve(__dirname, '..'));
console.log('Rebranding process completed!');
