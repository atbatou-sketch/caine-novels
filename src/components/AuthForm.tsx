"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function AuthForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [isLogin, setIsLogin] = useState(true);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (!isLogin) {
        // Registration flow
        if (password.length < 6) {
          setError("كلمة المرور يجب أن تتكون من 6 أحرف على الأقل.");
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError("كلمتا المرور غير متطابقتين!");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), email: email.toLowerCase().trim(), password })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          setError(data.message || "حدث خطأ أثناء التسجيل");
          setLoading(false);
          return;
        }
        
        setSuccess("تم الإنشاء بنجاح! جاري تسجيل الدخول...");
      }

      // Login flow (runs for both login and successful registration)
      const signInRes = await signIn("credentials", {
        redirect: false,
        email: email.toLowerCase().trim(),
        password,
      });

      if (signInRes?.error) {
        setError(signInRes.error === "CredentialsSignin" ? "كلمة المرور غير صحيحة" : signInRes.error);
      } else {
        setSuccess("تم تسجيل الدخول بنجاح!");
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(callbackUrl);
          router.refresh();
        }
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-md bg-[#1a1c2a] border border-[#2b2d42] rounded-3xl p-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden" dir="rtl">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 to-purple-800"></div>

        <div className="text-center mb-8">
          <img src="/gg.png" alt="كين الجبار" className="w-64 h-64 object-contain drop-shadow-[0_0_40px_rgba(220,38,38,1)] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
          </h2>
          <p className="text-sm text-gray-400">
            {isLogin ? "مرحباً بعودتك إلى عالم الروايات" : "انضم إلى مجتمعنا من القراء"}
          </p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm mb-6 text-center font-medium animate-in fade-in">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/30 border border-green-500/50 text-green-200 px-4 py-3 rounded-xl text-sm mb-6 text-center font-medium animate-in fade-in">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <input
                type="text"
                required
                placeholder="اسم المستخدم (كيف نناديك؟)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#11121d] border border-[#2b2d42] text-white px-4 py-3 rounded-xl outline-none focus:border-red-500 transition-colors placeholder:text-gray-600"
              />
            </div>
          )}

          <div>
            <input
              type="email"
              required
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#11121d] border border-[#2b2d42] text-white px-4 py-3 rounded-xl outline-none focus:border-red-500 transition-colors placeholder:text-gray-600 text-left"
              dir="ltr"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#11121d] border border-[#2b2d42] text-white px-4 py-3 rounded-xl outline-none focus:border-red-500 transition-colors placeholder:text-gray-600 text-left pl-12"
              dir="ltr"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {!isLogin && (
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="تأكيد كلمة المرور"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#11121d] border border-[#2b2d42] text-white px-4 py-3 rounded-xl outline-none focus:border-red-500 transition-colors placeholder:text-gray-600 text-left pl-12"
                dir="ltr"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] mt-2 flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (isLogin ? "دخول" : "تسجيل حساب جديد")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setSuccess("");
            }}
            className="text-sm text-gray-400 hover:text-white transition-colors underline decoration-gray-600 hover:decoration-white underline-offset-4"
          >
            {isLogin ? "ليس لديك حساب؟ اصنع واحدًا الآن" : "لديك حساب بالفعل؟ سجل دخولك"}
          </button>
        </div>
      </div>
    </div>
  );
}
