import { Schema, model, models } from "mongoose";

export type OrderStatus = "pendiente" | "confirmado" | "enviado" | "entregado" | "cancelado";

export interface IOrderItem {
  productId: string;
  name: string;
  ref: string;
  price: number;
  quantity: number;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    city: string;
  };
  items: IOrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      name:  { type: String, required: true },
      email: { type: String, required: true },
      city:  { type: String, default: "" },
    },
    items:  { type: [Object], required: true },
    total:  { type: Number, required: true },
    status: { type: String, enum: ["pendiente","confirmado","enviado","entregado","cancelado"], default: "pendiente" },
  },
  { timestamps: true }
);

export const Order = models.Order || model<IOrder>("Order", OrderSchema);
