import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Category } from "@/lib/models/category";
import { Product } from "@/lib/models/product";
import { requireAdmin } from "@/lib/auth/admin-guard";
import { getCategories } from "@/lib/store-config";

const GUIDES = ["tops", "bottoms", "none"];
const RESERVED = ["TODO", "NUEVOS"]; // pestañas automáticas de la tienda

function cleanName(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const name = v.trim().toUpperCase();
  return name.length >= 2 && name.length <= 30 ? name : null;
}

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const categories = await getCategories();
    await connectDB();
    const counts = await Product.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]);
    const byName = new Map(counts.map((c) => [c._id as string, c.count as number]));
    return NextResponse.json({ categories: categories.map((c) => ({ ...c, products: byName.get(c.name) ?? 0 })) });
  } catch {
    return NextResponse.json({ error: "ERROR DE SERVIDOR" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const body = await req.json();
    const name = cleanName(body.name);
    const sizeGuide = GUIDES.includes(body.sizeGuide) ? body.sizeGuide : "tops";
    if (!name) return NextResponse.json({ error: "NOMBRE INVÁLIDO (2 A 30 CARACTERES)" }, { status: 400 });
    if (RESERVED.includes(name)) return NextResponse.json({ error: `${name} ES UNA PESTAÑA AUTOMÁTICA` }, { status: 400 });
    await connectDB();
    if (await Category.exists({ name })) return NextResponse.json({ error: "ESA CATEGORÍA YA EXISTE" }, { status: 409 });
    const last = await Category.findOne().sort({ order: -1 }).lean<{ order: number }>();
    const category = await Category.create({ name, sizeGuide, order: (last?.order ?? -1) + 1 });
    return NextResponse.json({ category }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "ERROR DE SERVIDOR" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const body = await req.json();
    if (typeof body.id !== "string") return NextResponse.json({ error: "ID INVÁLIDO" }, { status: 400 });
    await connectDB();
    const current = await Category.findById(body.id);
    if (!current) return NextResponse.json({ error: "CATEGORÍA NO ENCONTRADA" }, { status: 404 });

    // Mover arriba/abajo: intercambia el orden con la vecina
    if (body.move === "up" || body.move === "down") {
      const neighbour = await Category.findOne(
        body.move === "up" ? { order: { $lt: current.order } } : { order: { $gt: current.order } },
      ).sort({ order: body.move === "up" ? -1 : 1 });
      if (neighbour) {
        const o = current.order;
        current.order = neighbour.order;
        neighbour.order = o;
        await Promise.all([current.save(), neighbour.save()]);
      }
      return NextResponse.json({ ok: true });
    }

    if (body.sizeGuide !== undefined) {
      if (!GUIDES.includes(body.sizeGuide)) return NextResponse.json({ error: "GUÍA INVÁLIDA" }, { status: 400 });
      current.sizeGuide = body.sizeGuide;
    }
    if (body.name !== undefined) {
      const name = cleanName(body.name);
      if (!name) return NextResponse.json({ error: "NOMBRE INVÁLIDO (2 A 30 CARACTERES)" }, { status: 400 });
      if (RESERVED.includes(name)) return NextResponse.json({ error: `${name} ES UNA PESTAÑA AUTOMÁTICA` }, { status: 400 });
      if (name !== current.name) {
        if (await Category.exists({ name })) return NextResponse.json({ error: "ESA CATEGORÍA YA EXISTE" }, { status: 409 });
        // Los productos guardan el nombre: se renombran con ella
        await Product.updateMany({ category: current.name }, { category: name });
        current.name = name;
      }
    }
    await current.save();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "ERROR DE SERVIDOR" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const body = await req.json();
    if (typeof body.id !== "string") return NextResponse.json({ error: "ID INVÁLIDO" }, { status: 400 });
    await connectDB();
    const category = await Category.findById(body.id);
    if (!category) return NextResponse.json({ error: "CATEGORÍA NO ENCONTRADA" }, { status: 404 });
    const inUse = await Product.countDocuments({ category: category.name });
    if (inUse > 0) {
      return NextResponse.json({ error: `TIENE ${inUse} PRODUCTO${inUse > 1 ? "S" : ""}: MUÉVELOS ANTES DE BORRARLA` }, { status: 409 });
    }
    await category.deleteOne();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "ERROR DE SERVIDOR" }, { status: 500 });
  }
}
