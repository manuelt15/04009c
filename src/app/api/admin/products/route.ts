import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Product } from "@/lib/models/product";
import { requireAdmin } from "@/lib/auth/admin-guard";

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "ERROR DE SERVIDOR" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const body = await req.json();
    await connectDB();
    const product = await Product.create(body);
    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "ERROR DE SERVIDOR" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const { id, ...data } = await req.json();
    if (typeof id !== "string") return NextResponse.json({ error: "ID INVÁLIDO" }, { status: 400 });
    await connectDB();
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "ERROR DE SERVIDOR" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const body = await req.json();
    const id = typeof body.id === "string" ? body.id : null;
    if (!id) return NextResponse.json({ error: "ID INVÁLIDO" }, { status: 400 });
    await connectDB();
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "ERROR DE SERVIDOR" }, { status: 500 });
  }
}
