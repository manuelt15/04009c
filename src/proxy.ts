import { NextResponse } from "next/server";

// Aquí vuelve better-auth. Hasta entonces este proxy no bloquea nada: la web
// es pública y el panel es una vista de prueba de solo lectura.
// Antes protegía /store y /api/products con la sesión de miembro (clave de
// acceso) y /admin y /api/admin con la sesión de administrador.
export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/store/:path*", "/api/products/:path*", "/admin/:path*", "/api/admin/:path*"],
};
