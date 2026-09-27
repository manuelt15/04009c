import { NextResponse } from "next/server";
import { getStoreSettings } from "@/lib/store-config";

// Solo lectura y sin datos sensibles: envíos y guías de medidas para la tienda
export async function GET() {
  try {
    return NextResponse.json(await getStoreSettings());
  } catch {
    return NextResponse.json({ error: "ERROR DE SERVIDOR" }, { status: 500 });
  }
}
