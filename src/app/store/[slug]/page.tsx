import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/mongoose";
import { Product } from "@/lib/models/product";
import ProductDetail from "@/components/store/detail/ProductDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  await connectDB();
  const product = await Product.findOne({ slug }).lean();

  if (!product) notFound();

  return <ProductDetail product={JSON.parse(JSON.stringify(product))} />;
}
