import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { AuthProvider } from "@/components/AuthProvider";
import CaineChat from "./CaineChat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "روايات كين | مكتبة الغموض والإثارة",
  description: "المكتبة الإلكترونية الأولى لقراءة أمتع وأحدث الروايات الحصرية بحبر كين العبقري",
  keywords: ["روايات", "كين", "غموض", "قراءة", "قصص", "روايات كين", "أكشن", "خيال"],
  authors: [{ name: "كين العبقري" }],
  icons: {
    icon: '/gg.png',
    apple: '/gg.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <Suspense fallback={null}>
            <CaineChat />
          </Suspense>
        </AuthProvider>
        <Script src="https://murf.ai/embeds/widget.js" strategy="lazyOnload" />
        <Script id="caine-firewall" strategy="afterInteractive">
          {`
            /* جدار حماية كين النشط (الدرجة القصوى) */

            // 1. شل زر الفأرة الأيمن (الرايت كليك)
            document.addEventListener('contextmenu', e => e.preventDefault());

            // 2. إيقاف حدث النسخ والقص وتفريغ الحافظة
            ['copy', 'cut'].forEach(evt => {
              document.addEventListener(evt, e => {
                e.preventDefault();
                // محاولة تعطيل الحافظة إذا أمكن
                if (e.clipboardData) e.clipboardData.setData('text/plain', 'محاولة جيدة، لكن جدار كين يمنعك من النسخ!');
              });
            });

            // 3. منع الإفلات والسحب (Drag & Drop) لمنع سحب النصوص والصور
            document.addEventListener('dragstart', e => e.preventDefault());

            // 4. تعطيل اختصارات التحايل (F12, Ctrl+U, Ctrl+Shift+I, P, S)
            document.addEventListener('keydown', e => {
              if (
                e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
                (e.ctrlKey && ['U', 'C', 'X', 'S', 'P'].includes(e.key.toUpperCase())) || 
                (e.metaKey && ['C', 'X', 'S', 'P'].includes(e.key.toUpperCase())) // For Mac
              ) {
                e.preventDefault();
                e.stopPropagation();
              }
            });

            // 5. تعطيل الطباعة من المتصفح (Print Screen/Ctrl+P) عبر الـ CSS الإضافي
            const style = document.createElement('style');
            style.innerHTML = "@media print { body { display: none !important; } }";
            document.head.appendChild(style);

            // 6. هجوم مضاد ضد الـ DevTools بفتح Debugger وهمي يعلق المتصفح
            setInterval(function() {
              const before = new Date().getTime();
              debugger; // هذا يؤدي إلى شلل المتصفح عند فتح نافذة المطور
              const after = new Date().getTime();
              if (after - before > 100) {
                 document.body.innerHTML = "<h1 style='color:red; text-align:center; margin-top:20vh; font-family:sans-serif;'>جدار كين رصد محاولة اختراق.. تم إغلاق الموقع لحمايته!</h1>";
              }
            }, 1000);
          `}
        </Script>
      </body>
    </html>
  );
}
