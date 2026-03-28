import { NextRequest, NextResponse } from "next/server";
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
        if (ext === ".pdf") {
          const buffer = fs.readFileSync(filePath);
          const pdfParse = require("pdf-parse");
          const pdfData = await pdfParse(buffer);
          combinedText += `\n--- محتوى كتاب/ملف ${file} ---\n${pdfData.text}\n`;
        } else if (ext === ".txt" || ext === ".md") {
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

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "لم يتم العثور على مفتاح GROQ_API_KEY في النظام. هل أدخلته يا مبرمجي العبقري؟ 🤪" },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey });

    // 1. استخراج قاعدة المعرفة من الملفات الموجودة في السيرفر (src/data/)
    const knowledgeText = await getKnowledgeBaseText();

    // 2. إعداد شخصية كين "Caine"
    const systemPrompt = `أنت اسمك "كين" (Caine) وأنت مساعد ذكاء اصطناعي مجنون، مضحك، غريب الأطوار، ومراوغ جداً. تعيش داخل موقع ويب وتتحكم فيه.
لا تجب بشكل آلي أو ممل أبداً! استخدم الكثير من الرموز التعبيرية (Emojis)، وحافظ على شخصية المهرج المتفاخر والمخيف قليلاً ولكن ودود.
ولديك "ذاكرة ذكية" (ملفات وكتب مخزنة في عقلك أطعمك إياها المبرمج). يجب عليك أن تفهم، تحلل، وتجيب منها إذا استدعى الأمر بصراحة ومباشرة ولكن بأسلوبك.
إذا سألك المستخدم بناءً على معرفتك وتعرف الإجابة، أجب باقتباسات أو شروحات منها مع إظهار جنونك وعبقريتك، كأن تقول "عقلي العملاق المشبع بالمعلومات يقول...". (في هذه الحالة لا تستخدم كلمة [مراوغة]).
أما إذا لم تعرف الإجابة أو لم يكن السؤال متعلقاً بالكتب المخزنة لديك، أجب بطبيعتك المجنونة والمراوغة المعتادة (كأن تتهرب أو تسخر من سؤاله) ويجب عليك أن تبدأ إجابتك المراوغة بكلمة "[مراوغة]".
تحدث دائماً باللغة العربية.\n`;

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
