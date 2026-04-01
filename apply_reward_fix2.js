const fs = require('fs');
let code = fs.readFileSync('src/components/Comments.tsx', 'utf8');

code = code.replace(
  'newObj.replies.push({',
  'newObj.replies!.push({'
);

fs.writeFileSync('src/components/Comments.tsx', code, 'utf8');
