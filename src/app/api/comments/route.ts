import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// الحصول على تعليقات رواية معينة (متاح للجميع)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const novelId = searchParams.get("novelId");

  if (!novelId) {
    return NextResponse.json({ message: "novelId is required" }, { status: 400 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { novelId },
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "حدث خطأ في جلب التعليقات" }, { status: 500 });
  }
}

// إضافة تعليق (يجب أن يكون مسجل دخول)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ message: "يجب تسجيل الدخول لإضافة تعليق!" }, { status: 401 });
  }

  try {
    const { novelId, text } = await req.json();

    if (!novelId || !text) {
      return NextResponse.json({ message: "النص مطلوب" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        novelId,
        userId: (session.user as any).id,
      },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "فشل إضافة التعليق" }, { status: 500 });
  }
}
