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

// Los registros son de un formulario cerrado: si alguno quedó guardado, caduca solo.
SubscriberSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 180 });

export const Subscriber = models.Subscriber || model<ISubscriber>("Subscriber", SubscriberSchema);
