import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const MEMBER_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_MEMBER!);
const ADMIN_SECRET  = new TextEncoder().encode(process.env.JWT_SECRET_ADMIN!);

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/store") || pathname.startsWith("/api/store")) {
    const token = req.cookies.get("member_token")?.value;
    if (!token) return NextResponse.redirect(new URL("/", req.url));
    try {
      await jwtVerify(token, MEMBER_SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/", req.url));
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
  matcher: ["/store/:path*", "/admin/:path*", "/api/admin/:path*"],
};
