"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { novelsList } from "@/data/novels";

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    };
    window.addEventListener("open-global-search", handleOpen);
    return () => window.removeEventListener("open-global-search", handleOpen);
  }, []);

  const results = searchTerm.trim() === "" 
    ? [] 
    : novelsList.filter((n: any) => n.title?.includes(searchTerm) || n.author?.includes(searchTerm) || n.genre?.includes(searchTerm));

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-[90] w-12 h-12 bg-[#1b1c2a]/80 backdrop-blur-md border border-[#2b2d42] rounded-full flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:bg-[#2b2d42] transition-all hover:scale-110 active:scale-95"
        title="البحث العالمي"
      >
        🔍
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Search Input Box */}
      <div className="w-full max-w-2xl relative bg-[#1a1c2a] border border-[#2b2d42] p-2 rounded-2xl shadow-2xl flex items-center gap-3">
        <button 
          onClick={() => { setIsOpen(false); setSearchTerm(""); }}
          className="w-10 h-10 shrink-0 bg-red-900/30 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center font-bold"
        >
          X
        </button>
        <input 
          ref={inputRef}
          type="text" 
          placeholder="ابحث عن رواية..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent text-white outline-none placeholder:text-gray-500 text-lg px-2"
        />
        <span className="text-2xl ml-2">🔍</span>
      </div>

      {/* Results */}
      <div className="w-full max-w-2xl mt-4 flex flex-col gap-2 max-h-[60vh] overflow-y-auto no-scrollbar pb-20">
        {searchTerm.trim() !== "" && results.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            لم يتم العثور على أي رواية مطابقة 🥀
          </div>
        ) : (
          results.map((novel: any) => (
            <Link 
              key={novel.id} 
              href={`/novel/${novel.id}`}
              onClick={() => { setIsOpen(false); setSearchTerm(""); }}
              className="bg-[#11121d] border border-[#2b2d42] rounded-xl p-3 flex gap-4 items-center hover:bg-[#202231] hover:border-red-500/50 transition-all shadow-lg"
            >
              <img 
                src={(novel as any).cover || `https://placehold.co/100x150/181825/8b5cf6?text=${encodeURIComponent(novel.title)}`}
                alt={novel.title}
                className="w-12 h-16 object-cover rounded-lg border border-[#2b2d42]"
              />
              <div className="flex-1 text-right">
                <h4 className="font-bold text-white text-base">{novel.title}</h4>
                <p className="text-xs text-[#8e8f9e] mt-1">{novel.genre} | 👤 {(novel as any).author || "مجهول"}</p>
              </div>
              <span className="text-white bg-red-900/40 px-3 py-1 rounded-lg text-xs border border-red-900/50">
                اقرأ
              </span>
            </Link>
          ))
        )}
      </div>

    </div>
  );
}
