import { Schema, model, models } from "mongoose";

export type OrderStatus = "pendiente" | "confirmado" | "enviado" | "entregado" | "cancelado";

export interface IOrderItem {
  productId: string;
  name: string;
  ref: string;
  price: number;
  quantity: number;
  size?: string;
}

export interface IStatusChange {
  status: OrderStatus;
  at: Date;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    city: string;
    phone?: string;
    address?: string;
    postalCode?: string;
    province?: string;
  };
  items: IOrderItem[];
  shippingMethod?: { label: string; price: number };
  total: number;
  status: OrderStatus;
  statusHistory: IStatusChange[];
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
      phone:      { type: String, default: "" },
      address:    { type: String, default: "" },
      postalCode: { type: String, default: "" },
      province:   { type: String, default: "" },
    },
    items:  { type: [Object], required: true },
    shippingMethod: { label: String, price: Number },
    total:  { type: Number, required: true },
    status: { type: String, enum: ["pendiente","confirmado","enviado","entregado","cancelado"], default: "pendiente" },
    statusHistory: {
      type: [{ _id: false, status: String, at: { type: Date, default: Date.now } }],
      default: [],
    },
  },
  { timestamps: true }
);

export const Order = models.Order || model<IOrder>("Order", OrderSchema);
