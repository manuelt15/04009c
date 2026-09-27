import { Schema, model, models } from "mongoose";

export type SizeKey = "S" | "M" | "L" | "XL" | "U"; // U = talla única

export interface ISizeStock {
  size: SizeKey;
  stock: number;
}

export interface IProduct {
  _id: string;
  name: string;
  price: number;
  category: string;
  images: string[];
  description: string;
  soldOut: boolean;
  sizes: ISizeStock[]; // vacío = sin control de stock: todas las tallas disponibles
  slug: string;
  ref: string;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name:        { type: String, required: true },
    price:       { type: Number, required: true },
    category:    { type: String, required: true },
    images:      { type: [String], default: [] },
    description: { type: String, default: "" },
    soldOut:     { type: Boolean, default: false },
    sizes: {
      type: [{
        _id: false,
        size:  { type: String, enum: ["S", "M", "L", "XL", "U"], required: true },
        stock: { type: Number, min: 0, default: 0 },
      }],
      default: [],
    },
    slug:        { type: String, required: true, unique: true },
    ref:         { type: String, required: true },
  },
  { timestamps: true }
);

export const Product = models.Product || model<IProduct>("Product", ProductSchema);
