"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import Comments from "@/components/Comments";

// نصوص وهمية للروايات لتجربتها مع فصول متعددة
import { novelsData } from '../../../../src/data/novels';

export default function NovelPage({ params }: { params: Promise<{ id: string }> }) {
  const [view, setView] = useState<'details' | 'read'>('details');
  const [isDark, setIsDark] = useState(true);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [fontSizeIndex, setFontSizeIndex] = useState(1);
  const [fontFamilyIndex, setFontFamilyIndex] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [collapsedVolumes, setCollapsedVolumes] = useState<Record<number, boolean>>({});
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleVolume = (volIdx: number) => {
    setCollapsedVolumes(prev => ({
      ...prev,
      [volIdx]: prev[volIdx] === undefined ? false : !prev[volIdx]
    }));
  };

  // أحجام الخطوط
  const fontSizes = [
    { label: "صغير", classes: "text-lg md:text-xl" },
    { label: "متوسط", classes: "text-xl md:text-2xl" },
    { label: "كبير", classes: "text-2xl md:text-3xl" },
    { label: "ضخم", classes: "text-3xl md:text-4xl" }
  ];

  // أنواع الخطوط (أضفنا خيارات خطوط هنا)
  const fontFamilies = [
    { label: "كايرو (Cairo)", classes: "font-cairo" },
    { label: "ميكس عرب", classes: "font-themix" },
    { label: "دي جي مقطعات", classes: "font-dg" },
    { label: "إشراق", classes: "font-ishraq" },
    { label: "تشكيلي", classes: "font-tachkili" },
    { label: "هلا VIP", classes: "font-viphala" }
  ];

  // فك شفرة الـ params المتزامنة في Next.js 15
  const resolvedParams = use(params);
  const rawId = resolvedParams.id;
  const novelId = isNaN(parseInt(rawId)) ? rawId : parseInt(rawId);
  const novel = (novelsData as any)[novelId] || { id: novelId, title: "رواية مفقودة", chapters: [{ title: "فارغ", content: "يبدو أن كين العبقري قام بمسح هذه الرواية من الوجود بالخطأ! 💥" }] };

  // Flatten chapters if using volumes structure
  const allChapters = (novel as any).volumes ? (novel as any).volumes.flatMap((v: any) => v.chapters) : ((novel as any).chapters || []);

  const currentChapter = allChapters[currentChapterIndex];

  // السياق الذي سنرسله لكين ليعرف ماذا يقرأ المستخدم
  
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("caine-favorites") || "[]");
    setIsFavorite(favs.includes(novelId));

    const history = JSON.parse(localStorage.getItem("caine-read-novels") || "[]");
    if (!history.includes(novelId)) {
      history.push(novelId);
      localStorage.setItem("caine-read-novels", JSON.stringify(history));
    }
  }, [novelId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (view === "read") {
      interval = setInterval(() => {
        const currentSeconds = parseInt(localStorage.getItem("caine-read-time-seconds") || "0");
        localStorage.setItem("caine-read-time-seconds", (currentSeconds + 1).toString());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [view]);

  const toggleFavorite = () => {
    const favs: any[] = JSON.parse(localStorage.getItem("caine-favorites") || "[]");
    if (isFavorite) {
      const newFavs = favs.filter((id: any) => id !== novelId);
      localStorage.setItem("caine-favorites", JSON.stringify(newFavs));
      setIsFavorite(false);
    } else {
      favs.push(novelId);
      localStorage.setItem("caine-favorites", JSON.stringify(favs));
      setIsFavorite(true);
    }
  };

  // --- دوال لتغير الفصول وحفظ التقدم ---

  const changeChapter = (newIndex: number) => {
    setCurrentChapterIndex(newIndex);
    // تصفير سكرول عند تغيير الفصل إرادياً والعودة لبداية الفصل
    window.scrollTo({ top: 0, behavior: 'instant' });
    localStorage.setItem(`novel-${novelId}-chapter`, newIndex.toString());
    localStorage.removeItem(`novel-${novelId}-scroll`); // أزل حفظ موقع القراءة للعودة للبداية
  };

  const goToNextChapter = () => {
    if (currentChapterIndex < allChapters.length - 1) {
      changeChapter(currentChapterIndex + 1);
    }
  };

  const goToPrevChapter = () => {
    if (currentChapterIndex > 0) {
      changeChapter(currentChapterIndex - 1);
    }
  };

  const changeFontSize = () => {
    const nextSize = (fontSizeIndex + 1) % fontSizes.length;
    setFontSizeIndex(nextSize);
    localStorage.setItem('novel-settings-fontsize', nextSize.toString());
  };

  const changeFontFamily = () => {
    const nextFamily = (fontFamilyIndex + 1) % fontFamilies.length;
    setFontFamilyIndex(nextFamily);
    localStorage.setItem('novel-settings-fontfamily', nextFamily.toString());
  };

  // --- استعادة الإعدادات والتقدم عند التحميل ---

  useEffect(() => {
    // 1- استعادة إعدادات الخط واللون
    const savedFontSize = localStorage.getItem('novel-settings-fontsize');
    if (savedFontSize) setFontSizeIndex(parseInt(savedFontSize));

    const savedFontFamily = localStorage.getItem('novel-settings-fontfamily');
    if (savedFontFamily) setFontFamilyIndex(parseInt(savedFontFamily));

    // 2- استعادة الفصل ومكان القراءة
    const savedChapter = localStorage.getItem(`novel-${novelId}-chapter`);
    if (savedChapter) {
      setCurrentChapterIndex(parseInt(savedChapter));
    }

    // التحقق مما إذا كان المستخدم قادماً من أمر يقصد به القراءة مباشرة (مثل أوامر كين)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('read') === 'true') {
      setView('read');
    }

    const savedScroll = localStorage.getItem(`novel-${novelId}-scroll`);
    setIsLoaded(true);

    // نعطي متصفح وقتاً صغيراً جداً ليرسم الفصل وبعدها نرجعه لموقعه القديم
    if (savedScroll) {
      setTimeout(() => {
        window.scrollTo({ top: parseFloat(savedScroll), behavior: 'instant' });
      }, 50);
    }
  }, [novelId]);

  // حفظ تلقائي لموقع القراءة عند عمل السكرول
  useEffect(() => {
    if (!isLoaded) return;
    
    // استخدام debounce حتى لا نستهلك الذاكرة بكثرة السكرول
    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        localStorage.setItem(`novel-${novelId}-scroll`, window.scrollY.toString());
      }, 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoaded, novelId, currentChapterIndex]);

  // حفظ وضع المشاهدة الحالي في الرابط لكي نتذكره عند عمل تحديث للصفحة
  useEffect(() => {
    if (!isLoaded) return;
    const url = new URL(window.location.href);
    if (view === 'read') {
      url.searchParams.set('read', 'true');
    } else {
      url.searchParams.delete('read');
    }
    window.history.replaceState(null, '', url.toString());
  }, [view, isLoaded]);

  // إخفاء المحتوى قليلاً حتى يتم تحميل الإعدادات لتجنب الرمشة البصرية
  if (!isLoaded) return <div className="min-h-screen bg-black" />;

  // ==========================================
  // واجهة تفاصيل الرواية (الصفحة قبل القراءة)
  // ==========================================
  if (view === 'details') {
    return (
      <div className={`min-h-screen p-8 transition-colors duration-500 flex flex-col justify-center items-center ${isDark ? 'bg-[#0a0a0a] text-gray-100' : 'bg-[#f4f4f5] text-gray-900'}`} dir="rtl">
        <div className="max-w-4xl w-full mb-8 flex justify-between items-center">
          <Link href="/" className="font-bold hover:text-red-500 flex items-center gap-2">
            <span className="text-xl">➔</span>
            <span>العودة للمكتبة</span>
          </Link>
          <button onClick={() => setIsDark(!isDark)} className="hover:scale-110 transition-transform">
            {isDark ? <img src="/moon.png" alt="Moon" className="w-10 h-10 drop-shadow-xl" /> : <img src="/sun.png" alt="Sun" className="w-10 h-10 drop-shadow-xl" />}
          </button>
        </div>

        <div className={`max-w-4xl w-full p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-8 ${isDark ? 'bg-[#111] border border-gray-800' : 'bg-white border border-gray-200'}`}>
          {/* صورة الغلاف */}
          <div className="w-full md:w-1/3 flex-shrink-0">
            <img 
              src={(novel as any).cover || "https://placehold.co/600x800/101010/8b0000?text=Cover"} 
              alt={novel.title} 
              className="w-full h-auto object-cover rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-gray-700/50"
            />
          </div>

          {/* معلومات الرواية */}
          <div className="flex flex-col flex-1 justify-center">
            <h1 className={`text-4xl md:text-5xl font-extrabold mb-4 font-serif text-transparent bg-clip-text bg-gradient-to-l ${isDark ? 'from-red-500 to-purple-500' : 'from-red-600 to-purple-800'}`}>
              {novel.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-6 text-sm">
              <span className={`px-4 py-1.5 rounded-full font-bold shadow-inner ${isDark ? 'bg-red-900/30 text-red-400 border border-red-800' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                📌 تصنيف: {novel.genre}
              </span>
              <span className={`px-4 py-1.5 rounded-full font-bold shadow-inner ${isDark ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-gray-200 text-gray-700 border border-gray-300'}`}>
                📑 عدد الفصول: {allChapters.length}
              </span>
            </div>

            <p className={`text-lg leading-relaxed mb-8 opacity-90 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {novel.desc}
            </p>

            {novelId === 1 && (
              <div className={`mb-8 p-6 rounded-2xl border ${isDark ? 'bg-[#1a0f0f] border-red-900/30 shadow-[0_0_15px_rgba(220,38,38,0.1)]' : 'bg-red-50 border-red-200 shadow-md'} relative overflow-hidden`}>
                <div className="flex items-center gap-3 mb-3">
                  <img src="/gg.png" alt="Caine Note" className="w-32 h-32 md:w-48 md:h-48 object-contain filter drop-shadow-[0_0_8px_rgba(220,38,38,0.8)] hover:scale-110 transition-transform" />
                  <h3 className="text-2xl font-bold text-red-600 font-serif">ملاحظة من كين:</h3>
                </div>
                <p className={`text-lg leading-relaxed italic ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  "مرحباً بك في عالم فانغ يوان المظلم! هنا تسقط الأقنعة وتظهر الطبيعة البشرية بأبشع (وأصدق) صورها بعيداً عن أوهام الخير والشر المبتذلة... في هذا العالم، لا يوجد أصدقاء، لا يوجد أعداء إلى الأبد، توجد فقط المصالح والمنافع.
                  هل تعتقد أنك رأيت خبثاً من قبل؟ انتظر حتى ترى ما سيفعله فانغ يوان لتحقيق هدفه! لا تبحث عن أبطال مثاليين هنا يا صديقي. تخلّ عن مثاليتك، جهز كوب قهوتك، واستعد للجنون المطلق واستمتع بالرحلة المظلمة! 🔥📚💀"
                </p>
              </div>
            )}

            {/* أزرار بدء القراءة والمفضلة */}
            <div className="mt-auto flex gap-2 sm:gap-4">
              <button
                onClick={() => {
                  setView('read');
                  const savedScroll = localStorage.getItem(`novel-${novelId}-scroll`);
                  setTimeout(() => {
                    if (savedScroll) {
                      window.scrollTo({ top: parseFloat(savedScroll), behavior: 'instant' });
                    } else {
                      window.scrollTo(0,0);
                    }
                  }, 50);
                }}
                className="flex-1 py-4 rounded-xl font-bold text-lg sm:text-xl bg-red-600 hover:bg-red-700 text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
              >
                {currentChapterIndex > 0 ? `📖 متابعة (الفصل ${currentChapterIndex + 1})` : "📖 ابدأ القراءة الآن"}
              </button>

              {/* زر المفضلة (القلب) */}
              <button
                onClick={toggleFavorite}
                className={`w-16 flex-shrink-0 flex items-center justify-center rounded-xl text-3xl transition-all duration-300 hover:scale-110 active:scale-95 border-2 shadow-lg ${
                  isFavorite 
                    ? 'bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
                    : (isDark ? 'bg-gray-800 border-gray-700 text-gray-500 hover:text-red-400 hover:border-red-400/50' : 'bg-gray-100 border-gray-300 text-gray-400 hover:text-red-400 hover:border-red-400/50')
                }`}
                title={isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
              >
                {isFavorite ? "❤️" : "🤍"}
              </button>
            </div>
          </div>
        </div>

        {/* قائمة الفصول */}
        <div className={`max-w-4xl w-full mt-8 p-6 rounded-2xl ${isDark ? 'bg-[#111] border border-gray-800' : 'bg-white border border-gray-200 shadow-lg'}`}>
          <h2 className="text-2xl font-bold mb-6 font-serif border-b pb-2 border-red-500/20">فهرس الفصول</h2>
          {novel.volumes ? (
            <div className="space-y-8">
              {novel.volumes.map((vol: any, volIdx: number) => {
                let startIdx = 0;
                for (let i = 0; i < volIdx; i++) startIdx += novel.volumes[i].chapters.length;

                const isCollapsed = collapsedVolumes[volIdx] ?? true; // مغلق افتراضياً

                return (
                  <div key={volIdx} className="space-y-4">
                    <button 
                      onClick={() => toggleVolume(volIdx)}
                      className={`w-full text-right flex justify-between items-center text-xl font-bold p-3 rounded-lg border transition-colors ${isDark ? 'bg-gray-800/50 hover:bg-gray-800 border-gray-700 text-red-400' : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-red-600'}`}
                    >
                      <span>📚 {vol.title}</span>
                      <span className="text-2xl">{isCollapsed ? '➕' : '➖'}</span>
                    </button>
                    
                    {!isCollapsed && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...vol.chapters].reverse().map((chap: any, reversedIdx: number) => {
                          const rawIdx = (vol.chapters.length - 1) - reversedIdx;
                          const globalIdx = startIdx + rawIdx;
                          return (
                            <button 
                              key={globalIdx}
                              onClick={() => {
                                changeChapter(globalIdx);
                                setView('read');
                              }}
                              className={`text-right p-4 rounded-lg font-bold transition-all border ${
                                globalIdx === currentChapterIndex 
                                  ? 'border-red-500 bg-red-500/10 text-red-500'
                                  : (isDark ? 'border-gray-800 hover:bg-gray-800 text-gray-400 hover:text-white' : 'border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-black')
                              }`}
                            >
                              {chap.title}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allChapters.map((chap: any, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => {
                    changeChapter(idx);
                    setView('read');
                  }}
                  className={`text-right p-4 rounded-lg font-bold transition-all border ${
                    idx === currentChapterIndex 
                      ? 'border-red-500 bg-red-500/10 text-red-500'
                      : (isDark ? 'border-gray-800 hover:bg-gray-800 text-gray-400 hover:text-white' : 'border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-black')
                  }`}
                >
                  {chap.title}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* قسم التعليقات (يظهر في صفحة التفاصيل) */}
        <Comments novelId={novel.id} />
      </div>
    );
  }

  // ==========================================
  // واجهة القراءة (التي كانت موجودة مسبقاً)
  // ==========================================
  return (
    <div className={`min-h-screen p-8 font-sans transition-colors duration-500 ${isDark ? 'bg-[#050505] text-gray-200' : 'bg-[#fcfcfc] text-gray-800'}`} dir="rtl">
      
      {/* الشريط العلوي للتنقل وتوحيد الأدوات */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-12">
        <button onClick={() => setView('details')} className={`font-bold hover:text-red-500 transition-colors flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className="text-xl">➔</span>
          <span>صفحة الرواية</span>
        </button>

        <div className="flex items-center gap-4">
          {/* زر الوضع المضيء/المظلم - عاد لمكانه في الأعلى */}
          <button 
            onClick={() => setIsDark(!isDark)}
            title={isDark ? "أشعل النور، أنا خائف" : "أطفئ النور"}
            className={`p-2 transition-all duration-300 flex items-center justify-center hover:scale-110 hover:opacity-80`}
          >
            {isDark ? (
              <img src="/moon.png" alt="Moon" className="w-12 h-12 object-contain drop-shadow-xl" />
            ) : (
              <img src="/sun.png" alt="Sun" className="w-12 h-12 object-contain drop-shadow-xl" />
            )}
          </button>
        </div>
      </div>

      {/* زر إعدادات القراءة العائم */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col-reverse items-start">
        {/* الزر الرئيسي لفتح/إغلاق الإعدادات */}
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className={`transition-all duration-300 hover:scale-110 flex items-center justify-center ${
            isSettingsOpen ? 'rotate-12' : ''
          }`}
          title="إعدادات القراءة"
        >
          <img src="/zobel.png" alt="Zobel Settings" className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-2xl hover:drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
        </button>

        {/* قائمة الإعدادات (تظهر عند الضغط) */}
        {isSettingsOpen && (
          <div className={`mb-4 p-4 rounded-xl shadow-2xl flex flex-col gap-4 border w-64 ${
            isDark ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-white border-gray-200 shadow-xl'
          }`}>
            <h3 className="font-bold text-lg mb-2 text-center border-b pb-2">إعدادات القراءة ⚙️</h3>
            
            {/* اختيار الفصل */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold opacity-70">الفصل الحالي:</label>
              <select 
                value={currentChapterIndex}
                onChange={(e) => {
                  changeChapter(parseInt(e.target.value));
                  setIsSettingsOpen(false); // إغلاق القائمة بعد اختيار الفصل
                }}
                className={`p-2 rounded-lg font-bold outline-none cursor-pointer border ${isDark ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700' : 'bg-gray-50 border-gray-300 text-gray-800'}`}
              >
                {allChapters.map((chap: any, idx: number) => (
                  <option key={idx} value={idx}>
                    {chap.title}
                  </option>
                ))}
              </select>
            </div>

            {/* تغيير حجم الخط */}
            <button 
              onClick={changeFontSize}
              className={`p-2 rounded-lg font-bold transition-all duration-300 border flex justify-between items-center ${
                isDark ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
              }`}
            >
              <span>حجم الخط:</span>
              <span className="text-red-500">{fontSizes[fontSizeIndex].label}</span>
            </button>

            {/* تغيير نوع الخط */}
            <button 
              onClick={changeFontFamily}
              className={`p-2 rounded-lg font-bold transition-all duration-300 border flex justify-between items-center ${
                isDark ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
              }`}
            >
              <span>نوع الخط:</span>
              <span className="text-red-500">{fontFamilies[fontFamilyIndex].label}</span>
            </button>
          </div>
        )}
      </div>

      {/* منطقة القراءة */}
      <main className="max-w-3xl mx-auto pb-32">
        <h1 className={`text-4xl md:text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-l ${isDark ? 'from-red-600 to-purple-500' : 'from-red-700 to-purple-800'}`}>
          {novel.title} <span className="text-xl font-normal text-gray-500 block mt-2">({novel.genre})</span>
        </h1>
        
        <h2 className="text-2xl font-bold mb-8 text-center text-red-500 border-b border-red-500/20 pb-4">
          {currentChapter.title}
        </h2>

        <div
          className={`p-8 md:p-12 rounded-2xl leading-loose border-2 tracking-wide shadow-2xl transition-all duration-300
          ${fontSizes[fontSizeIndex].classes}
          ${fontFamilies[fontFamilyIndex].classes}
          ${isDark ? 'bg-[#111] border-gray-800 text-gray-300' : 'bg-[#fffbdd] border-[#e8e3c8] text-[#3d3326] shadow-[#00000010]'}`}>
          {currentChapter.content.split('\n').map((paragraph: string, index: number) => (
            <p key={index} className="mb-6">{paragraph}</p>
          ))}
        </div>
        
        {/* أزرار التنقل بين الفصول */}
        <div className="mt-12 flex justify-between items-center bg-gray-900/10 p-4 rounded-xl border border-gray-700/20">
          <button 
            onClick={goToNextChapter}
            disabled={currentChapterIndex === allChapters.length - 1}        
            className={`px-6 py-3 rounded-xl font-bold transition-all ${currentChapterIndex === allChapters.length - 1 ? 'opacity-30 cursor-not-allowed bg-gray-300 text-gray-500' : 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:scale-105'}`}
          >
            ← الفصل التالي
          </button>

          <div className="text-gray-500 font-bold">
            جزء {currentChapterIndex + 1} من {allChapters.length}
          </div>

          <button 
            onClick={goToPrevChapter}
            disabled={currentChapterIndex === 0}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${currentChapterIndex === 0 ? 'opacity-30 cursor-not-allowed bg-gray-300 text-gray-500' : 'bg-gray-700 text-white hover:bg-gray-800 shadow-lg hover:scale-105'}`}
          >
            الفصل السابق →
          </button>
        </div>

        {/* قسم التعليقات في واجهة القراءة أيضاً */}
        <div className="mt-16">
          <Comments novelId={novel.id} />
        </div>
      </main>
    </div>
  );
}
