const fs = require('fs');

let pageCode = fs.readFileSync('src/app/page.tsx', 'utf8');

// The current values are likely w-10 and h-10, change them to w-14 and h-14 or bigger
pageCode = pageCode.replace(
    'className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(220,38,38,0.8)]"',
    'className="w-16 h-16 object-contain drop-shadow-[0_0_12px_rgba(220,38,38,0.8)]"'
);

fs.writeFileSync('src/app/page.tsx', pageCode, 'utf8');

let authCode = fs.readFileSync('src/components/AuthForm.tsx', 'utf8');

// The current values are likely w-20 and h-20, change them to w-32 and h-32 or bigger
authCode = authCode.replace(
    'className="w-20 h-20 object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.8)] mx-auto mb-4"',
    'className="w-32 h-32 object-contain drop-shadow-[0_0_25px_rgba(220,38,38,0.9)] mx-auto mb-4"'
);

fs.writeFileSync('src/components/AuthForm.tsx', authCode, 'utf8');

console.log("Images zoomed");
