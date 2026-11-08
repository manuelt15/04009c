import { Schema, model, models } from "mongoose";

export interface IAdmin {
  username: string;
  password: string;
  tokenVersion: number;
}

const AdminSchema = new Schema<IAdmin>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Contador que viaja en el token. Cambiar credenciales lo incrementa y deja
  // sin efecto cualquier sesión admin emitida antes.
  tokenVersion: { type: Number, default: 0 },
});

export const Admin = models.Admin || model<IAdmin>("Admin", AdminSchema);
