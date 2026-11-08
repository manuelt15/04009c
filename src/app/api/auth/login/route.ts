import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/mongoose";
import { Login } from "@/lib/models/login";
import { signMemberToken } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const password = typeof body.password === "string" ? body.password.trim() : null;

    if (!password) {
      return NextResponse.json({ error: "CÓDIGO REQUERIDO" }, { status: 400 });
    }

    await connectDB();
    const entry = await Login.findOne({});
    if (!entry || !(await bcrypt.compare(password, entry.password))) {
      return NextResponse.json({ error: "CÓDIGO INVÁLIDO" }, { status: 401 });
    }

    const token = await signMemberToken(entry.tokenVersion ?? 0);
    const res = NextResponse.json({ ok: true });
    res.cookies.set("member_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "ERROR DE SERVIDOR" }, { status: 500 });
  }
}
