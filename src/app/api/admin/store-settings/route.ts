import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { StoreSettings } from "@/lib/models/store-settings";
import { requireAdmin } from "@/lib/auth/admin-guard";
import { getStoreSettings } from "@/lib/store-config";
import { SIZES, type SizeGuide } from "@/lib/size-guide";
import type { ShippingMethod } from "@/lib/shipping";

function cleanShipping(v: unknown): ShippingMethod[] | null {
  if (!Array.isArray(v) || v.length === 0 || v.length > 6) return null;
  const out: ShippingMethod[] = [];
  for (const m of v) {
    const label = typeof m?.label === "string" ? m.label.trim().toUpperCase() : "";
    const detail = typeof m?.detail === "string" ? m.detail.trim().toUpperCase() : "";
    const price = Number(m?.price);
    if (!label || !Number.isFinite(price) || price < 0) return null;
    out.push({ id: typeof m?.id === "string" && m.id ? m.id : label.toLowerCase().replace(/\s+/g, "-"), label, detail, price: Math.round(price * 100) / 100 });
  }
  return out;
}

function cleanGuide(v: unknown): SizeGuide | null {
  const g = v as SizeGuide | undefined;
  if (!g || !Array.isArray(g.columns) || g.columns.length !== 2) return null;
  const columns = g.columns.map((c) => String(c ?? "").trim().toUpperCase()) as [string, string];
  if (columns.some((c) => !c)) return null;
  const rows = {} as SizeGuide["rows"];
  for (const s of SIZES) {
    const r = g.rows?.[s];
    const a = Number(r?.[0]), b = Number(r?.[1]);
    if (!Number.isFinite(a) || !Number.isFinite(b) || a <= 0 || b <= 0) return null;
    rows[s] = [a, b];
  }
  return { columns, rows };
}

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    return NextResponse.json(await getStoreSettings());
  } catch {
    return NextResponse.json({ error: "ERROR DE SERVIDOR" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  try {
    const body = await req.json();
    const update: Record<string, unknown> = {};
    if (body.shipping !== undefined) {
      const shipping = cleanShipping(body.shipping);
      if (!shipping) return NextResponse.json({ error: "ENVÍOS INVÁLIDOS: NOMBRE Y PRECIO OBLIGATORIOS" }, { status: 400 });
      update.shipping = shipping;
    }
    if (body.sizeGuides !== undefined) {
      const tops = cleanGuide(body.sizeGuides?.tops);
      const bottoms = cleanGuide(body.sizeGuides?.bottoms);
      if (!tops || !bottoms) return NextResponse.json({ error: "MEDIDAS INVÁLIDAS: TODAS DEBEN SER NÚMEROS MAYORES QUE 0" }, { status: 400 });
      update.sizeGuides = { tops, bottoms };
    }
    if (Object.keys(update).length === 0) return NextResponse.json({ error: "NADA QUE GUARDAR" }, { status: 400 });
    await getStoreSettings(); // asegura que el documento existe
    await connectDB();
    await StoreSettings.updateOne({ key: "main" }, { $set: update });
    return NextResponse.json(await getStoreSettings());
  } catch {
    return NextResponse.json({ error: "ERROR DE SERVIDOR" }, { status: 500 });
  }
}
