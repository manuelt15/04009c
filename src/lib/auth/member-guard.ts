import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Login } from "@/lib/models/login";
import { verifyMemberToken } from "@/lib/auth/jwt";
import { versionSesionVigente } from "@/lib/auth/session-version";

/**
 * Puerta de los datos del catálogo. El proxy solo mira la firma del token; aquí
 * se comprueba además que la sesión sigue correspondiendo al código de acceso
 * vigente, para que rotarlo retire el acceso a los miembros anteriores.
 */
export async function requireMemberSession(req: NextRequest): Promise<NextResponse | null> {
  const token = req.cookies.get("member_token")?.value;
  if (!token) return NextResponse.json({ error: "NO AUTORIZADO" }, { status: 401 });

  let payload;
  try {
    payload = await verifyMemberToken(token);
  } catch {
    return NextResponse.json({ error: "TOKEN INVÁLIDO" }, { status: 401 });
  }

  try {
    await connectDB();
    const entrada = await Login.findOne({}).select("tokenVersion").lean();
    if (!entrada || !versionSesionVigente(payload.tv, entrada.tokenVersion)) {
      return NextResponse.json({ error: "CÓDIGO ROTADO: VUELVE A ENTRAR" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "ERROR DE SERVIDOR" }, { status: 500 });
  }

  return null;
}
