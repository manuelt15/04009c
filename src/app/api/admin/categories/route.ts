import { NextResponse } from "next/server";
import { DEMO_CATEGORIES } from "@/lib/demo-data";
import { escrituraBloqueada } from "@/lib/demo-api";

// Panel de prueba: solo lectura y con datos de ejemplo.
export async function GET() {
  return NextResponse.json({ categories: DEMO_CATEGORIES });
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
