const fs = require('fs');

let pageCode = fs.readFileSync('src/app/page.tsx', 'utf8');

// Changing w-24 h-24 to w-32 h-32 (or even w-[150px] for custom) in header logo
pageCode = pageCode.replace(
    'className="w-24 h-24 object-contain drop-shadow-[0_0_15px_rgba(220,38,38,0.9)]"',
    'className="w-32 h-32 object-contain drop-shadow-[0_0_20px_rgba(220,38,38,1)]"'
);

fs.writeFileSync('src/app/page.tsx', pageCode, 'utf8');

let authCode = fs.readFileSync('src/components/AuthForm.tsx', 'utf8');

// Changing w-48 h-48 to w-64 h-64 (or custom w-[300px]) in the login screen
authCode = authCode.replace(
    'className="w-48 h-48 object-contain drop-shadow-[0_0_35px_rgba(220,38,38,1)] mx-auto mb-4"',
    'className="w-64 h-64 object-contain drop-shadow-[0_0_40px_rgba(220,38,38,1)] mx-auto mb-4"'
);

fs.writeFileSync('src/components/AuthForm.tsx', authCode, 'utf8');

console.log("Images zoomed to colossal size!");
