import { NextResponse } from "next/server";
import { DEMO_ORDERS } from "@/lib/demo-data";
import { escrituraBloqueada } from "@/lib/demo-api";

// Panel de prueba: solo lectura y con datos de ejemplo.
export async function GET() {
  return NextResponse.json({ orders: DEMO_ORDERS });
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
