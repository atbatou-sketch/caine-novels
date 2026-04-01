"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { novelsList } from "../data/novels";

export default function HistoryTab() {
  const [readNovels, setReadNovels] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("caine-read-novels");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setReadNovels(parsed);
        } else {
          setReadNovels(Object.keys(parsed).filter((id) => parsed[id]));        
        }
      } catch (e) {}
    }
  }, []);

  const historyIds = readNovels.filter(id => id != null).map(id => id.toString());
  const historyList = novelsList.filter((n: any) => n && n.id && historyIds.includes(n.id.toString()));

  const getProgressInfo = (novelId: string | number) => {
    if (typeof window !== 'undefined') {
      const savedChapter = localStorage.getItem(`novel-${novelId}-chapter`);
      if (savedChapter) {
        const chapIdx = parseInt(savedChapter);
        const novel = novelsList.find((n: any) => n.id.toString() === novelId.toString());
        if (novel) {
          const allChapters = (novel as any).volumes ? (novel as any).volumes.flatMap((v: any) => v.chapters) : ((novel as any).chapters || []);
          if (allChapters[chapIdx]) {
            return { index: chapIdx, title: allChapters[chapIdx].title };       
          }
        }
        return { index: chapIdx, title: `الفصل ${chapIdx + 1}` };
      }
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#0f101a] pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <h2 className="text-2xl font-bold text-white mb-6">سجل القراءة</h2>   

        {historyList.length === 0 ? (
          <div className="text-center py-16 text-[#8e8f9e] border border-[#2b2d42] border-dashed rounded-[2rem] bg-[#1a1c2a]/50">
            <div className="text-4xl mb-4 opacity-50">⛺</div>
            لم تقرأ أي رواية بعد.<br />
            <span className="text-xs mt-2 block opacity-70">الظلام ينتظرك في الخيمة.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {historyList.map((novel: any) => {
              const progress = getProgressInfo(novel.id);
              const hrefLink = progress !== null ? `/novel/${novel.id}?read=true` : `/novel/${novel.id}`;
              
              return (
              <Link href={hrefLink} key={novel.id}>
                <div className="bg-[#1a1b2a] p-4 rounded-[2rem] border border-[#2b2d42] flex gap-4 hover:-translate-y-1 transition-transform hover:shadow-xl hover:bg-[#1f2133]">
                  <img
                    src={novel.cover || `https://placehold.co/100x140/181825/dc2626?text=${encodeURIComponent(novel.title)}`}
                    alt={novel.title}
                    className="w-16 h-24 object-cover rounded-xl"
                  />
                  <div className="flex flex-col justify-center flex-1">       
                    <h3 className="text-white font-bold mb-1">{novel.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-[#2a2c3d] text-gray-300 rounded border border-[#3b3d54] inline-block w-max">{novel.genre}</span>    
                      {progress !== null && (
                        <span className="text-xs px-2 py-1 bg-red-900/30 text-red-300 rounded border border-red-900/50 inline-flex items-center gap-1">      
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> توقفت عند: {progress.title}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center text-red-600 pl-2">       
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                     </svg>
                  </div>
                </div>
              </Link>
            )})}
          </div>
        )}
      </div>
    </div>
  );
}
