import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const MEMBER_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_MEMBER!);
const ADMIN_SECRET  = new TextEncoder().encode(process.env.JWT_SECRET_ADMIN!);

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // El catálogo (páginas y /api/products) solo con la sesión de miembro que da la clave de acceso
  const isMemberApi = pathname.startsWith("/api/products");
  if (pathname.startsWith("/store") || isMemberApi) {
    const token = req.cookies.get("member_token")?.value;
    const denied = () =>
      isMemberApi
        ? NextResponse.json({ error: "NO AUTORIZADO" }, { status: 401 })
        : NextResponse.redirect(new URL("/", req.url));
    if (!token) return denied();
    try {
      await jwtVerify(token, MEMBER_SECRET);
      return NextResponse.next();
    } catch {
      return denied();
    }
  }

  const isAdminLogin = pathname === "/admin/login" || pathname === "/api/auth/admin-login";
  if ((pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) && !isAdminLogin) {
    const token = req.cookies.get("admin_token")?.value;
    if (!token) {
      if (pathname.startsWith("/api/")) return NextResponse.json({ error: "NO AUTORIZADO" }, { status: 401 });
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    try {
      await jwtVerify(token, ADMIN_SECRET);
      return NextResponse.next();
    } catch {
      if (pathname.startsWith("/api/")) return NextResponse.json({ error: "TOKEN INVÁLIDO" }, { status: 401 });
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/store/:path*", "/api/products/:path*", "/admin/:path*", "/api/admin/:path*"],
};
