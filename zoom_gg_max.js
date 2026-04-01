const fs = require('fs');

let pageCode = fs.readFileSync('src/app/page.tsx', 'utf8');

// Changing w-16 h-16 to w-24 h-24 in the main layout (nav header logo)
pageCode = pageCode.replace(
    'className="w-16 h-16 object-contain drop-shadow-[0_0_12px_rgba(220,38,38,0.8)]"',
    'className="w-24 h-24 object-contain drop-shadow-[0_0_15px_rgba(220,38,38,0.9)]"'
);

fs.writeFileSync('src/app/page.tsx', pageCode, 'utf8');

let authCode = fs.readFileSync('src/components/AuthForm.tsx', 'utf8');

// Changing w-32 h-32 to w-48 h-48 in the login screen for massive size
authCode = authCode.replace(
    'className="w-32 h-32 object-contain drop-shadow-[0_0_25px_rgba(220,38,38,0.9)] mx-auto mb-4"',
    'className="w-48 h-48 object-contain drop-shadow-[0_0_35px_rgba(220,38,38,1)] mx-auto mb-4"'
);

fs.writeFileSync('src/components/AuthForm.tsx', authCode, 'utf8');

console.log("Images zoomed to maximum size!");
