import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Admin } from "@/lib/models/admin";
import { verifyAdminToken } from "@/lib/auth/jwt";
import { versionSesionVigente } from "@/lib/auth/session-version";

/**
 * Puerta de las rutas /api/admin. Además de la firma, comprueba que el token
 * sigue correspondiendo al contador actual del admin: si se cambiaron las
 * credenciales, las sesiones abiertas antes dejan de valer.
 */
export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.json({ error: "NO AUTORIZADO" }, { status: 401 });

  let payload;
  try {
    payload = await verifyAdminToken(token);
  } catch {
    return NextResponse.json({ error: "TOKEN INVÁLIDO" }, { status: 401 });
  }
  if (typeof payload.sub !== "string") {
    return NextResponse.json({ error: "TOKEN INVÁLIDO" }, { status: 401 });
  }

  try {
    await connectDB();
    const admin = await Admin.findById(payload.sub).select("tokenVersion").lean();
    if (!admin || !versionSesionVigente(payload.tv, admin.tokenVersion)) {
      return NextResponse.json({ error: "SESIÓN REVOCADA" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "ERROR DE SERVIDOR" }, { status: 500 });
  }

  return null;
}
