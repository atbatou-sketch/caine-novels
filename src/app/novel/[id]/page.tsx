"use client";

import { useState, use } from "react";
import Link from "next/link";
import CaineChat from "../../CaineChat";

// نصوص وهمية للروايات لتجربتها
const novelsData = {
  1: { 
    title: "مذكرات قصر الأشباح", 
    genre: "رعب نفسي",
    content: `الفصل الأول: الباب الأحمر

لقد مر أسبوعان منذ انتقالي إلى هذا القصر القديم المعزول على أطراف القرية. كنت أبحث عن الهدوء لأتمكن من كتابة روايتي الجديدة، لكن ما وجدته هنا كان أبعد ما يكون عن السكينة.
كل ليلة في تمام الساعة الثالثة فجراً، أستيقظ على صوت خطوات ثقيلة تأتي من الطابق العلوي، وتحديداً من الغرفة ذات الباب الأحمر المغلق بإحكام. حاولت كثيراً تجاهل الأمر وإقناع نفسي أنه مجرد تمدد لخشب القصر العتيق بسبب برودة الليل، لكن ما حدث الليلة الماضية نسف كل تبريراتي المنطقية.

كنت جالساً في المكتبة أحتسي قهوتي، والرياح تعوي في الخارج كذئاب جائعة. فجأة، انطفأت جميع شموع الغرفة في آن واحد. ساد الظلام الدامس للحظات قبل أن يضيء البرق السماء بالخارج، ويكشف لي انعكاساً مرعباً في زجاج النافذة. لم أكن وحدي في الغرفة. كان هناك شيء، أو كيان طويل القامة مشوه الملامح، يقف خلفي تماماً.
تجمد الدم في عروقي. حاولت الالتفات لكن رقبتي تيبست من الرعب. سمعت صوتاً أجش يهمس في أذني مباشرة، صوتاً يبدو وكأنه قادم من قاع بئر عميق: "أنت لست الكاتب... أنت الرواية".

قفزت من مكاني وركضت نحو مفتاح الكهرباء. أضأت الغرفة بيدي المرتجفة. لم يكن هناك أحد. ولكن على الطاولة، وبجانب فنجان قهوتي الذي انقلب وتناثر محتواه، كان هناك كتاب أسود قديم وممزق الأطراف لم أره من قبل. كان عنوانه مكتوباً بلغة غريبة ومقروءة بصعوبة، وتحته رمز يحاكي شكل عين دامعة.
لم ألمس الكتاب. تراجعت ببطء حتى اصطدم ظهري بالباب. وفجأة، ومن الطابق العلوي، بدأ صوت الباب الأحمر يئن وهو يُفتح ببطء شديد، تلته صرخة صامتة كأن المكان كله يبتلع الصدى. لا أعرف من يسكن في الأعلى، ولكنني أعرف أنه ينزل السلالم الآن...`
  },
  2: { 
    title: "متاهة العقول", 
    genre: "خيال علمي",
    content: `الفصل الأول: الاستيقاظ

الضوء كان ساطعاً جداً... استيقظت لأجد نفسي موصلاً بأسلاك متوهجة زرقاء اللون. 
أين أنا؟ هل هذه المستشفى؟ أم أنني ما زلت في المحاكاة؟
نهضت ببطء، نظرت إلى يدي، كانت شفافة بعض الشيء، كأنها مكونة من بكسلات!
فجأة، رن صوت ميكانيكي مجنون في أرجاء الغرفة: "ترحيب باللاعب رقم 404... عقلك الآن ملك للنظام".`
  },
  3: { 
    title: "الهمسات الأخيرة", 
    genre: "غموض",
    content: `الفصل الأول: القطرة

الجثة كانت ملقاة في منتصف الغرفة، لا يوجد أي سلاح، ولا أي دليل، سوى قطرة دم واحدة لا تخص الضحية.
المفتش "رامي" وقف يتأمل المرآة المكسورة. كان هناك شيء مكتوب عليها بالدماء قبل أن تجف:
"الخطوة الأولى اكتملت... الباقي يعتمد عليك".
من كتبها؟ وكيف خرج من الغرفة المغلقة من الداخل؟ اللغز بدأ للتو.`
  }
};

export default function NovelPage({ params }: { params: Promise<{ id: string }> }) {
  const [isDark, setIsDark] = useState(true);
  
  // فك شفرة الـ params المتزامنة في Next.js 15
  const resolvedParams = use(params);
  const novelId = parseInt(resolvedParams.id);
  const novel = novelsData[novelId as keyof typeof novelsData] || { title: "رواية مفقودة", content: "يبدو أن كين العبقري قام بمسح هذه الرواية من الوجود بالخطأ! 💥" };

  // السياق الذي سنرسله لكين ليعرف ماذا يقرأ المستخدم
  const caineReadingContext = `القارئ يقرأ الآن رواية بعنوان "${novel.title}". النص الذي أمامه هو: "${novel.content}"`;

  return (
    <div className={`min-h-screen p-8 font-sans transition-colors duration-500 ${isDark ? 'bg-[#050505] text-gray-200' : 'bg-[#fcfcfc] text-gray-800'}`} dir="rtl">
      
      {/* الشريط العلوي للتنقل */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-12">
        <Link href="/" className={`font-bold hover:text-red-500 transition-colors flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className="text-xl">➔</span>
          <span>العودة للمكتبة</span>
        </Link>
        
        <button 
          onClick={() => setIsDark(!isDark)}
          title={isDark ? "أشعل النور، أنا خائف" : "أطفئ النور"}
          className={`p-2 rounded-full text-base transition-all duration-300 flex items-center justify-center ${
            isDark ? 'bg-gray-800 hover:bg-gray-700 shadow-lg' : 'bg-white hover:bg-gray-100 shadow-md border border-gray-200'
          }`}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>

      {/* منطقة القراءة */}
      <main className="max-w-3xl mx-auto pb-32">
        <h1 className={`text-4xl md:text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-l ${isDark ? 'from-red-600 to-purple-500' : 'from-red-700 to-purple-800'}`}>
          {novel.title}
        </h1>
        
        <div className={`p-8 md:p-12 rounded-2xl text-xl md:text-2xl leading-loose font-serif border-2 tracking-wide shadow-2xl
          ${isDark ? 'bg-[#111] border-gray-800 text-gray-300' : 'bg-[#fffbdd] border-[#e8e3c8] text-[#3d3326] shadow-[#00000010]'}`}>
          {novel.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-6">{paragraph}</p>
          ))}
        </div>
      </main>

      {/* كين يراقب... ونعطيه سياق الرواية */}
      <CaineChat readingContext={caineReadingContext} />
    </div>
  );
}