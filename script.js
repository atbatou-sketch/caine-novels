const fs = require('fs');
let code = fs.readFileSync('C:/Esisa/cain/src/app/page.tsx', 'utf8');

const parts = code.split('<section className="mb-8">');
if (parts.length > 1) {
    const sectionStart = parts[1];
    const sectionEndIndex = sectionStart.indexOf('</section>');
    const beforeSection = code.substring(0, code.indexOf('<section className="mb-8">'));
    const afterSection = sectionStart.substring(sectionEndIndex + 10);

    const newTitle = Buffer.from('2KzYr9mK2K8g2KfZhNix2YjYp9mK2KfYqg==', 'base64').toString('utf8');

    const newSection = `
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-5">${newTitle}</h2> 
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar pt-2 px-1">
            {novels.map((novel) => (
              <Link href={\`/novel/\x24{novel.id}\`} key={novel.id + 'new'} className="min-w-[150px] w-[150px] bg-[#1a1b2a] border border-[#2b2d42] rounded-3xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1 shadow-lg hover:shadow-2xl">
                <div className="relative">
                   <img
                    src={(novel as any).cover || \`https://placehold.co/300x400/181825/ef4444?text=\x24{encodeURIComponent(novel.title)}\`}
                    alt={novel.title}
                    className="w-full h-[210px] object-cover"
                  />
                </div>
                <div className="p-3 text-center flex-1 flex flex-col justify-center">
                  <h3 className="font-bold text-sm text-white line-clamp-1">{novel.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>`;

    fs.writeFileSync('C:/Esisa/cain/src/app/page.tsx', beforeSection + newSection + afterSection, 'utf8');
    console.log("Updated safely!");
}
