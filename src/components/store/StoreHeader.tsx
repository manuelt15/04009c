"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import ThemeSwitcher from "@/components/shared/ThemeSwitcher";
import CartButton from "@/components/store/cart/CartButton";
import MobileMenu from "@/components/store/MobileMenu";

export default function StoreHeader() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-[var(--theme-bg)] border-b border-border flex items-center justify-between px-6 py-3 transition-colors duration-300">
      {/* Caballo → sobre nosotros · nombre → inicio de la tienda */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.push("/about")} aria-label="Sobre nosotros" className="group">
          <Image src="/caballo_blanco_recortado.png" alt="" width={34} height={23} className="object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
        </button>
        <button
          onClick={() => router.push("/store")}
          aria-label="Ir al inicio"
          className="font-brand text-xl text-off-white tracking-widest hover:text-brand-red transition-colors"
        >
          04009c
        </button>
      </div>

      {/* Escritorio */}
      <div className="hidden sm:flex items-center gap-5">
        <ThemeSwitcher />
        <CartButton />
        <button
          onClick={() => router.push("/admin")}
          className="font-terminal text-[10px] text-dim hover:text-brand-red tracking-widest uppercase transition-colors"
        >
          ADMINISTRADOR
        </button>
      </div>

      {/* Móvil: carrito a mano; modos y administrador en el menú lateral */}
      <div className="flex sm:hidden items-center gap-4">
        <CartButton />
        <MobileMenu />
      </div>
    </header>
  );
}
