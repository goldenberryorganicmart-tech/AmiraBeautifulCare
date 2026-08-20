const fs = require('fs');
const path = require('path');

const replacements = [
  // Database connection strings containing spaces/special formats
  ['mongodb+srv://Wide Computers:xI2QuBaFZsYQ5vRD@cluster0.e5n1hnl.mongodb.net/Wide Computers', 'mongodb+srv://AmiraBeautifulCare:xI2QuBaFZsYQ5vRD@cluster0.e5n1hnl.mongodb.net/AmiraBeautifulCare'],
  ['mongodb+srv://Wide Computers:S4Epscw0SOkd5ZtG@cluster0.e5n1hnl.mongodb.net/Wide Computers', 'mongodb+srv://AmiraBeautifulCare:S4Epscw0SOkd5ZtG@cluster0.e5n1hnl.mongodb.net/AmiraBeautifulCare'],

  // Standard case-sensitive and format replacements
  ['Wide Computers', 'Amira Beautiful Care'],
  ['WideComputers', 'AmiraBeautifulCare'],
  ['WIDE COMPUTERS', 'AMIRA BEAUTIFUL CARE'],
  ['widecomputers.com', 'amirabeautifulcare.com'],
  ['WideComputers.com', 'AmiraBeautifulCare.com'],
  ['wide-computers', 'amira-beautiful-care'],
  ['widecomputers', 'amirabeautifulcare'],
];

const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.yml', '.yaml', '.md', '.css', '.html', '.env', '.local', '.dockerignore'];
const fileNames = ['Dockerfile', 'docker-compose.yml', '.env.local'];

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    // Skip version control and build folders
    if (stat.isDirectory() && file !== 'node_modules' && file !== '.next' && file !== '.git') {
      walkDir(fullPath);
    } else if (stat.isFile()) {
      const ext = path.extname(file);
      const isTargetFile = extensions.includes(ext) || fileNames.includes(file);
      
      // Specifically skip bd-locations.ts or package-lock.json if needed
      if (file === 'bd-locations.ts' || file === 'package-lock.json' || file === 'rebrand_amira.js' || file === 'rebrand_wide.js' || file === 'rebrand.js') {
        return;
      }
      
      if (isTargetFile) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let original = content;
        for (const [from, to] of replacements) {
          content = content.split(from).join(to);
        }
        if (content !== original) {
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log('Updated:', fullPath.replace(process.cwd() + path.sep, ''));
        }
      }
    }
  });
}

console.log('Starting rebranding to Amira Beautiful Care...');
walkDir(process.cwd());
console.log('\nDone! All branding updated.');
