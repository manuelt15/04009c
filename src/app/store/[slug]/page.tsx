import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/mongoose";
import { Product } from "@/lib/models/product";
import { getCategories, getStoreSettings } from "@/lib/store-config";
import ProductDetail from "@/components/store/detail/ProductDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, " ")} | 04009c` };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  await connectDB();
  const [product, categories, settings] = await Promise.all([
    Product.findOne({ slug }).lean<{ category: string }>(),
    getCategories(),
    getStoreSettings(),
  ]);

  if (!product) notFound();

  // Guía de medidas según la categoría: tops, bottoms o ninguna (talla única)
  const kind = categories.find((c) => c.name === product.category)?.sizeGuide ?? "tops";
  const guide = kind === "none" ? null : settings.sizeGuides[kind];

  return <ProductDetail product={JSON.parse(JSON.stringify(product))} guide={guide} />;
}
