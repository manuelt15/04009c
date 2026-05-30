import { Schema, model, models } from "mongoose";

export interface IAdmin {
  username: string;
  password: string;
}

const AdminSchema = new Schema<IAdmin>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const Admin = models.Admin || model<IAdmin>("Admin", AdminSchema);
