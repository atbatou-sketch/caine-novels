"use client";

import { useState } from "react";
import Link from "next/link";
import CaineChat from "./CaineChat";

// قاعدة بيانات وهمية مؤقتة للروايات لنقوم بتجربتها
const novels = [
  { id: 1, title: "مذكرات قصر الأشباح", genre: "رعب نفسي", desc: "رواية مرعبة عن شيء يراقبك من الظلام ويريدك كتاباً له... لا تقرأها وحدك." },
  { id: 2, title: "متاهة العقول", genre: "خيال علمي", desc: "هل ما تعيشه الآن حقيقة أم مجرد كود برمجي؟ اكتشف الحقيقة." },
  { id: 3, title: "الهمسات الأخيرة", genre: "غموض", desc: "جريمة غامضة لا يوجد فيها أي دليل سوى قطرة دم ورسالة مشفرة." },
];

export default function Home() {  
  // حالة (State) لتتبع الوضع المظلم والمضيء
  const [isDark, setIsDark] = useState(true);

  return (  
    <div className={`min-h-screen p-8 font-sans transition-colors duration-500 ${isDark ? 'bg-[#0a0a0a] text-gray-100' : 'bg-[#f4f4f5] text-gray-900'}`} dir="rtl">  
      
      {/* زر التبديل بين الليل والنهار */}
      <div className="max-w-6xl mx-auto flex justify-start mb-4">
        <button 
          onClick={() => setIsDark(!isDark)}
          title={isDark ? "تفعيل الوضع المضيء" : "تفعيل الوضع المظلم"}
          className={`p-2 rounded-full text-base transition-all duration-300 flex items-center justify-center ${
            isDark ? 'bg-gray-800 hover:bg-gray-700 shadow-lg' : 'bg-white hover:bg-gray-100 shadow-md border border-gray-200'
          }`}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>

      <main className="max-w-6xl mx-auto flex flex-col gap-12 items-center text-center pb-32">  
        
        {/* رأس الصفحة / العنوان */}
        <header className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-purple-600 to-red-600 animate-pulse">
            مكتبة كين المظلمة 📚💀
          </h1>  
          <p className={`text-xl max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            اختر رواية لتبدأ القراءة... ولكن احذر! كين يراقب كل صفحة تقرأها، وسيعلق على الأحداث فجأة ولن يتركك في سلام!
          </p>  
        </header>

        {/* رفوف الروايات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {novels.map((novel) => (
             <Link
                href={`/novel/${novel.id}`}
                key={novel.id}
                className={`border-2 rounded-2xl p-6 hover:scale-[1.03] transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col 
                ${isDark
                  ? 'bg-gray-900 border-gray-800 hover:border-red-600 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(220,38,38,0.4)]'
                  : 'bg-white border-gray-200 hover:border-red-500 shadow-sm hover:shadow-[0_0_25px_rgba(220,38,38,0.2)]'}`}
             >
                {/* تأثير دموي خفيف في الخلفية عند المرور بالماوس */}
                <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>

                {/* غلاف وهمي للرواية */}
                <div className={`h-56 rounded-xl mb-6 flex items-center justify-center transition-colors border group-hover:border-red-500/50
                  ${isDark ? 'bg-gray-800 text-gray-600 border-gray-700' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                  <span className={`text-7xl group-hover:scale-110 transition-transform duration-500 ${isDark ? 'group-hover:text-red-500' : 'group-hover:text-red-600'}`}>
                    📖
                  </span>
                </div>

                {/* معلومات الرواية */}
                <h2 className={`text-2xl font-bold mb-3 transition-colors ${isDark ? 'text-white group-hover:text-red-400' : 'text-gray-900 group-hover:text-red-600'}`}>
                  {novel.title}
                </h2>
                <div className="mb-4">
                  <span className={`inline-block text-xs px-3 py-1 rounded-full font-bold border ${isDark ? 'bg-red-900/50 text-red-300 border-red-800/50' : 'bg-red-100 text-red-700 border-red-200'}`}>
                    {novel.genre}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed mb-6 flex-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {novel.desc}
                </p>

                {/* زر القراءة */}
                <button className="mt-auto w-full bg-red-800 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <span>ابدأ القراءة</span>
                  <span className="text-xl -translate-y-[2px]">👁️</span>     
                </button>
             </Link>
          ))}
        </div>

      </main>  
      
      {/* استدعاء كين هنا ليبقى يطفو في الشاشة دائمًا */}
      <CaineChat />  
    </div>  
  );  
} 
