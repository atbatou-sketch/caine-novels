const fs = require('fs');

// 1. Add strictly restrictive CSS globals
let cssCode = fs.readFileSync('src/app/globals.css', 'utf8');
if (!cssCode.includes('user-select: none')) {
    cssCode += `

/* 🦇 جدار حماية كين - التحديث الجديد 🦇 */
body, .protected-content {
  -webkit-user-select: none !important;
  -khtml-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  -o-user-select: none !important;
  user-select: none !important;
  -webkit-touch-callout: none !important;
  -webkit-user-drag: none !important;
}

/* السماح فقط لبعض الحقول الأساسية مثل الكتابة والبحث بالنسخ أو التحديد */
input, textarea, [contenteditable="true"] {
  -webkit-user-select: text !important;
  -khtml-user-select: text !important;
  -moz-user-select: text !important;
  -ms-user-select: text !important;
  -o-user-select: text !important;
  user-select: text !important;
}
`;
    fs.writeFileSync('src/app/globals.css', cssCode, 'utf8');
}

// 2. Add aggressive un-bypassable JavaScript to Layout
let layoutCode = fs.readFileSync('src/app/layout.tsx', 'utf8');
const oldScriptPattern = /<Script id="prevent-copy-and-right-click" strategy="afterInteractive">[\s\S]*?<\/Script>/m;

const newScript = `<Script id="caine-firewall" strategy="afterInteractive">
          {\`
            /* 🦇 جدار حماية كين النشط (الدرجة القصوى) 🦇 */

            // 1. شل زر الفأرة الأيمن (الرايت كليك)
            document.addEventListener('contextmenu', e => e.preventDefault());

            // 2. إيقاف حدث النسخ والقص وتفريغ الحافظة
            ['copy', 'cut'].forEach(evt => {
              document.addEventListener(evt, e => {
                e.preventDefault();
                // محاولة تعطيل الحافظة إذا أمكن
                if (e.clipboardData) e.clipboardData.setData('text/plain', 'محاولة جيدة، لكن جدار كين يمنعك من النسخ! 🦇');
              });
            });

            // 3. منع الإفلات والسحب (Drag & Drop) لمنع سحب النصوص والصور
            document.addEventListener('dragstart', e => e.preventDefault());

            // 4. تعطيل اختصارات التحايل (F12, Ctrl+U, Ctrl+Shift+I, P, S)
            document.addEventListener('keydown', e => {
              if (
                e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
                (e.ctrlKey && ['U', 'C', 'X', 'S', 'P'].includes(e.key.toUpperCase())) || 
                (e.metaKey && ['C', 'X', 'S', 'P'].includes(e.key.toUpperCase())) // For Mac
              ) {
                e.preventDefault();
                e.stopPropagation();
              }
            });

            // 5. تعطيل الطباعة من المتصفح (Print Screen/Ctrl+P) عبر الـ CSS الإضافي
            const style = document.createElement('style');
            style.innerHTML = "@media print { body { display: none !important; } }";
            document.head.appendChild(style);

            // 6. هجوم مضاد ضد الـ DevTools بفتح Debugger وهمي يعلق المتصفح
            setInterval(function() {
              const before = new Date().getTime();
              debugger; // هذا يؤدي إلى شلل المتصفح عند فتح نافذة المطور
              const after = new Date().getTime();
              if (after - before > 100) {
                 document.body.innerHTML = "<h1 style='color:red; text-align:center; margin-top:20vh; font-family:sans-serif;'>جدار كين رصد محاولة اختراق.. تم إغلاق الموقع لحمايته! 🦇</h1>";
              }
            }, 1000);
          \`}
        </Script>`;

layoutCode = layoutCode.replace(oldScriptPattern, newScript);
fs.writeFileSync('src/app/layout.tsx', layoutCode, 'utf8');

console.log("Maximum protection firewall active!");
