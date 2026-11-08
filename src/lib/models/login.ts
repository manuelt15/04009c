import mongoose, { Schema, model, models } from "mongoose";

export interface ILogin {
  password: string;
  createdAt: Date;
  tokenVersion: number;
}

const LoginSchema = new Schema<ILogin>({
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  // Contador que viaja en el token de miembro. Rotar el código de acceso lo
  // incrementa y retira el acceso a quien ya tenía sesión.
  tokenVersion: { type: Number, default: 0 },
});

export const Login = models.Login || model<ILogin>("Login", LoginSchema);
