const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

const regex = /<span className="text-red-600 text-3xl filter drop-shadow-\[0_0_8px_rgba\(220,38,38,0\.8\)\]">🦇<\/span> كين ستوديو/;

const newLogo = `<img src="/gg.png" alt="كين الجبار" className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(220,38,38,0.8)]" /> كين ستوديو`;

code = code.replace(regex, newLogo);

// Let's also check if it's anywhere else like in layout.tsx or Navbar.tsx
fs.writeFileSync('src/app/page.tsx', code, 'utf8');
