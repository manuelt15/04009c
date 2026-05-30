import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/mongoose";
import { Login } from "@/lib/models/login";
import { Admin } from "@/lib/models/admin";
import { requireAdmin } from "@/lib/auth/admin-guard";

export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const body = await req.json();
    const { type } = body;

    if (type === "gate_password") {
      const value = typeof body.value === "string" ? body.value.trim() : null;
      if (!value) return NextResponse.json({ error: "CONTRASEÑA INVÁLIDA" }, { status: 400 });
      await connectDB();
      const hash = await bcrypt.hash(value, 12);
      await Login.deleteMany({});
      await Login.create({ password: hash });
      return NextResponse.json({ ok: true });
    }

    if (type === "admin_credentials") {
      const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : null;
      const newUsername     = typeof body.newUsername     === "string" ? body.newUsername.trim() : null;
      const newPassword     = typeof body.newPassword     === "string" ? body.newPassword : null;

      if (!currentPassword || !newUsername || !newPassword) {
        return NextResponse.json({ error: "PARÁMETROS INVÁLIDOS" }, { status: 400 });
      }

      await connectDB();
      // Buscar solo por username desde el token (no por contraseña en query)
      const admin = await Admin.findOne({ username: newUsername }).select("+password") ?? await Admin.findOne({});
      if (!admin || !(await bcrypt.compare(currentPassword, admin.password))) {
        return NextResponse.json({ error: "CONTRASEÑA ACTUAL INCORRECTA" }, { status: 401 });
      }
      const newHash = await bcrypt.hash(newPassword, 12);
      await Admin.findByIdAndUpdate(admin._id, { username: newUsername, password: newHash });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "TIPO INVÁLIDO" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "ERROR DE SERVIDOR" }, { status: 500 });
  }
}
