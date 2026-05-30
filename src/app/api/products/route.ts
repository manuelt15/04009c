import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Product } from "@/lib/models/product";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const query = category && category !== "ALL" ? { category } : {};
    const products = await Product.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "ERROR DE SERVIDOR" }, { status: 500 });
  }
}
