const fs = require('fs');
let code = fs.readFileSync('src/components/Comments.tsx', 'utf8');

// Replace standard bat emoji with nothing or just remove it
code = code.replace(/🦇/g, ''); 
// Also in case it's literally mangled, let's just do a blanket regex for the exact sequence
// The hex bytes for bat are F0 9F A6 87
// If it was parsed as Latin 1 and saved as UTF8 it might be 'ðŸ¦‡'
code = code.replace(/ðŸ¦‡/g, '');

fs.writeFileSync('src/components/Comments.tsx', code, 'utf8');
