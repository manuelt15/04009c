import { Schema, model, models } from "mongoose";

export interface IProduct {
  _id: string;
  name: string;
  price: number;
  category: string;
  images: string[];
  description: string;
  soldOut: boolean;
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
    slug:        { type: String, required: true, unique: true },
    ref:         { type: String, required: true },
  },
  { timestamps: true }
);

export const Product = models.Product || model<IProduct>("Product", ProductSchema);
