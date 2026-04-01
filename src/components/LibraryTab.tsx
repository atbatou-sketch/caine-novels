"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { novelsList } from "../data/novels";
import GlobalSearch from "./GlobalSearch";

export default function LibraryTab() {
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // Extract all unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    novelsList.forEach((novel: any) => {
      if (novel.genre) {
        cats.add(novel.genre);
      }
    });
    return ["الكل", ...Array.from(cats)];
  }, []);

  // Filter novels
  const filteredNovels = useMemo(() => {
    if (selectedCategory === "الكل") return novelsList;
    return novelsList.filter((novel: any) => novel.genre === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="relative min-h-screen bg-[#0f101a] pb-24">
      {/* Search overlay component */}
      <GlobalSearch />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">الخيمة</h2>
          
          <div className="relative">
            <button 
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="bg-[#2a2c3d] hover:bg-[#34364e] text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors border border-[#3a3c50]"
            >
              <span>{selectedCategory}</span>
              <span className="text-xs">▼</span>
            </button>

            {isCategoryOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-[#1a1c2a] border border-[#2b2d42] rounded-xl shadow-2xl z-50 overflow-hidden">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsCategoryOpen(false);
                    }}
                    className={`w-full text-right px-4 py-3 text-sm transition-colors hover:bg-[#2b2d42] ${selectedCategory === cat ? 'text-red-500 font-bold bg-[#2b2d42]/50' : 'text-gray-300'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredNovels.map((novel: any) => (
            <Link href={`/novel/${novel.id}`} key={novel.id} className="group bg-[#1a1b2a] border border-[#2b2d42] rounded-3xl overflow-hidden flex flex-col transition-all hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(220,38,38,0.15)] block relative">
              <div className="relative w-full aspect-[3/4] overflow-hidden">
                <img 
                  src={novel.cover || `https://placehold.co/300x400/181825/dc2626?text=${encodeURIComponent(novel.title)}`} 
                  alt={novel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full border border-white/10">
                  {novel.genre}
                </div>
              </div>
              <div className="p-3 text-center flex-1 flex flex-col justify-center">
                <h3 className="font-bold text-sm text-white line-clamp-1">{novel.title}</h3>
                <span className="text-[#8e8f9e] text-xs mt-1">{(novel as any).volumes ? (novel as any).volumes.flatMap((v:any)=>v.chapters).length : ((novel as any).chapters ? (novel as any).chapters.length : 0)} فصول</span>
              </div>
            </Link>
          ))}
          
          {filteredNovels.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500 border border-dashed border-[#2b2d42] rounded-3xl">
              لا توجد روايات في هذا التصنيف حالياً.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
