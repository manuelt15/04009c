import { Schema, model, models } from "mongoose";

export interface ISubscriber {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  city: string;
  createdAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    name:   { type: String, required: true },
    email:  { type: String, required: true, unique: true },
    mobile: { type: String, default: "" },
    city:   { type: String, default: "" },
  },
  { timestamps: true }
);

export const Subscriber = models.Subscriber || model<ISubscriber>("Subscriber", SubscriberSchema);
