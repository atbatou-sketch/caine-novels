const fs = require('fs');
let code = fs.readFileSync('C:/Esisa/cain/src/app/page.tsx', 'utf8');

const regex = /\{\/\* ??? ???? ???????? \*\/\}([\s\S]*?)<\/section>/;

const newSection = {/* ??? ???? ???????? */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-5">???? ????????</h2> 
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar pt-2 px-1">
            {novels.map((novel) => (
              <Link href={\/novel/\\} key={novel.id + 'new'} className="min-w-[150px] w-[150px] bg-[#1a1b2a] border border-[#2b2d42] rounded-3xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1 shadow-lg hover:shadow-2xl">
                <div className="relative">
                   <img
                    src={(novel as any).cover || \https://placehold.co/300x400/181825/ef4444?text=\\}
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
        </section>;

if (regex.test(code)) {
    code = code.replace(regex, newSection);
    fs.writeFileSync('C:/Esisa/cain/src/app/page.tsx', code, 'utf8');
    console.log("Replaced successfully!");
} else {
    console.log("Could not find section");
}
