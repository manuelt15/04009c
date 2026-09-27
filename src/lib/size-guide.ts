import type { SizeGuideKind } from "@/lib/models/category";

export const SIZES = ["S", "M", "L", "XL"] as const;
export type Size = (typeof SIZES)[number];

export interface SizeGuide {
  columns: [string, string];
  rows: Record<Size, [number, number]>;
}

// Valores de partida (medidas ORIENTATIVAS de la prenda en plano, en cm). Se editan en el panel → AJUSTES
export const DEFAULT_SIZE_GUIDES: Record<Exclude<SizeGuideKind, "none">, SizeGuide> = {
  tops: {
    columns: ["PECHO", "LARGO"],
    rows: { S: [56, 70], M: [59, 72], L: [62, 74], XL: [65, 76] },
  },
  bottoms: {
    columns: ["CINTURA", "LARGO"],
    rows: { S: [38, 102], M: [40, 104], L: [42, 106], XL: [44, 108] },
  },
};
