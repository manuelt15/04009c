import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Product } from "@/lib/models/product";
import { requireAdmin } from "@/lib/auth/admin-guard";

const SIZE_KEYS = ["S", "M", "L", "XL", "U"];

// Normaliza el stock que llega del panel: tallas válidas, sin repetir, enteros >= 0
function cleanSizes(v: unknown): { size: string; stock: number }[] {
  if (!Array.isArray(v)) return [];
  const seen = new Set<string>();
  return v.flatMap((s) => {
    const size = typeof s?.size === "string" ? s.size : "";
    if (!SIZE_KEYS.includes(size) || seen.has(size)) return [];
    seen.add(size);
    return [{ size, stock: Math.max(0, Math.floor(Number(s?.stock) || 0)) }];
  });
}

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
    const product = await Product.create({ ...body, sizes: cleanSizes(body.sizes) });
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
    if (data.sizes !== undefined) data.sizes = cleanSizes(data.sizes);
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
