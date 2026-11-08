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
      {/* Franja propia del pago: refuerza que es una simulación */}
      <div
        role="note"
        className="w-full border-y border-brand-red text-brand-red font-terminal text-[10px] tracking-[0.12em] uppercase px-4 py-2 text-center"
      >
        Proceso de prueba — el pago solo muestra un ejemplo de cómo será; no se cobra ni se guarda ningún pedido
      </div>
      <StoreHeader />
      <Checkout />
      <StoreFooter />
    </main>
  );
}
