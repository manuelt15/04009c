import { connectDB } from "@/lib/db/mongoose";
import { Category, type ICategory, type SizeGuideKind } from "@/lib/models/category";
import { StoreSettings, type IStoreSettings } from "@/lib/models/store-settings";
import { DEFAULT_SIZE_GUIDES } from "@/lib/size-guide";
import { DEFAULT_SHIPPING } from "@/lib/shipping";

// Lista con la que arrancó la tienda: se usa para sembrar la colección la primera vez
const DEFAULT_CATEGORIES: { name: string; sizeGuide: SizeGuideKind }[] = [
  { name: "HOODIES",    sizeGuide: "tops" },
  { name: "CAMISETAS",  sizeGuide: "tops" },
  { name: "TOPS",       sizeGuide: "tops" },
  { name: "PANTALONES", sizeGuide: "bottoms" },
  { name: "ACCESORIOS", sizeGuide: "none" },
  { name: "CHAQUETAS",  sizeGuide: "tops" },
];

export async function getCategories(): Promise<ICategory[]> {
  await connectDB();
  if ((await Category.estimatedDocumentCount()) === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES.map((c, i) => ({ ...c, order: i })), { ordered: false }).catch(() => {});
  }
  return JSON.parse(JSON.stringify(await Category.find().sort({ order: 1, name: 1 }).lean()));
}

export async function getStoreSettings(): Promise<Pick<IStoreSettings, "shipping" | "sizeGuides">> {
  await connectDB();
  const doc = await StoreSettings.findOneAndUpdate(
    { key: "main" },
    { $setOnInsert: { key: "main", shipping: DEFAULT_SHIPPING, sizeGuides: DEFAULT_SIZE_GUIDES } },
    { upsert: true, returnDocument: "after" },
  ).lean<IStoreSettings>();
  return {
    shipping: doc?.shipping?.length ? doc.shipping : DEFAULT_SHIPPING,
    sizeGuides: {
      tops: doc?.sizeGuides?.tops ?? DEFAULT_SIZE_GUIDES.tops,
      bottoms: doc?.sizeGuides?.bottoms ?? DEFAULT_SIZE_GUIDES.bottoms,
    },
  };
}
