import Link from "next/link";
import { MoveRight } from "lucide-react";
import AuthForm from "@/components/AuthForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors mb-8" dir="rtl">
          <MoveRight className="w-5 h-5" /> العودة للصفحة الرئيسية
        </Link>
        
        <Suspense fallback={<div>Loading...</div>}><AuthForm /></Suspense>
      </div>
    </div>
  );
}
