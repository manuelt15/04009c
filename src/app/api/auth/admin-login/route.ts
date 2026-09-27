import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/mongoose";
import { Admin } from "@/lib/models/admin";
import { signAdminToken } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = typeof body.username === "string" ? body.username.trim() : null;
    const password = typeof body.password === "string" ? body.password : null;

    if (!username || !password) {
      return NextResponse.json({ error: "CREDENCIALES REQUERIDAS" }, { status: 400 });
    }

    await connectDB();
    // Buscar solo por username — nunca por password en la query
    const admin = await Admin.findOne({ username });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return NextResponse.json({ error: "CREDENCIALES INVÁLIDAS" }, { status: 401 });
    }

    const token = await signAdminToken(String(admin._id));
    const res = NextResponse.json({ ok: true });
    res.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "ERROR DE SERVIDOR" }, { status: 500 });
  }
}
