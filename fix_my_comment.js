const fs = require('fs');
let code = fs.readFileSync('src/components/Comments.tsx', 'utf8');

code = code.replace(
  'const isMyComment = item.userName === currentUserName || isAdmin;',
  `const itemOwner = typeof item.userName === 'string' ? item.userName : (item.user?.name || "مجهول");
    const isMyComment = itemOwner === currentUserName || isAdmin;`
);

code = code.replace(
  '{isAdmin && item.userName === currentUserName && <span',
  '{isAdmin && itemOwner === currentUserName && <span'
);

fs.writeFileSync('src/components/Comments.tsx', code, 'utf8');
