import { NextResponse } from "next/server";
import { escrituraBloqueada } from "@/lib/demo-api";

// Vista de prueba: la clave de acceso y las credenciales ya no se cambian aquí.
// Volverán con better-auth.
export async function GET() {
  return NextResponse.json({
    gatePassword: null,
    adminCredentials: null,
    demo: true,
    note: "AJUSTES DE EJEMPLO: NINGUNA CONTRASEÑA SE CAMBIA EN ESTA MAQUETA. LA AUTENTICACIÓN VUELVE CON BETTER-AUTH.",
  });
}

export async function POST() {
  return escrituraBloqueada();
}

export async function PATCH() {
  return escrituraBloqueada();
}

export async function PUT() {
  return escrituraBloqueada();
}

export async function DELETE() {
  return escrituraBloqueada();
}
