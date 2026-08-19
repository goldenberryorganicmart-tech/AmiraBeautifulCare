const fs = require('fs');
const path = require('path');

const replacements = [
  ['x Apparels Atelier', 'Amira Beautiful Care Atelier'],
  ['x Apparels Boutique', 'Amira Beautiful Care Boutique'],
  ['x Apparels Curators', 'Amira Beautiful Care Curators'],
  ['x Apparels Intelligence', 'Amira Beautiful Care Intelligence'],
  ['x Apparels Editorial', 'Amira Beautiful Care Editorial'],
  ['x Apparels Assistant', 'Amira Beautiful Care Assistant'],
  ['x Apparels CO.', 'Amira Beautiful Care CO.'],
  ['x Apparels Team', 'Amira Beautiful Care Team'],
  ['x Apparels AI', 'Amira Beautiful Care AI'],
  ['x Apparelsr', 'Amira Beautiful Care'],  // typo fix in manifest.ts
  ['x Apparels', 'Amira Beautiful Care'],
  ['xApparels', 'AmiraBeautifulCare'],
  ['xapparels.com', 'amirabeautifulcare.com'],
  ['xapparels', 'amirabeautifulcare'],
];

const extensions = ['.ts', '.tsx', '.js', '.jsx'];

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory() && file !== 'node_modules' && file !== '.next') {
      walkDir(fullPath);
    } else if (stat.isFile() && extensions.includes(path.extname(file))) {
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
  });
}

walkDir(path.join(process.cwd(), 'src'));
console.log('\nDone! All branding updated.');
