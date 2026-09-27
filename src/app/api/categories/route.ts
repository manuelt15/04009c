import { NextResponse } from "next/server";
import { getCategories } from "@/lib/store-config";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ categories: categories.map((c) => ({ name: c.name, sizeGuide: c.sizeGuide })) });
  } catch {
    return NextResponse.json({ error: "ERROR DE SERVIDOR" }, { status: 500 });
  }
}
