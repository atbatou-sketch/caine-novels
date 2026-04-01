const fs = require('fs');

let code = fs.readFileSync('src/app/novel/[id]/page.tsx', 'utf8');

// If a novel is somehow accessed via URL but it's unpublished, block it.
code = code.replace(
    'const novel = novelsData[id as keyof typeof novelsData];',
    'const novel = novelsData[id as keyof typeof novelsData];\n  if (novel?.isPublished === false) return <div className="text-center p-20 text-white">هذه الرواية قيد الكتابة، لم يتم نشرها بعد 🦇</div>;'
);

// Block chapters as well
code = code.replace(
    'const chapters = novel.chapters || [];',
    'const chapters = (novel.chapters || []).filter(ch => ch.isPublished !== false);'
);

fs.writeFileSync('src/app/novel/[id]/page.tsx', code, 'utf8');
