import { useSyncExternalStore } from "react";

// Carrito en el navegador (localStorage). Sin cuenta de cliente ni pagos todavía:
// cuando se conecte Stripe, el precio real se recalcula en el servidor, nunca desde aquí.

export interface CartItem {
  key: string;          // productId + talla: la misma prenda en otra talla es otra línea
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  size: string | null;  // null = talla única
  qty: number;
  maxQty?: number;      // stock disponible de esa talla al añadir (sin control de stock: MAX_QTY)
}

export const MAX_QTY = 10;
const STORAGE_KEY = "04009c-cart";
const EMPTY: CartItem[] = [];

let items: CartItem[] | null = null;
const listeners = new Set<() => void>();

function read(): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

function write(next: CartItem[]) {
  items = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Sin almacenamiento (modo privado): el carrito vive solo en esta pestaña
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Mantiene sincronizadas varias pestañas abiertas
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      items = read();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): CartItem[] {
  if (items === null) items = read();
  return items;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY;
}

export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function cartKey(productId: string, size: string | null): string {
  return `${productId}:${size ?? "U"}`;
}

export function lineLimit(item: Pick<CartItem, "maxQty">): number {
  return Math.min(MAX_QTY, item.maxQty ?? MAX_QTY);
}

export function addToCart(item: Omit<CartItem, "key" | "qty">, qty: number) {
  const key = cartKey(item.productId, item.size);
  const current = getSnapshot();
  const existing = current.find((i) => i.key === key);
  const limit = lineLimit(item);
  write(
    existing
      ? current.map((i) => (i.key === key ? { ...i, maxQty: item.maxQty, qty: Math.min(limit, i.qty + qty) } : i))
      : [...current, { ...item, key, qty: Math.min(limit, qty) }],
  );
}

export function setQty(key: string, qty: number) {
  write(getSnapshot().map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(lineLimit(i), qty)) } : i)));
}

export function removeFromCart(key: string) {
  write(getSnapshot().filter((i) => i.key !== key));
}

export function cartCount(list: CartItem[]): number {
  return list.reduce((n, i) => n + i.qty, 0);
}

export function cartSubtotal(list: CartItem[]): number {
  return list.reduce((sum, i) => sum + i.price * i.qty, 0);
}

export function formatPrice(value: number): string {
  return value.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}
