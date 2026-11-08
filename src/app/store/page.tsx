import StoreHeader from "@/components/store/StoreHeader";
import ProductGrid from "@/components/store/ProductGrid";
import StoreFooter from "@/components/store/StoreFooter";

export const metadata = { title: "Tienda | 04009c" };

export default function StorePage() {
  return (
    <main className="min-h-dvh flex flex-col" style={{ backgroundColor: "var(--theme-bg)" }}>
      <StoreHeader />
      <ProductGrid />
      <StoreFooter />
    </main>
  );
}
