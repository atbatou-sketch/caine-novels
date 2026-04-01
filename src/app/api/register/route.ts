import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    let { name, email, password } = await req.json();
    email = email.toLowerCase().trim();
    if(name) name = name.trim();

    if (!email || !password) {
      return NextResponse.json({ message: "البريد الإلكتروني وكلمة المرور مطلوبان" }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { email } });

    if (exists) {
      return NextResponse.json({ message: "هذا الحساب موجود مسبقاً" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "تم إنشاء الحساب بنجاح!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "حدث خطأ أثناء الإنشاء" }, { status: 500 });
  }
}

