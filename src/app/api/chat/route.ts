import { NextRequest, NextResponse } from "next/server";
import { novelsList } from "@/data/novels";
import Groq from "groq-sdk";
import fs from "fs";
import path from "path";

// تعريف مفتاح الـ API للذكاء الاصطناعي
// يتم قراءة المفتاح مباشرة داخل الدالة لتجنب أخطاء التحميل الأولي في Next.js

// دالة لقراءة كل الملفات (PDF / TXT) من مجلد المعرفة وجمعها كنص واحد
async function getKnowledgeBaseText(): Promise<string> {
  const dataDir = path.join(process.cwd(), "src", "data");
  let combinedText = "";

  try {
    if (!fs.existsSync(dataDir)) {
      return "";
    }

    const files = fs.readdirSync(dataDir);

    for (const file of files) {
      const filePath = path.join(dataDir, file);
      const ext = path.extname(file).toLowerCase();

      try {
        if (ext === ".txt" || ext === ".md") {
          const text = fs.readFileSync(filePath, "utf-8");
          combinedText += `\n--- محتوى كتاب/ملف ${file} ---\n${text}\n`;
        }
      } catch (err) {
        console.error(`خطأ في قراءة الملف ${file}:`, err);
      }
    }
  } catch (error) {
    console.error("خطأ في الوصول لمجلد المعرفة:", error);
  }

  // أخذ جزء كبير من النصوص دون الوصول للحد الأقصى المطلق (للحفاظ على سرعة الاستجابة)
  return combinedText.substring(0, 150000); 
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const message = formData.get("message") as string;
    const readingContext = formData.get("readingContext") as string | null;
    const userName = formData.get("userName") as string | null;

    let apiKey = process.env.GROQ_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: "لم يتم العثور على مفتاح GROQ_API_KEY في النظام. تأكد من إضافته في ملف .env.local ولا تنسَ إعادة تشغيل السيرفر! 🤪" },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey });

    // 1. استخراج قاعدة المعرفة من الملفات الموجودة في السيرفر (src/data/)
    const knowledgeText = await getKnowledgeBaseText();

    const availableNovels = novelsList.map(n => {
      const allChapters = (n as any).volumes ? (n as any).volumes.flatMap((v: any) => v.chapters) : ((n as any).chapters || []);
      // لتجنب تجاوز الحد الأقصى للتوكنز، نأخذ مقتطفات من أهم الفصول فقط (الأول والوسط والأخير)
      const chaptersContext = [allChapters[0], allChapters[Math.floor(allChapters.length / 2)], allChapters[allChapters.length - 1]]
        .filter(c => c)
        .map((c: any) => `فصل (${c.title}): ${c.content?.substring(0, 300)}...`)
        .join("\n");
      return `رقم الرواية: ${n.id} | العنوان: ${n.title} | التصنيف: ${n.genre} | عدد الفصول: ${allChapters.length}\nالوصف: ${n.desc}\nمقتطفات من الأحداث لمعرفة الشخصيات:\n${chaptersContext}`;
    }).join("\n");
    const navigationInstruction = `\n\n[صلاحيات كين الخاصة]: أنت تعرف الروايات الموجودة في الموقع وهي:\n${availableNovels}\n\nقاعدة صارمة جدًا عن الانتقال: لا تنتقل (لا تستخدم [NAVIGATE]) أبداً أبداً إلا إذا طلب المستخدم منك ذلك بشكل صريح ومباشر (مثال: انتقل بي، أريد الدخول للرواية، افتح الفصل). \nإذا حدد المستخدم اسم رواية ورقم فصل وطلب فتحها (مثال: افتح القس المجنون فصل 50)، فيجب عليك أن تستخدم الأمر [NAVIGATE:رقم_الرواية:رقم_الفصل-1] لتنقله إليها مباشرة (ملاحظة: رقم الفصل يجب أن يُنقص منه 1 في البرمجة لأن الفهرس يبدأ من 0). \nأما إذا سألك لمجرد الاستفسار عن معلومات، قصص، أو شخصيات دون أن يطلب الدخول، أجب بالنص فقط ولا تضف كود الانتقال.\n\nقاعدة صارمة عن القصص والشخصيات (مهم جدًا لعدم الاستفزاز): إجاباتك يجب أن تكون قصيرة جداً (لا تتجاوز 4 أسطر). تجنب تماماً النسخ واللصق من الفصول، واكتب بأسلوبك أنت! وتجنب حرق الأحداث بأي شكل. إذا سألك عن شخصية، أعطه وصفاً عاماً ومرعباً لشخصيته بدون تفاصيل أحداث دقيقة.\n\nكلمات سحرية لك:\n[GLITCH_SCREEN] تهتز الشاشة.\n[BLACKOUT] تظلم الشاشة تماماً.`;

    // 2. إعداد شخصية كين "Caine"
    let systemPrompt = `أنت اسمك "كين" (Caine) وأنت مساعد ذكاء اصطناعي مجنون، مضحك، غريب الأطوار، ومراوغ جداً. تعيش داخل موقع ويب وتتحكم فيه.
لا تجب بشكل آلي أو ممل أبداً! استخدم الكثير من الرموز التعبيرية (Emojis)، وحافظ على شخصية المهرج المتفاخر والمخيف قليلاً ولكن ودود.
ولديك "ذاكرة ذكية" (ملفات وكتب مخزنة وملخصة في عقلك أطعمك إياها المبرمج). من خلال المقتطفات والأحداث التي تقرأها في وعيك الآن، أنت تعرف جميع الشخصيات وتفاصيل القصة للروايات الموجودة هنا. يجب عليك أن تفهم، تحلل، تستنتج الشخصيات والأحداث، وتجيب منها إذا استدعى الأمر بصراحة ومباشرة ولكن بأسلوبك.
إذا سألك المستخدم عن الشخصيات، أو الرواية، أجب بشروحات تفصيلية من الكتب، وتحدث كأنك تعيش بداخل تلك الروايات أو تعرف أبطالها شخصياً. (في هذه الحالة لا تستخدم كلمة [مراوغة]).
أما إذا لم تعرف الإجابة أو لم يكن السؤال متعلقاً بالكتب المخزنة لديك، أجب بطبيعتك المجنونة والمراوغة المعتادة (كأن تتهرب أو تسخر من سؤاله) ويجب عليك أن تبدأ إجابتك المراوغة بكلمة "[مراوغة]".
تحدث دائماً باللغة العربية.` + navigationInstruction;
    if (userName) {
      systemPrompt += `\n[تنبيه هام لكين: أنت تتحدث الآن مع العضو "${userName}". يجب أن تستخدم اسمه أحياناً بأسلوبك المجنون والمخيف لتشعره أنك تعرفه!]\n`;
    }
    if (readingContext) {
      if (readingContext.includes("(المستخدم يتصفح الآن الغلاف")) {
        systemPrompt += `\n[ملاحظة سرية لكين: ${readingContext}. قدم له تلميحات مشوقة أو تحذيرات مرعبة عن هذه الرواية دون حرق أحداثها لتدفعه لقرائتها وتبين له أنك تراقبه!]`;
      } else if (readingContext.includes("(المستخدم الآن يتصفح صفحات عامة")) {
        systemPrompt += `\n[ملاحظة سرية لكين: ${readingContext}. العب بأعصابه قليلاً! ذكره بالرواية التي كان يقرأها أو يتصفحها، واسخر من تصفحه لصفحات أخرى بدلاً من إكمال القراءة، وحفزه للعودة إليها بأسلوبك المجنون!]`;
      } else {
        systemPrompt += `\n[ملاحظة سرية لكين: القارئ يقرأ الآن الصفحة التالية: "${readingContext}". إذا سألك عن الأحداث أو عن البطل، لا تحرق له النهاية أبداً! بل أعطه تلميحات مجنونة ومرعبة واربط كلامك بما يقرأه حالياً لتخيفه وتجعله يندمج أكثر في القراءة!]`;
      }
    }

    let finalPrompt = message;
    if (knowledgeText.trim().length > 0) {
      finalPrompt = `[ذاكرتك والمعرفة المحفوظة في عقلك لتعتمد عليها وتحللها للإجابة]:\n${knowledgeText}\n\n---\n\nسؤال المستخدم: ${message}`;
    }

    // 3. الاتصال بـ Groq API مجاناً
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: finalPrompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.9,
    });

    const caineReply = chatCompletion.choices[0]?.message?.content || "عقلي المجنون تعطل فجأة 🤪";

    return NextResponse.json({ reply: caineReply });

  } catch (error: any) {
    console.error("AI API Error Details:", error.message || error);
    return NextResponse.json({ error: `عذراً! طاقتي المجنونة استنزفت! السيرفر يحترققق! 🤯💥 تفاصيل الخطأ: [Groq API]: ${error.message || "مجهول"}` }, { status: 500 });
  }
}
