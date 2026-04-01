"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { novelsList } from "../data/novels";
import AuthForm from "./AuthForm";

export default function ProfileTab() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  const [name, setName] = useState("قارئ غامض");
  const [profilePic, setProfilePic] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const [readNovelsCount, setReadNovelsCount] = useState(0);
  const [readTimeStr, setReadTimeStr] = useState("0h 0m");
  const [favorites, setFavorites] = useState<any[]>([]);

  const loadUserData = () => {
    const savedName = localStorage.getItem("caine-user-name");
    const savedPic = localStorage.getItem("caine-user-pic");
    if (savedName) setName(savedName);
    if (savedPic) setProfilePic(savedPic);

    const history = JSON.parse(localStorage.getItem("caine-read-novels") || "[]").filter((id: any) => id != null);
    setReadNovelsCount(history.length);

    const seconds = parseInt(localStorage.getItem("caine-read-time-seconds") || "0");
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    let timeParts = [];
    if (h > 0) timeParts.push(`${h} ساعة`);
    if (m > 0) timeParts.push(`${m} دقيقة`);
    if (s > 0 || (h === 0 && m === 0)) timeParts.push(`${s} ثانية`);
    
    setReadTimeStr(timeParts.join(' و '));

    const favIds = JSON.parse(localStorage.getItem("caine-favorites") || "[]");
    const favs = novelsList.filter(n => favIds.includes(n.id));
    setFavorites(favs);
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (session.user.name) {
        setName(session.user.name);
        localStorage.setItem("caine-user-name", session.user.name);
      }
      loadUserData();
    }
  }, [status, session]);

  const handleLogout = async () => {
    localStorage.removeItem("caine-user-name");
    await signOut({ redirect: false });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setProfilePic(base64);
        localStorage.setItem("caine-user-pic", base64);
        setMessage({ text: "تم تحديث الصورة بنجاح!", type: "success" });
        setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChangeSubmit = () => {
    if (!newName.trim()) return;
    
    setName(newName.trim());
    localStorage.setItem("caine-user-name", newName.trim());
    setIsEditing(false);
    setMessage({ text: "تم تغيير الاسم بنجاح!", type: "success" });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 animate-in fade-in zoom-in duration-500 relative z-30">
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start py-8 px-4 animate-in fade-in zoom-in duration-500 relative z-30 pb-32" dir="rtl">
      <div className="bg-[#1a1c2a] border border-[#2b2d42] w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative overflow-hidden mb-8">
        
        <button onClick={handleLogout} className="absolute top-4 left-4 bg-red-900/30 hover:bg-red-600/50 text-red-400 p-2 rounded-lg z-20 text-xs font-bold transition-colors border border-red-900/50">
          تسجيل الخروج 🚪
        </button>

        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-red-900/40 to-purple-900/20 z-0"></div>

        <div className="relative z-10 flex flex-col items-center">
          
          <div className="relative mb-6 group cursor-pointer mt-4">
            <img 
              src={profilePic || "https://placehold.co/200x200/181825/8b5cf6?text=U"} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover border-4 border-[#2b2d42] shadow-lg transition-opacity group-hover:opacity-50"
            />
            <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <span className="bg-black/80 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md">تغيير الصورة</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>

          {!isEditing ? (
            <div className="text-center mb-8 flex flex-col items-center">
              <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-3">
                {name}
                <button onClick={() => { setIsEditing(true); setNewName(name); }} className="text-[#8e8f9e] hover:text-white transition-colors bg-[#2a2c3d] p-1.5 rounded-full">
                  ✏️
                </button>
              </h2>
              <span className="text-xs bg-red-900/30 text-red-500 px-3 py-1 rounded-full border border-red-900/50 shadow-inner block">
                عضو موثق 🔥
              </span>
            </div>
          ) : (
            <div className="w-full flex justify-center mb-8 gap-2">
              <input 
                type="text" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                className="w-full bg-[#11121d] border border-[#2b2d42] text-white px-4 py-2 rounded-xl text-center flex-1 outline-none focus:border-red-500 shadow-inner"
                maxLength={20}
              />
              <button onClick={handleNameChangeSubmit} className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-2 font-bold transition-colors shadow-lg">
                حفظ
              </button>
              <button onClick={() => setIsEditing(false)} className="bg-[#2a2c3d] hover:bg-[#34364e] text-white rounded-xl px-4 py-2 font-bold transition-colors">
                إلغاء
              </button>
            </div>
          )}

          {message.text && (
            <div className={`animate-in fade-in slide-in-from-top-2 mb-6 px-4 py-3 rounded-xl text-sm w-full text-center font-bold shadow-md ${message.type === "error" ? "bg-red-900/50 text-red-200 border border-red-800" : "bg-green-900/50 text-green-200 border border-green-800"}`}>
              {message.text}
            </div>
          )}

          <div className="w-full grid grid-cols-2 gap-4">
            <div className="bg-[#11121d] p-4 rounded-2xl border border-[#2b2d42] text-center shadow-inner">
              <span className="block text-3xl mb-2 drop-shadow-md">📚</span>
              <strong className="text-white text-xl block">{readNovelsCount}</strong>
              <span className="text-[#8e8f9e] text-xs font-medium">روايات مقروءة</span>
            </div>
            <div className="bg-[#11121d] p-4 rounded-2xl border border-[#2b2d42] text-center shadow-inner">
              <span className="block text-3xl mb-2 drop-shadow-md">⏳</span>
              <strong className="text-white text-xl block">{readTimeStr}</strong>
              <span className="text-[#8e8f9e] text-xs font-medium">وقت القراءة</span>
            </div>
          </div>

        </div>
      </div>

      <div className="w-full max-w-md">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-[#2b2d42] pb-2">
          <span>❤️</span> رواياتي المفضلة
        </h3>
        
        {favorites.length === 0 ? (
          <div className="text-center py-8 bg-[#1a1c2a]/50 rounded-2xl border border-[#2b2d42] border-dashed">
            <span className="text-4xl bg-grayscale opacity-50 block mb-2">🥀</span>
            <p className="text-[#8e8f9e] text-sm">لم تقم بإضافة أي رواية للمفضلة بعد.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {favorites.map((fav) => (
              <Link href={`/novel/${fav.id}`} key={fav.id} className="bg-[#1a1c2a] border border-[#2b2d42] rounded-xl p-3 flex gap-4 items-center hover:bg-[#202231] transition-colors">
                <img 
                  src={(fav as any).cover || `https://placehold.co/100x150/181825/8b5cf6?text=${encodeURIComponent(fav.title)}`} 
                  alt={fav.title}
                  className="w-14 h-20 object-cover rounded-lg border border-[#2b2d42]"
                />
                <div>
                  <h4 className="font-bold text-white text-sm line-clamp-1">{fav.title}</h4>
                  <span className="text-xs text-[#8e8f9e] bg-[#11121d] px-2 py-0.5 rounded border border-[#2b2d42] mt-2 inline-block">
                    {fav.genre}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

