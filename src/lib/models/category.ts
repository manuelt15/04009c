import { Schema, model, models } from "mongoose";

export type SizeGuideKind = "tops" | "bottoms" | "none";

export interface ICategory {
  _id: string;
  name: string;
  order: number;
  sizeGuide: SizeGuideKind; // qué tabla de medidas usa; "none" = talla única
}

const CategorySchema = new Schema<ICategory>({
  name:      { type: String, required: true, unique: true, trim: true, uppercase: true },
  order:     { type: Number, default: 0 },
  sizeGuide: { type: String, enum: ["tops", "bottoms", "none"], default: "tops" },
});

export const Category = models.Category || model<ICategory>("Category", CategorySchema);
