const fs = require('fs');

// Create a Drafts capability inside the novels configuration array.
let code = fs.readFileSync('src/data/novels.ts', 'utf8');

if (!code.includes('isPublished')) {
    // Basic sed replacement to inject 'isPublished: true' into current objects 
    // just to give the schema some base.
    code = code.replace(/title: "(.*?)",/g, 'title: "$1",\n    isPublished: true,');
    
    // Also inject it inside the Chapter objects so logic can check for individual chapter visibility
    code = code.replace(/content: "(.*?)",/g, 'content: "$1",\n        isPublished: true,');

    fs.writeFileSync('src/data/novels.ts', code, 'utf8');
    console.log("Injected Draft System fields into novels.ts");
}
