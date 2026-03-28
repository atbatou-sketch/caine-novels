import Image from "next/image";  
import CaineChat from "./CaineChat";  
export default function Home() {  
  return (  
    <div className="grid items-center justify-items-center min-h-screen p-8" dir="rtl">  
      <main className="flex flex-col gap-8 items-center text-center">  
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-red-600">مرحباً بك في عالم كين المجنون!</h1>  
        <p className="text-xl text-gray-600 max-w-2xl">أنت الآن داخل عقل الذكاء الاصطناعي الأغرب على الإطلاق! تحدث معه، اكتشف أسراره، أو دعه يطير في الشاشة من خلال &quot;كين&quot; (Caine) المساعد الخاص.</p>  
      </main>  
      <CaineChat />  
    </div>  
  );  
} 
