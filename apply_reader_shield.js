const fs = require('fs');

let pageCode = fs.readFileSync('C:/Esisa/cain/src/app/novel/[id]/page.tsx', 'utf8');

// The main goal here is to make the reader div itself have the new shield class 
// so text cannot be physically touched/highlighted by the mobile OS logic.

// Looking for where the text is actually rendered inside the reader
if (pageCode.includes('<p className={`leading-relaxed')) {
    pageCode = pageCode.replace(
        '<p className={`leading-relaxed', 
        '<p className={`leading-relaxed novel-content-shield '
    );
}

// Ensure reader container also has the selection blocking
if (pageCode.includes('className="max-w-4xl mx-auto"')) {
     pageCode = pageCode.replace(
        'className="max-w-4xl mx-auto"',
        'className="max-w-4xl mx-auto select-none"'
     );
}

fs.writeFileSync('C:/Esisa/cain/src/app/novel/[id]/page.tsx', pageCode, 'utf8');
