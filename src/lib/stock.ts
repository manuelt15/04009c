import type { IProduct, ISizeStock } from "@/lib/models/product";

// Agotado: marcado a mano en el panel, o con control de stock y todas las tallas a 0
export function isSoldOut(p: Pick<IProduct, "soldOut" | "sizes">): boolean {
  const sizes = p.sizes ?? [];
  return p.soldOut || (sizes.length > 0 && sizes.every((s) => s.stock <= 0));
}

// Resumen para el panel: "S3 M0 L2 XL1", "ÚNICA 5" o "—" sin control de stock
export function stockSummary(sizes: ISizeStock[] = []): string {
  if (sizes.length === 0) return "—";
  return sizes.map((s) => `${s.size === "U" ? "ÚNICA " : s.size}${s.stock}`).join(" ");
}
