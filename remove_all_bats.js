const fs = require('fs');
let code = fs.readFileSync('src/components/AuthForm.tsx', 'utf8');

const regex = /<span className="text-5xl mb-4 block drop-shadow-\[0_0_15px_rgba\(220,38,38,0\.5\)\]">🦇<\/span>/;
const newImage = `<img src="/gg.png" alt="كين الجبار" className="w-20 h-20 object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.8)] mx-auto mb-4" />`;

code = code.replace(regex, newImage);
fs.writeFileSync('src/components/AuthForm.tsx', code, 'utf8');

let layoutCode = fs.readFileSync('src/app/layout.tsx', 'utf8');
layoutCode = layoutCode.replace(/ 🦇/g, '');
layoutCode = layoutCode.replace(/🦇/g, '');
fs.writeFileSync('src/app/layout.tsx', layoutCode, 'utf8');

console.log("All bats completely destroyed and replaced with gg!");
