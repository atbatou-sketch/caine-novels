const fs = require('fs');
let code = fs.readFileSync('src/components/Comments.tsx', 'utf8');

// Cleanup duplicate isFirst in comment node
code = code.replace(
  '  isFirst?: boolean;\n  isFirst?: boolean;',
  '  isFirst?: boolean;'
);

fs.writeFileSync('src/components/Comments.tsx', code, 'utf8');
console.log("Fixed duplicates!");
