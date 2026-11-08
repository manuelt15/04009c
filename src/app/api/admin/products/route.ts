import { NextResponse } from "next/server";
import { DEMO_PRODUCTS } from "@/lib/demo-data";
import { escrituraBloqueada } from "@/lib/demo-api";

// Panel de prueba: solo lectura y con datos de ejemplo.
export async function GET() {
  return NextResponse.json({ products: DEMO_PRODUCTS });
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
