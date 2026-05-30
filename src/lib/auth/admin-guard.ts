import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_ADMIN!);

export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return NextResponse.json({ error: "NO AUTORIZADO" }, { status: 401 });
  try {
    await jwtVerify(token, ADMIN_SECRET);
    return null;
  } catch {
    return NextResponse.json({ error: "TOKEN INVÁLIDO" }, { status: 401 });
  }
}
