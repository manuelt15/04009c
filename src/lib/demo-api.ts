import { NextResponse } from "next/server";

/**
 * Respuesta única para cualquier escritura en /api/admin/*.
 * En el panel de prueba no se puede modificar nada: aunque se llame a la API
 * con la consola abierta, la escritura se rechaza.
 */
export function escrituraBloqueada() {
  return NextResponse.json(
    { error: "VISTA DE PRUEBA: SOLO LECTURA. NO SE PUEDE MODIFICAR NADA." },
    { status: 405, headers: { Allow: "GET" } },
  );
}
