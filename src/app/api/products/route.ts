import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Product } from "@/lib/models/product";
import { NEW_WINDOW_MS } from "@/lib/new-products";

// La web es pública: el catálogo ya no pide sesión de miembro.
// La autenticación vuelve con better-auth.
export async function GET(req: NextRequest) {
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
