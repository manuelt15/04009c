import mongoose, { Schema, model, models } from "mongoose";

export interface ILogin {
  password: string;
  createdAt: Date;
}

const LoginSchema = new Schema<ILogin>({
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Login = models.Login || model<ILogin>("Login", LoginSchema);
