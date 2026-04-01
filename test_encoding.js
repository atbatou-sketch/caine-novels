const fs = require('fs');
let code = fs.readFileSync('src/components/Comments.tsx', 'utf8');

// Find the line containing the text
const lines = code.split('\n');
const line = lines.find(l => l.includes('text: \'));
console.log(line);
