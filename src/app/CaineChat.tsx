"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { Send, X } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useSession } from "next-auth/react";
import { novelsData } from '../data/novels';

export default function CaineChat({ readingContext }: { readingContext?: string }) {
  const { data: session, status } = useSession();
  const [isIdle, setIsIdle] = useState(true);
  const [caineMessage, setCaineMessage] = useState("");
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // جلب سياق القراءة تلقائياً بناءً على الرابط الحالي إذا لم يتم تمريره كخاصية
  let currentContext = readingContext;
  if (!currentContext && pathname) {
    try {
      if (pathname.includes('/read')) {
        const parts = pathname.split('/');
        const novelId = parts[parts.indexOf('novel') + 1];
        const chapterIndex = parseInt(searchParams.get('chapter') || '0', 10);
        
        const novel = (novelsData as any)[novelId];
        if (novel) {
          let flatChapters = [];
          if (novel.volumes) {
            flatChapters = novel.volumes.flatMap((v: any) => v.chapters);
          } else if (novel.chapters) {
            flatChapters = novel.chapters;
          }
          
          const chap = flatChapters[chapterIndex];
          const prevChap = chapterIndex > 0 ? flatChapters[chapterIndex - 1] : null;
          const nextChap = chapterIndex < flatChapters.length - 1 ? flatChapters[chapterIndex + 1] : null;
          
          if (chap) {
            currentContext = `الرواية: ${novel.title} | الفصل الحالي: ${chap.title} | النص: ${chap.content ? chap.content.substring(0, 1500) : ''}...`;
            
            if (prevChap) {
                currentContext += `\nالفصل المسبق (${prevChap.title}): ملخص أو مقتطف: ${prevChap.content ? prevChap.content.substring(0, 300) : ''}...`;
            }
            if (nextChap) {
                currentContext += `\nالفصل القادم (${nextChap.title}): مقتطف: ${nextChap.content ? nextChap.content.substring(0, 300) : ''}...`;
            }
          }
        }
      } else if (pathname.includes('/novel/')) {
        // إذا كان المستخدم يتصفح صفحة الرواية فقط وليس فصلاً محدداً
        const parts = pathname.split('/');
        const novelId = parts[parts.indexOf('novel') + 1];
        const novel = (novelsData as any)[novelId];
        if (novel) {
          currentContext = `(المستخدم يتصفح الآن الغلاف وتفاصيل الرواية) الجالس أمامك ينظر إلى هذه الرواية - العنوان: ${novel.title} | التصنيف: ${novel.genre} | الوصف: ${novel.desc || "لا يوجد وصف"}`;
        }
      } else {
        currentContext = "(المستخدم الآن يتصفح صفحات عامة في الموقع. العب بأعصابه قليلاً لأنه تأخر في القراءة.)";
      }
    } catch(e) {
      console.error('Failed to parse reading context', e);
    }
  }

  const constraintsRef = useRef(null);
  const caineRef = useRef<HTMLDivElement>(null);
  const lastEffectRef = useRef<string>("");

  const x = useSpring(0, { stiffness: 300, damping: 20 });
  const y = useSpring(0, { stiffness: 300, damping: 20 });

  useEffect(() => {
    // ترحيب كين بالمستخدم عند تسجيل الدخول
    if (status === 'authenticated' && session?.user?.name) {
      const greetKey = `caine_greeted_${session?.user?.email}`;
      if (!sessionStorage.getItem(greetKey)) {
        sessionStorage.setItem(greetKey, 'true');
        setTimeout(() => {
          setIsIdle(false);
          setCaineMessage(`أهلاً بك في عالمي المظلم يا ${session?.user?.name}... لقد كنت بانتظارك.`);
        }, 2000);
      }
    }
  }, [status, session]);

  useEffect(() => {
    const handleLogin = (e: any) => {
      setTimeout(() => {
        setIsIdle(false);
        setCaineMessage(`أهلاً بك في عالمي المظلم يا ${e.detail.userName}... لقد كنت بانتظارك.`);
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 800);
      }, 1000);
    };
    window.addEventListener("caine-login-success", handleLogin);
    return () => window.removeEventListener("caine-login-success", handleLogin);
  }, []);


  useEffect(() => {
    if (isIdle) {
      x.set(0);
      y.set(0);
    }
  }, [isIdle, x, y]);

  const closeCaine = () => {
      setIsIdle(true);
      setCaineMessage("");
      setIsInputOpen(false);
      x.set(0);
      y.set(0);
      
      // التحديث يضمن عودة كين إلى مكانه تماماً وبدون مشاكل في واجهة المستخدم
      window.location.reload();
  };
  const applyVisualEffects = () => {
    const caineElement = caineRef.current;
    if (!caineElement) return;

    caineElement.style.color = "";

    const effectsList = ["shake", "rotate", "invert", "fade", "rainbow", "glitch", "hack", "spin", "swing"];

    // لتجنب تكرار نفس التأثير مرتين متتاليتين
    const availableEffects = effectsList.filter(e => e !== lastEffectRef.current);
    const chosenEffect = availableEffects[Math.floor(Math.random() * availableEffects.length)];
    lastEffectRef.current = chosenEffect;

    if (chosenEffect === "shake") {
      caineElement.style.animation = "shake 0.5s infinite";
      setTimeout(() => { if(caineRef.current) caineRef.current.style.animation = ""; }, 2000);
    } else if (chosenEffect === "rotate") {
      caineElement.style.transition = "transform 1s ease-in-out";
      caineElement.style.transform = "rotate(180deg)";
      setTimeout(() => { if(caineRef.current) caineRef.current.style.transform = "none"; }, 4000);
    } else if (chosenEffect === "invert") {
      caineElement.style.transition = "filter 0.5s ease-in-out";
      caineElement.style.filter = "invert(1) hue-rotate(180deg)";
      setTimeout(() => { if(caineRef.current) caineRef.current.style.filter = "none"; }, 3000);
    } else if (chosenEffect === "fade") {
      caineElement.style.transition = "opacity 1s ease-in-out";
      caineElement.style.opacity = "0.1";
      setTimeout(() => { if(caineRef.current) caineRef.current.style.opacity = "1"; }, 3000);
    } else if (chosenEffect === "rainbow") {
      caineElement.style.animation = "rainbowBg 3s infinite";
      setTimeout(() => { if(caineRef.current) caineRef.current.style.animation = ""; }, 6000);
    } else if (chosenEffect === "glitch") {
      caineElement.style.animation = "glitch 0.2s infinite";
      caineElement.style.filter = "contrast(200%) grayscale(100%)";
      setTimeout(() => { if(caineRef.current) { caineRef.current.style.animation = ""; caineRef.current.style.filter = "none"; } }, 1500);
    } else if (chosenEffect === "hack") {
      const originalBg = caineElement.style.backgroundColor;
      caineElement.style.backgroundColor = "#001100";
      caineElement.style.color = "#00ff00";
      caineElement.style.fontFamily = "monospace";
      setTimeout(() => { if(caineRef.current) { caineRef.current.style.backgroundColor = originalBg; caineRef.current.style.color = ""; caineRef.current.style.fontFamily = ""; } }, 3000);
    } else if (chosenEffect === "spin") {
      caineElement.style.animation = "spin 0.5s linear infinite";
      setTimeout(() => { if(caineRef.current) caineRef.current.style.animation = ""; }, 2000);
    } else if (chosenEffect === "swing") {
      caineElement.style.animation = "swing 3s ease-in-out infinite alternate";
      setTimeout(() => { if(caineRef.current) caineRef.current.style.animation = ""; }, 6000);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // كين يفكر
    setCaineMessage("امممم... جاري المعالجة... بيب بوب... 🤔⚡");
    setIsInputOpen(false);
    const tempText = inputText;

    setInputText('');
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("message", tempText);
      if (currentContext) {
        formData.append("readingContext", currentContext);
      }
      if (session?.user?.name) {
        formData.append("userName", session.user.name);
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const finalResponse = data.reply || data.error || "خطأ مجهول في قاعدة بياناتي المجنونة! 🤯";

      const isEvasion = finalResponse.includes("[مراوغة]");
      let displayText = finalResponse.replace(/\[مراوغة\]/g, "").trim();

// البحث عن أوامر كين الخاصة
      const navMatch = displayText.match(/\[NAVIGATE:(\d+)(?::(\d+))?\]/);
      if (navMatch) {
         const novelId = navMatch[1];
         const chapterId = navMatch[2];
         
         if (chapterId) {
             localStorage.setItem(`novel-${novelId}-chapter`, chapterId);
         }

         displayText = displayText.replace(navMatch[0], "").trim();
         
         setTimeout(() => {
            router.push('/novel/' + novelId + (chapterId ? '?read=true' : ''));
         }, 1500);
      }

      if (displayText.includes("[NAVIGATE:HOME]")) {
        displayText = displayText.replace("[NAVIGATE:HOME]", "").trim();
        setTimeout(() => {
            router.push('/');
        }, 1500);
      }

      if (displayText.includes("[BLACKOUT]")) {
        displayText = displayText.replace("[BLACKOUT]", "").trim();
        const blackoutDiv = document.createElement("div");
        blackoutDiv.style.position = "fixed";
        blackoutDiv.style.top = "0";
        blackoutDiv.style.left = "0";
        blackoutDiv.style.width = "100vw";
        blackoutDiv.style.height = "100vh";
        blackoutDiv.style.backgroundColor = "black";
        blackoutDiv.style.zIndex = "999999";
        document.body.appendChild(blackoutDiv);
        setTimeout(() => document.body.removeChild(blackoutDiv), 2500);
      }

      if (displayText.includes("[GLITCH_SCREEN]")) {
        displayText = displayText.replace("[GLITCH_SCREEN]", "").trim();
        document.body.style.animation = "glitch 0.2s 10";
        document.body.style.filter = "contrast(200%) grayscale(100%) invert(1)";
        setTimeout(() => {
          document.body.style.animation = "";
          document.body.style.filter = "none";
        }, 2000);
      }

      setCaineMessage(displayText);

      // تطبيق التأثيرات فقط إذا كانت الاستجابة مراوغة مخصصة
      if (isEvasion) {
          applyVisualEffects();
      } else {
          // تنظيف أي تأثير متبقي للأسئلة العادية
            if (caineRef.current) {
              caineRef.current.style.transform = "none";
              caineRef.current.style.filter = "none";
              caineRef.current.style.animation = "none";
              caineRef.current.style.backgroundColor = "";
              caineRef.current.style.color = "";
            }
      }
    } catch (err) {
      setCaineMessage("الشبكة تحترق!! السيرفر انفجر!! لا يمكنني الاتصال بالذكاء الاصطناعي الآن! 🔥");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        @keyframes rainbowBg {
          0% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(180deg); }
          100% { filter: hue-rotate(360deg); }
        }
        @keyframes glitch {
          0% { transform: translate(0) skew(0deg); }
          20% { transform: translate(-2px, 2px) skew(2deg); }
          40% { transform: translate(-2px, -2px) skew(-2deg); }
          60% { transform: translate(2px, 2px) skew(2deg); }
          80% { transform: translate(2px, -2px) skew(-2deg); }
          100% { transform: translate(0) skew(0deg); }
        }
        @keyframes spin {
          from { transform: rotate(0deg) scale(0.6); }
          to { transform: rotate(360deg) scale(1.1); }
        }
        @keyframes swing {
          0% { transform: perspective(400px) rotateX(10deg) rotateY(-10deg) scale(1.05); }
          50% { transform: perspective(400px) rotateX(-5deg) rotateY(10deg) scale(0.95); }
          100% { transform: perspective(400px) rotateX(15deg) rotateY(-5deg) scale(1.1); }
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none z-[100]" ref={constraintsRef} />
      <motion.div
        drag={!isIdle}
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        onDragEnd={() => { if (isIdle) { x.set(0); y.set(0); } }}
        style={{ x, y }}
        className={`fixed bottom-4 right-4 pointer-events-auto flex flex-col justify-end items-end z-[101] ${isIdle ? '' : 'cursor-grab active:cursor-grabbing'}`}
      >
        <div ref={caineRef} className="flex flex-col items-end w-full h-full relative">
        <AnimatePresence>
          {caineMessage && !isInputOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              className="relative bg-white border-4 border-red-600 rounded-3xl p-4 mb-6 shadow-2xl max-w-[300px] text-center mx-4 flex flex-col items-center gap-3"
              dir="rtl"
            >
              <p className="text-gray-900 text-sm md:text-base font-extrabold leading-relaxed">{caineMessage}</p>



              <div className="absolute -bottom-4 right-8 w-0 h-0 border-l-[14px] border-r-[14px] border-t-[20px] border-l-transparent border-r-transparent border-t-red-600"></div>
              <div className="absolute -bottom-[12px] right-[34px] w-0 h-0 border-l-[10px] border-r-[10px] border-t-[16px] border-l-transparent border-r-transparent border-t-white"></div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isInputOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="bg-white p-2 rounded-full shadow-2xl flex items-center gap-2 mb-6 border-4 border-red-600 w-72 md:w-80 relative"
              dir="rtl"
            >
              <button
                onClick={() => { setIsInputOpen(false); }}
                title="إغلاق المحادثة"
                className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 shadow-md"
              >
                <X size={16} />
              </button>
              <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="اسألني أي شيء، وسأبهرك بإجاباتي! ✨"
                  className="flex-1 bg-transparent border-none outline-none text-gray-900 text-sm px-2 font-bold placeholder-gray-400"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <Send size={18} className="-translate-x-[2px] translate-y-[2px]" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {isIdle ? (
          <div
            onClick={() => {
                setIsIdle(false);
                setIsInputOpen(false);
                setCaineMessage("مرحباً! لقد عدت! 💥 كيف يمكنني مساعدتك؟ ✨");
            }}
            className="w-8 h-8 md:w-10 md:h-10 bg-red-600 rounded-full cursor-pointer transition-transform transform hover:scale-110 shadow-[0_0_30px_rgba(220,38,38,1)] animate-pulse"
            title="أيقظ كين"
          />
        ) : (
          <div className="relative">
            {/* زر إعادة كين لوضع الخمول */}
            <button
               onClick={(e) => { e.stopPropagation(); closeCaine(); }}
               className="absolute -top-2 left-2 bg-gray-900 border-2 border-red-600 text-red-500 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors z-50 shadow-md font-bold text-xs"
               title="نوم (إرجاعه لنقطة)"
            >
              Zz
            </button>
            <div
              onClick={() => { if(!isInputOpen) { setIsInputOpen(true); setCaineMessage(""); } }}
              className="w-40 h-40 md:w-56 md:h-56 relative group transition-transform transform hover:scale-110 cursor-pointer"
              title="تحدث معي!"
            >
              <img src="/caine.png" alt="Caine" className="w-full h-full object-contain filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.5)] select-none" draggable="false" />
            </div>
          </div>
        )}
        </div>
      </motion.div>
    </>
  );
}










































































































































































































