"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart, cartSubtotal, formatPrice, type CartItem } from "@/lib/cart-store";
import { DEMO_CART } from "@/lib/demo-data";
import { DEFAULT_SHIPPING, type ShippingMethod } from "@/lib/shipping";
import StripeNotice from "./StripeNotice";

const LABEL = "font-terminal text-[0.65rem] tracking-[0.12em] uppercase text-brand-red";
const INPUT =
  "w-full bg-transparent border border-border text-off-white font-terminal text-sm px-4 py-3 placeholder:text-dim/60 focus:border-brand-red transition-colors";

type FieldKey = "email" | "phone" | "firstName" | "lastName" | "address" | "city" | "postalCode" | "province";

const FIELDS: { key: FieldKey; label: string; type: string; autoComplete: string; required: boolean; wide?: boolean }[] = [
  { key: "email",      label: "EMAIL",              type: "email", autoComplete: "email",          required: true, wide: true },
  { key: "phone",      label: "TELÉFONO",           type: "tel",   autoComplete: "tel",            required: true, wide: true },
  { key: "firstName",  label: "NOMBRE",             type: "text",  autoComplete: "given-name",     required: true },
  { key: "lastName",   label: "APELLIDOS",          type: "text",  autoComplete: "family-name",    required: true },
  { key: "address",    label: "DIRECCIÓN",          type: "text",  autoComplete: "street-address", required: true, wide: true },
  { key: "city",       label: "CIUDAD",             type: "text",  autoComplete: "address-level2", required: true },
  { key: "postalCode", label: "CÓDIGO POSTAL",      type: "text",  autoComplete: "postal-code",    required: true },
  { key: "province",   label: "PROVINCIA",          type: "text",  autoComplete: "address-level1", required: true, wide: true },
];

// Datos de ejemplo: el checkout es una maqueta, no cobra ni guarda nada.
const DEMO_FORM: Record<FieldKey, string> = {
  email: "ana.ejemplo@example.com",
  phone: "+34 600 000 001",
  firstName: "Ana",
  lastName: "Ejemplo",
  address: "Calle de Ejemplo 12, 3º B",
  city: "Madrid",
  postalCode: "28013",
  province: "Madrid",
};

export default function Checkout() {
  const cart = useCart();
  const router = useRouter();
  const [form, setForm] = useState<Record<FieldKey, string>>(DEMO_FORM);
  const [methods, setMethods] = useState<ShippingMethod[]>(DEFAULT_SHIPPING);
  const [shippingId, setShippingId] = useState<string>(DEFAULT_SHIPPING[0].id);
  const [notice, setNotice] = useState(false);
  const closeNotice = useCallback(() => setNotice(false), []);
  const shipping = methods.find((m) => m.id === shippingId) ?? methods[0];

  // Métodos y precios de envío editables en el panel → AJUSTES
  useEffect(() => {
    fetch("/api/store-settings")
      .then((r) => r.json())
      .then((d: { shipping?: ShippingMethod[] }) => {
        if (d.shipping?.length) {
          setMethods(d.shipping);
          setShippingId((id) => (d.shipping!.some((m) => m.id === id) ? id : d.shipping![0].id));
        }
      })
      .catch(() => {});
  }, []);

  // Sin productos en el carrito se enseña un carrito de ejemplo: la maqueta
  // tiene que verse completa aunque nadie haya añadido nada.
  const items: CartItem[] = cart.length > 0 ? cart : (DEMO_CART as CartItem[]);
  const esEjemplo = cart.length === 0;

  const subtotal = cartSubtotal(items);
  const total = subtotal + shipping.price;

  return (
    <section className="flex-1 px-6 py-10 lg:py-14">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <span className={LABEL}>{"// CHECKOUT"}</span>
          <h1 className="font-display text-4xl text-off-white tracking-wider uppercase leading-tight">Finalizar pedido</h1>
        </div>

        {esEjemplo && (
          <div className="border border-brand-red px-4 py-3 flex flex-col gap-1">
            <span className="font-terminal text-[11px] tracking-widest uppercase text-brand-red">
              {"// CHECKOUT DE EJEMPLO"}
            </span>
            <span className="font-terminal text-[10px] text-dim leading-relaxed">
              Este carrito lleva productos de ejemplo. El pago todavía no está activo y no se guarda ningún pedido.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          {/* Datos */}
          <div className="flex flex-col gap-8">
            <fieldset className="flex flex-col gap-4">
              <legend className={`${LABEL} mb-4`}>CONTACTO Y ENVÍO</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FIELDS.map((f) => (
                  <label key={f.key} className={`flex flex-col gap-1 ${f.wide ? "sm:col-span-2" : ""}`}>
                    <span className="font-terminal text-[10px] text-dim tracking-widest uppercase">
                      {f.label}{f.required ? " *" : ""}
                    </span>
                    <input
                      id={`checkout-${f.key}`}
                      name={f.key}
                      type={f.type}
                      autoComplete={f.autoComplete}
                      value={form[f.key]}
                      onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                      className={INPUT}
                    />
                  </label>
                ))}
                <label className="flex flex-col gap-1 sm:col-span-2">
                  <span className="font-terminal text-[10px] text-dim tracking-widest uppercase">PAÍS</span>
                  <input value="ESPAÑA" readOnly className={`${INPUT} text-dim`} />
                </label>
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-3">
              <legend className={`${LABEL} mb-4`}>MÉTODO DE ENVÍO</legend>
              {methods.map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center justify-between gap-4 border px-4 py-3 cursor-pointer transition-colors ${
                    shipping.id === m.id ? "border-off-white" : "border-border hover:border-dim"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shipping.id === m.id}
                      onChange={() => setShippingId(m.id)}
                      className="accent-[var(--color-brand-red)]"
                    />
                    <span className="flex flex-col">
                      <span className="font-terminal text-xs text-off-white tracking-widest">{m.label}</span>
                      <span className="font-terminal text-[10px] text-dim tracking-wider">{m.detail}</span>
                    </span>
                  </span>
                  <span className="font-terminal text-sm text-off-white">{formatPrice(m.price)}</span>
                </label>
              ))}
            </fieldset>

            <fieldset className="flex flex-col gap-3">
              <legend className={`${LABEL} mb-4`}>PAGO</legend>
              <div className="border border-border px-4 py-4 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-terminal text-[11px] text-dim tracking-widest uppercase">
                    Pago con Stripe — próximamente
                  </span>
                  {/* Wordmark oficial de Stripe */}
                  <Image src="/stripe-wordmark-white.svg" alt="Stripe" width={52} height={22} className="opacity-70" />
                </div>
                <p className="font-terminal text-[10px] text-dim leading-relaxed">
                  Cuando se active el pago con Stripe se podrá pagar con tarjeta en esta misma página.
                  Hasta entonces no se cobra nada ni se guarda ningún pedido.
                </p>
              </div>
            </fieldset>
          </div>

          {/* Resumen */}
          <aside className="lg:sticky lg:top-20 self-start w-full border border-border bg-surface flex flex-col">
            <span className={`${LABEL} px-5 pt-5`}>RESUMEN DEL PEDIDO</span>
            <ul className="divide-y divide-border px-5">
              {items.map((item) => (
                <li key={item.key} className="flex gap-3 py-4">
                  <div className={`relative w-12 aspect-[3/4] shrink-0 ${item.image ? "bg-off-white" : "bg-black"}`}>
                    {item.image && <Image src={item.image} alt={item.name} fill sizes="48px" className="product-photo" />}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <span className="font-display text-sm text-off-white tracking-wider uppercase truncate">{item.name}</span>
                    <span className="font-terminal text-[10px] text-dim tracking-widest uppercase">
                      {item.size ? `TALLA ${item.size}` : "TALLA ÚNICA"} · {item.qty} UD.
                    </span>
                  </div>
                  <span className="font-terminal text-xs text-off-white">{formatPrice(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-border px-5 py-4 flex flex-col gap-2 font-terminal text-xs">
              <div className="flex justify-between text-dim"><span>SUBTOTAL</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-dim"><span>ENVÍO ({shipping.label})</span><span>{formatPrice(shipping.price)}</span></div>
              <div className="flex justify-between text-off-white text-base pt-2 border-t border-border mt-1">
                <span>TOTAL</span><span className="text-brand-red">{formatPrice(total)}</span>
              </div>
              <span className="text-[10px] text-dim tracking-wider">IVA INCLUIDO</span>
            </div>
            <div className="px-5 pb-5 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setNotice(true)}
                className="w-full bg-off-white text-black font-terminal text-sm tracking-widest uppercase py-4 hover:bg-brand-red hover:text-off-white press"
              >
                PAGAR {formatPrice(total)}
              </button>
              <button
                type="button"
                onClick={() => router.push("/store")}
                className="w-full font-terminal text-[10px] text-dim hover:text-off-white tracking-widest uppercase py-2"
              >
                VOLVER A LA TIENDA
              </button>
            </div>
          </aside>
        </div>
      </div>

      <StripeNotice open={notice} onClose={closeNotice} />
    </section>
  );
}
