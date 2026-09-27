import type { Metadata } from "next";
import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";
import Checkout from "@/components/store/checkout/Checkout";

export const metadata: Metadata = {
  title: "Checkout | 04009c",
};

export default function CheckoutPage() {
  return (
    <main className="min-h-dvh flex flex-col" style={{ backgroundColor: "var(--theme-bg)" }}>
      <StoreHeader />
      <Checkout />
      <StoreFooter />
    </main>
  );
}
