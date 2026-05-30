import StoreHeader from "@/components/store/StoreHeader";
import ProductGrid from "@/components/store/ProductGrid";

export default function StorePage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--theme-bg)" }}>
      <StoreHeader />
      <ProductGrid />
    </main>
  );
}
