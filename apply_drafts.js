const fs = require('fs');

let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// Change `novelsList.map` to `novelsList.filter(n => n.isPublished !== false).map`
// This makes sure anything without `isPublished: false` shows.
code = code.replace(/novelsList\.map/g, 'novelsList.filter(n => n.isPublished !== false).map');

fs.writeFileSync('src/app/page.tsx', code, 'utf8');
