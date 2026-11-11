import { NextResponse } from "next/server";

// El registro de suscriptores está cerrado mientras dure el parón de la tienda:
// /subscribe solo muestra el aviso de "próximamente". Este endpoint no lee el
// cuerpo, no escribe en la base y no envía correo.
export async function POST() {
  return NextResponse.json(
    { error: "EL REGISTRO DE SUSCRIPTORES ESTÁ CERRADO POR AHORA" },
    { status: 410 }
  );
}
