"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X } from 'lucide-react';

export default function CaineChat({ readingContext }: { readingContext?: string }) {
  const [isIdle, setIsIdle] = useState(true);
  const [caineMessage, setCaineMessage] = useState("");
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // لإجبار كين على العودة لمكانه بدقة
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const constraintsRef = useRef(null);
  const lastEffectRef = useRef<string>("");

  const closeCaine = () => {
    setIsIdle(true);
    setIsInputOpen(false);
    setCaineMessage("");
    // إرجاع كين إلى مكانه الافتراضي (0,0) في الزاوية اليمنى
    setPosition({ x: 0, y: 0 });
    
    if (typeof window !== 'undefined') {
      document.body.style.transform = "none";
      document.body.style.filter = "none";
      document.body.style.animation = "none";
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
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
      if (readingContext) {
        formData.append("readingContext", readingContext);
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const finalResponse = data.reply || data.error || "خطأ مجهول في قاعدة بياناتي المجنونة! 🤯";
      
      const isEvasion = finalResponse.includes("[مراوغة]");
      const displayText = finalResponse.replace(/\[مراوغة\]/g, "").trim();

      setCaineMessage(displayText);
      
      // تطبيق التأثيرات فقط إذا كانت الاستجابة مراوغة مخصصة
      if (isEvasion) {
          applyVisualEffects();
      } else {
          // تنظيف أي تأثير متبقي للأسئلة العادية
          document.body.style.transform = "none";
          document.body.style.filter = "none";
          document.body.style.animation = "none";
          document.body.style.backgroundColor = "";
          document.body.style.color = "";
      }

    } catch (err) {
      setCaineMessage("الشبكة تحترق!! السيرفر انفجر!! لا يمكنني الاتصال بالذكاء الاصطناعي الآن! 🔥");
    } finally {
      setIsLoading(false);
    }
  };

  const applyVisualEffects = () => {
    if (typeof window !== 'undefined') {
      const body = document.body;
      
      // إعادة ضبط أي تأثيرات قديمة
      body.style.transform = "none";
      body.style.filter = "none";
      body.style.animation = "none";
      body.style.backgroundColor = "";
      body.style.color = "";

      const effectsList = ["shake", "rotate", "invert", "fade", "rainbow", "glitch", "hack", "spin", "swing"];
      
      // لتجنب تكرار نفس التأثير مرتين متتاليتين
      const availableEffects = effectsList.filter(e => e !== lastEffectRef.current);
      const chosenEffect = availableEffects[Math.floor(Math.random() * availableEffects.length)];
      lastEffectRef.current = chosenEffect;

      if (chosenEffect === "shake") {
        body.style.animation = "shake 0.5s infinite";
        setTimeout(() => { body.style.animation = ""; }, 2000);
      } else if (chosenEffect === "rotate") {
        body.style.transition = "transform 1s ease-in-out";
        body.style.transform = "rotate(180deg)";
        setTimeout(() => { body.style.transform = "none"; }, 4000);
      } else if (chosenEffect === "invert") {
        body.style.transition = "filter 0.5s ease-in-out";
        body.style.filter = "invert(1) hue-rotate(180deg)";
        setTimeout(() => { body.style.filter = "none"; }, 3000);
      } else if (chosenEffect === "fade") {
        body.style.transition = "opacity 1s ease-in-out";
        body.style.opacity = "0.1";
        setTimeout(() => { body.style.opacity = "1"; }, 3000);
      } else if (chosenEffect === "rainbow") {
        body.style.animation = "rainbowBg 3s infinite";
        setTimeout(() => { body.style.animation = ""; }, 6000);
      } else if (chosenEffect === "glitch") {
        body.style.animation = "glitch 0.2s infinite";
        body.style.filter = "contrast(200%) grayscale(100%)";
        setTimeout(() => { body.style.animation = ""; body.style.filter = "none"; }, 1500);
      } else if (chosenEffect === "hack") {
        const originalBg = body.style.backgroundColor;
        body.style.backgroundColor = "#001100";
        body.style.color = "#00ff00";
        body.style.fontFamily = "monospace";
        setTimeout(() => { body.style.backgroundColor = originalBg; body.style.color = ""; body.style.fontFamily = ""; }, 3000);
      } else if (chosenEffect === "spin") {
        body.style.animation = "spin 0.5s linear infinite";
        setTimeout(() => { body.style.animation = ""; }, 2000);
      } else if (chosenEffect === "swing") {
        body.style.animation = "swing 3s ease-in-out infinite alternate";
        setTimeout(() => { body.style.animation = ""; }, 6000);
      }
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
        // استخدام animate للتحكم المطلق بموقعه عند العودة لحالة الخمول
        animate={isIdle ? { x: 0, y: 0 } : { x: position.x, y: position.y }}
        onDragEnd={(event, info) => {
           // تحديث الإحداثيات عند نهاية سحبه ليبقى فيها إلا لو عاد لخمول
           if (!isIdle) {
               setPosition({ x: position.x + info.offset.x, y: position.y + info.offset.y });
           }
        }}
        transition={isIdle ? { type: "spring", stiffness: 300, damping: 20 } : { type: "spring", stiffness: 300, damping: 20 }}
        className={`fixed bottom-10 right-10 pointer-events-auto flex flex-col items-center z-[101] ${isIdle ? '' : 'cursor-grab active:cursor-grabbing'}`}
      >
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
              
              

              <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[14px] border-r-[14px] border-t-[20px] border-l-transparent border-r-transparent border-t-red-600"></div>
              <div className="absolute -bottom-[14px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[16px] border-l-transparent border-r-transparent border-t-white"></div>
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
              <form onSubmit={handleSendMessage} className="flex-1 flex gap-2 w-full">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => { setInputText(e.target.value); }}
                  placeholder="تحدث مع كين..."
                  autoFocus
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-transparent text-sm font-bold text-gray-800 focus:outline-none placeholder-gray-400"
                />

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors ${isLoading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'}`}
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
                // نظهر رسالة كين ولا نفتح مربع الإدخال فوراً لكي يتمكن من قراءة الرسالة
                setIsInputOpen(false); 
                setCaineMessage("ها قد ظهرت! 💥 ماذا تريد؟ 😈"); 
                resetIdleTimer(); 

                if ('speechSynthesis' in window) {
                  const utterance = new SpeechSynthesisUtterance("ها قد ظهرت! ماذا تريد؟");
                  utterance.lang = 'ar-SA';
                  utterance.pitch = 1.6; 
                  utterance.rate = 1.2;  
                  window.speechSynthesis.speak(utterance);
                }
            }}
            className="w-12 h-12 md:w-16 md:h-16 bg-red-600 rounded-full cursor-pointer transition-transform transform hover:scale-110 shadow-[0_0_30px_rgba(220,38,38,1)] animate-pulse flex items-center justify-center"
            title="أيقظ كين"
          >
            <span className="text-white text-xs font-bold opacity-50">Caine</span>
          </div>
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
      </motion.div>
    </>
  );
} 
