import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Product } from "@/lib/models/product";
import { NEW_WINDOW_MS } from "@/lib/new-products";
import { requireMemberSession } from "@/lib/auth/member-guard";

export async function GET(req: NextRequest) {
  const denied = await requireMemberSession(req);
  if (denied) return denied;

  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    // NUEVOS no es una categoría guardada: son los productos creados en los últimos 30 días
    const query =
      category === "NUEVOS"
        ? { createdAt: { $gte: new Date(Date.now() - NEW_WINDOW_MS) } }
        : category && category !== "TODO"
          ? { category }
          : {};
    const products = await Product.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "ERROR DE SERVIDOR" }, { status: 500 });
  }
}
