import { Schema, model, models } from "mongoose";
import type { ShippingMethod } from "@/lib/shipping";
import type { SizeGuide } from "@/lib/size-guide";

// Documento único (key "main") con la configuración editable de la tienda
export interface IStoreSettings {
  key: "main";
  shipping: ShippingMethod[];
  sizeGuides: { tops: SizeGuide; bottoms: SizeGuide };
}

const StoreSettingsSchema = new Schema<IStoreSettings>({
  key:        { type: String, default: "main", unique: true },
  shipping:   { type: [Object], default: [] },
  sizeGuides: { type: Object, default: {} },
});

export const StoreSettings = models.StoreSettings || model<IStoreSettings>("StoreSettings", StoreSettingsSchema);
