const fs = require('fs');

let cssCode = fs.readFileSync('src/app/globals.css', 'utf8');

// Updating the body protections
if (!cssCode.includes('pointer-events: auto')) {
    cssCode = cssCode.replace(
        'user-select: none !important;',
        `user-select: none !important;
  /* Ultimate manual grabbing protection */
  -webkit-touch-callout: none !important; 
  -webkit-user-drag: none !important;
  -khtml-user-drag: none !important;
  -moz-user-drag: none !important;
  -o-user-drag: none !important;
  outline: none !important;
  -webkit-tap-highlight-color: rgba(0,0,0,0) !important;`
    );
    
    // Add specific overlay blocking for chapter text in Page
    cssCode += `
/* طبقة عمياء فوق النصوص لمنع التحديد اليدوي (Mobile Long Press & Desktop Clicks) */
.novel-content-shield {
    position: relative;
}
.novel-content-shield::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    /* Transparent but blocks interactions */
    background: transparent;
    pointer-events: auto; /* Catches the clicks */
}
`;
    fs.writeFileSync('src/app/globals.css', cssCode, 'utf8');
}
console.log("CSS Shield injected");
