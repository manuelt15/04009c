import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/mongoose";
import { Login } from "@/lib/models/login";
import { Admin } from "@/lib/models/admin";
import { requireAdmin } from "@/lib/auth/admin-guard";
import { verifyAdminToken, signAdminToken } from "@/lib/auth/jwt";

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
      // El contador se incrementa al rotar: los tokens de miembro ya emitidos
      // llevan la versión anterior y dejan de valer en la guarda de sesión.
      const previa = await Login.findOne({}).select("tokenVersion").lean();
      const version = (previa?.tokenVersion ?? 0) + 1;
      const hash = await bcrypt.hash(value, 12);
      await Login.deleteMany({});
      await Login.create({ password: hash, tokenVersion: version });
      return NextResponse.json({ ok: true });
    }

    if (type === "admin_credentials") {
      const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : null;
      const newUsername     = typeof body.newUsername     === "string" ? body.newUsername.trim() : null;
      const newPassword     = typeof body.newPassword     === "string" ? body.newPassword : null;

      if (!currentPassword || !newUsername || !newPassword) {
        return NextResponse.json({ error: "PARÁMETROS INVÁLIDOS" }, { status: 400 });
      }

      // El admin es el de la sesión (id en el token), no el que coincida con el usuario nuevo
      const { sub } = await verifyAdminToken(req.cookies.get("admin_token")?.value ?? "");
      if (!sub) return NextResponse.json({ error: "SESIÓN ANTIGUA: VUELVE A INICIAR SESIÓN" }, { status: 401 });
      await connectDB();
      const admin = await Admin.findById(sub).select("+password");
      if (!admin || !(await bcrypt.compare(currentPassword, admin.password))) {
        return NextResponse.json({ error: "CONTRASEÑA ACTUAL INCORRECTA" }, { status: 401 });
      }
      if (newUsername !== admin.username && (await Admin.exists({ username: newUsername }))) {
        return NextResponse.json({ error: "ESE USUARIO YA EXISTE" }, { status: 409 });
      }
      const newHash = await bcrypt.hash(newPassword, 12);
      // Incrementar el contador invalida cualquier otra sesión admin abierta.
      const version = (admin.tokenVersion ?? 0) + 1;
      await Admin.findByIdAndUpdate(admin._id, {
        username: newUsername,
        password: newHash,
        tokenVersion: version,
      });

      // La sesión que hace el cambio recibe un token con la versión nueva para
      // no quedarse fuera en el mismo acto.
      const res = NextResponse.json({ ok: true });
      res.cookies.set("admin_token", await signAdminToken(String(admin._id), version), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 8,
        path: "/",
      });
      return res;
    }

    return NextResponse.json({ error: "TIPO INVÁLIDO" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "ERROR DE SERVIDOR" }, { status: 500 });
  }
}
