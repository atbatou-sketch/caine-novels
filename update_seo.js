const fs = require('fs');
let code = fs.readFileSync('src/app/layout.tsx', 'utf8');

const updatedMetadata = `export const metadata: Metadata = {
  title: "روايات كين | مكتبة الغموض والإثارة",
  description: "المكتبة الإلكترونية الأولى لقراءة أمتع وأحدث الروايات الحصرية بحبر كين العبقري",
  keywords: ["روايات", "كين", "غموض", "قراءة", "قصص", "روايات كين", "أكشن", "خيال"],
  authors: [{ name: "كين العبقري" }],
  icons: {
    icon: '/gg.png',
    apple: '/gg.png',
  },
};`;

code = code.replace(/export const metadata: Metadata = \{[\s\S]*?\};/, updatedMetadata);

fs.writeFileSync('src/app/layout.tsx', code, 'utf8');
console.log("Metadata updated successfully.");
