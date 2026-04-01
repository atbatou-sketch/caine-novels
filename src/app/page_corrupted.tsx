"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import CaineChat from "./CaineChat";
import ProfileTab from "../components/ProfileTab";
import LibraryTab from "../components/LibraryTab";
import HistoryTab from "../components/HistoryTab";
import { novelsList as novels } from '../data/novels';

export default function Home() {  
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const savedTab = localStorage.getItem('caine-active-tab');
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem('caine-active-tab', tab);
  };

  return (
    <div className="min-h-screen bg-[#0f101a] text-[#e2e2e6] font-sans pb-24" dir="rtl">
      
      {/* Header */}
      {activeTab !== 'profile' && (
        <header className="px-6 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <span className="text-red-600 text-3xl filter drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]">ðŸ¦‡</span> ÙƒÙŠÙ† Ø³ØªÙˆØ¯ÙŠÙˆ
          </h1>
          
        </header>
      )}

      {activeTab === 'home' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Ù‚Ø³Ù… Ø§Ù„Ø±ÙˆØ§ÙŠØ§Øª Ø§Ù„Ø´Ø§Ø¦Ø¹Ø© */}
        <section className="mb-10 w-full overflow-hidden">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold text-white">Ø§Ù„Ø±ÙˆØ§ÙŠØ§Øª Ø§Ù„Ø´Ø§Ø¦Ø¹Ø©</h2>
            <div className="flex gap-2" dir="ltr">
              <button className="w-8 h-8 rounded-full bg-[#1b1c2a] border border-[#2b2d42] text-xs flex items-center justify-center hover:bg-[#2b2d42] text-gray-400">â®</button>
              <button className="w-8 h-8 rounded-full bg-[#1b1c2a] border border-[#2b2d42] text-xs flex items-center justify-center hover:bg-[#2b2d42] text-gray-400">â¯</button>
            </div>
          </div>

          {/* Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ø£ÙÙ‚ÙŠØ© */}
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar pt-2 px-1">
            {novels.map((novel, idx) => (
              <Link href={`/novel/${novel.id}`} key={novel.id + 'pop'} className="min-w-[150px] w-[150px] bg-[#1a1b2a] border border-[#2b2d42] rounded-3xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1 shadow-lg hover:shadow-2xl">
                <div className="relative">
                   <img 
                    src={(novel as any).cover || `https://placehold.co/300x400/181825/8b5cf6?text=${encodeURIComponent(novel.title)}`} 
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
        </section>

        {/* Ù‚Ø³Ù… Ø¬Ø¯ÙŠØ¯ Ø§Ù„Ø±ÙˆØ§ÙŠØ§Øª */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-5">Ø¬Ø¯ÙŠØ¯ Ø§Ù„Ø±ÙˆØ§ÙŠØ§Øª</h2>
          <div className="flex flex-col gap-6">
            {novels.map((novel) => (
              <div key={novel.id + 'new'} className="bg-[#1a1c2a] border border-[#2b2d42] rounded-[2rem] p-5 flex flex-col md:flex-row gap-6 relative group shadow-xl">
                <div className="flex-1 flex flex-col order-2 md:order-1">
                  <h3 className="text-2xl font-bold text-white mb-3 text-center md:text-right">{novel.title}</h3>
                  <p className="text-[#8e8f9e] text-sm leading-relaxed line-clamp-3 mb-5 text-center md:text-right">
                    {novel.desc}
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
                    <span className="bg-transparent text-[#9798aa] text-xs px-4 py-1.5 rounded-full border border-[#3b3d54]">{novel.genre}</span>
                    <span className="bg-transparent text-[#9798aa] text-xs px-4 py-1.5 rounded-full border border-[#3b3d54]">Ù„Ù„ÙƒØ¨Ø§Ø±</span>
                  </div>
                  
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                    <span className="text-[#8e8f9e] text-sm">Ø¹Ø¯Ø¯ Ø§Ù„ÙØµÙˆÙ„: <strong className="text-white">{(novel as any).volumes ? (novel as any).volumes.flatMap((v:any)=>v.chapters).length : ((novel as any).chapters ? (novel as any).chapters.length : 0)}</strong></span>
                  </div>

                  <Link href={`/novel/${novel.id}`} className="mt-auto w-full bg-[#2a2c3d] hover:bg-[#34364e] text-[#e0e1e6] text-center font-bold py-3.5 rounded-2xl transition-colors border border-[#3a3c50]">
                    Ø§Ù‚Ø±Ø£
                  </Link>
                </div>

                <div className="w-full md:w-[180px] flex-shrink-0 order-1 md:order-2">
                  <img 
                    src={(novel as any).cover || `https://placehold.co/300x400/181825/ef4444?text=${encodeURIComponent(novel.title)}`} 
                    alt={novel.title}
                    className="w-full h-[260px] md:h-auto object-cover rounded-2xl border border-[#2b2d42] shadow-lg aspect-[3/4]"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      )}

      {activeTab === 'profile' && <ProfileTab />}
      {activeTab === 'library' && <LibraryTab />}
      {activeTab === 'history' && <HistoryTab />}

      {/* Ø§Ù„Ø¨Ø§Ø± Ø§Ù„Ø³ÙÙ„ÙŠ (Bottom Navigation) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#141520]/95 backdrop-blur-md border-t border-[#2b2d42] p-2 z-[60]">
        <div className="max-w-md mx-auto flex justify-between items-center text-[#8e8f9e]">
          <button 
            onClick={() => handleTabChange('home')} 
            className={`flex flex-col items-center gap-1.5 px-6 py-2 rounded-2xl transition-all ${activeTab === 'home' ? 'bg-[#2a2c3d] text-white' : 'hover:text-white'}`}
          >
            <span className="text-xl leading-none">âŒ‚</span>
            <span className="text-xs font-bold">Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©</span>
          </button>
          <button 
            onClick={() => handleTabChange('library')} 
            className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all ${activeTab === 'library' ? 'bg-[#2a2c3d] text-white' : 'hover:text-white'}`}
          >
            <span className="text-xl leading-none">â˜°</span>
            <span className="text-xs font-bold">Ø§Ù„Ù…ÙƒØªØ¨Ø©</span>
          </button>
          <button 
            onClick={() => handleTabChange('history')} 
            className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all ${activeTab === 'history' ? 'bg-[#2a2c3d] text-white' : 'hover:text-white'}`}
          >
            <span className="text-xl leading-none">â†º</span>
            <span className="text-xs font-bold">Ø§Ù„Ø³Ø¬Ù„</span>
          </button>
          <button 
            onClick={() => handleTabChange('profile')} 
            className={`flex flex-col items-center gap-1.5 px-4 py-2 rounded-2xl transition-all ${activeTab === 'profile' ? 'bg-[#2a2c3d] text-white' : 'hover:text-white'}`}
          >
            <span className="text-xl leading-none">ðŸ‘¤</span>
            <span className="text-xs font-bold">Ø§Ù„Ø­Ø³Ø§Ø¨</span>
          </button>
        </div>
      </nav>

      {/* Adding some padding so chat is reachable */}
      {activeTab === 'home' && (
        <div className="pb-[40px] relative z-40">
           <Suspense fallback={<div className="text-white text-center p-4">Loading Chat...</div>}>
             <CaineChat />
           </Suspense>
        </div>
      )}

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        body {
          background-color: #0f101a;
        }
      `}</style>
    </div>
  );
}