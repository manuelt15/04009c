import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Order } from "@/lib/models/order";
import { requireAdmin } from "@/lib/auth/admin-guard";

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "ERROR DE SERVIDOR" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const body = await req.json();
    const id     = typeof body.id     === "string" ? body.id     : null;
    const status = typeof body.status === "string" ? body.status : null;
    if (!id || !status) return NextResponse.json({ error: "PARÁMETROS INVÁLIDOS" }, { status: 400 });
    await connectDB();
    await Order.findByIdAndUpdate(id, { status });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "ERROR DE SERVIDOR" }, { status: 500 });
  }
}
