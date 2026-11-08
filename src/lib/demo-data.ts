import type { IProduct } from "@/lib/models/product";
import type { IOrder } from "@/lib/models/order";
import type { ISubscriber } from "@/lib/models/subscriber";
import type { ShippingMethod } from "@/lib/shipping";
import { DEFAULT_SIZE_GUIDES } from "@/lib/size-guide";

/**
 * DATOS DE EJEMPLO — INVENTADOS.
 *
 * El panel de administración es una vista de prueba: enseña cómo será el
 * panel sin exponer información real de clientes (correos de suscriptores,
 * pedidos con nombre y dirección). Todo lo que hay aquí es inventado:
 * correos con dominio de ejemplo, nombres y direcciones ficticios.
 *
 * Cuando vuelva la autenticación (better-auth) y el panel vuelva a ser real,
 * estas rutas vuelven a leer de MongoDB.
 */

const AHORA = Date.now();
const DIAS = 24 * 60 * 60 * 1000;

function haceDias(dias: number): Date {
  return new Date(AHORA - dias * DIAS);
}

export const DEMO_CATEGORIES = [
  { _id: "demo-cat-hoodies", name: "HOODIES", sizeGuide: "tops", order: 0, products: 2 },
  { _id: "demo-cat-camisetas", name: "CAMISETAS", sizeGuide: "tops", order: 1, products: 2 },
  { _id: "demo-cat-pantalones", name: "PANTALONES", sizeGuide: "bottoms", order: 2, products: 2 },
  { _id: "demo-cat-accesorios", name: "ACCESORIOS", sizeGuide: "none", order: 3, products: 1 },
];

export const DEMO_PRODUCTS: IProduct[] = [
  {
    _id: "demo-prod-001",
    name: "Sudadera Oversized Oscura",
    price: 89,
    category: "HOODIES",
    images: ["/products/ref-001-a.jpg", "/products/ref-002-a.jpg"],
    description: "Sudadera de caja en algodón pesado, capucha forrada y bolsillo frontal.",
    soldOut: false,
    sizes: [
      { size: "S", stock: 4 },
      { size: "M", stock: 7 },
      { size: "L", stock: 5 },
      { size: "XL", stock: 2 },
    ],
    slug: "sudadera-oversized-oscura",
    ref: "REF-101",
    createdAt: haceDias(4),
  },
  {
    _id: "demo-prod-002",
    name: "Sudadera Cropped con Capucha",
    price: 79,
    category: "HOODIES",
    images: ["/products/ref-003-a.jpg"],
    description: "Corte corto, puños y bajo elástico.",
    soldOut: false,
    sizes: [
      { size: "S", stock: 2 },
      { size: "M", stock: 3 },
      { size: "L", stock: 0 },
      { size: "XL", stock: 0 },
    ],
    slug: "sudadera-cropped-capucha",
    ref: "REF-102",
    createdAt: haceDias(12),
  },
  {
    _id: "demo-prod-003",
    name: "Camiseta Oversized Negra",
    price: 49,
    category: "CAMISETAS",
    images: ["/products/ref-004-a.jpg", "/products/ref-005-a.jpg"],
    description: "Punto grueso, hombrera caída y costuras tono sobre tono.",
    soldOut: false,
    sizes: [
      { size: "S", stock: 6 },
      { size: "M", stock: 9 },
      { size: "L", stock: 8 },
      { size: "XL", stock: 3 },
    ],
    slug: "camiseta-oversized-negra",
    ref: "REF-103",
    createdAt: haceDias(20),
  },
  {
    _id: "demo-prod-004",
    name: "Camiseta Larga Malla",
    price: 55,
    category: "CAMISETAS",
    images: ["/products/ref-006-a.jpg"],
    description: "Malla técnica transpirable, secado rápido.",
    soldOut: true,
    sizes: [
      { size: "S", stock: 0 },
      { size: "M", stock: 0 },
      { size: "L", stock: 0 },
      { size: "XL", stock: 0 },
    ],
    slug: "camiseta-larga-malla",
    ref: "REF-104",
    createdAt: haceDias(48),
  },
  {
    _id: "demo-prod-005",
    name: "Pantalón Cargo Ancho",
    price: 110,
    category: "PANTALONES",
    images: ["/products/ref-007-a.jpg", "/products/ref-008-a.jpg"],
    description: "Pinzas, seis bolsillos y cintura ajustable con cordón.",
    soldOut: false,
    sizes: [
      { size: "S", stock: 3 },
      { size: "M", stock: 5 },
      { size: "L", stock: 4 },
      { size: "XL", stock: 1 },
    ],
    slug: "pantalon-cargo-ancho",
    ref: "REF-105",
    createdAt: haceDias(9),
  },
  {
    _id: "demo-prod-006",
    name: "Pantalón Lino Recto",
    price: 95,
    category: "PANTALONES",
    images: ["/products/ref-009-a.jpg"],
    description: "Lino lavado con pernera recta.",
    soldOut: false,
    sizes: [
      { size: "S", stock: 2 },
      { size: "M", stock: 0 },
      { size: "L", stock: 0 },
      { size: "XL", stock: 0 },
    ],
    slug: "pantalon-lino-recto",
    ref: "REF-106",
    createdAt: haceDias(33),
  },
  {
    _id: "demo-prod-007",
    name: "Bolso Bandolera Minimal",
    price: 65,
    category: "ACCESORIOS",
    images: ["/products/ref-010-a.jpg"],
    description: "Correa larga, cierre magnético y forro interior.",
    soldOut: false,
    sizes: [{ size: "U", stock: 12 }],
    slug: "bolso-bandolera-minimal",
    ref: "REF-107",
    createdAt: haceDias(6),
  },
];

export const DEMO_SUBSCRIBERS: ISubscriber[] = [
  { _id: "demo-sub-001", name: "Ana Ejemplo", email: "ana.ejemplo@example.com", mobile: "+34 600 000 001", city: "Madrid", createdAt: haceDias(2) },
  { _id: "demo-sub-002", name: "Bruno Muestra", email: "bruno.muestra@example.com", mobile: "+34 600 000 002", city: "Barcelona", createdAt: haceDias(5) },
  { _id: "demo-sub-003", name: "Carla Demostración", email: "carla.demostracion@example.com", mobile: "", city: "Valencia", createdAt: haceDias(11) },
  { _id: "demo-sub-004", name: "Diego Prueba", email: "diego.prueba@example.com", mobile: "+34 600 000 004", city: "Sevilla", createdAt: haceDias(19) },
  { _id: "demo-sub-005", name: "Elena Fake", email: "elena.fake@example.com", mobile: "", city: "Bilbao", createdAt: haceDias(27) },
  { _id: "demo-sub-006", name: "Félix Inventado", email: "felix.inventado@example.com", mobile: "+34 600 000 006", city: "A Coruña", createdAt: haceDias(41) },
];

export const DEMO_ORDERS: IOrder[] = [
  {
    _id: "demo-ord-001",
    orderNumber: "DEMO-0001",
    customer: {
      name: "Ana Ejemplo",
      email: "ana.ejemplo@example.com",
      city: "Madrid",
      phone: "+34 600 000 001",
      address: "Calle de Ejemplo 12, 3º B",
      postalCode: "28013",
      province: "Madrid",
    },
    items: [
      { productId: "demo-prod-001", name: "Sudadera Oversized Oscura", ref: "REF-101", price: 89, quantity: 1, size: "M" },
      { productId: "demo-prod-007", name: "Bolso Bandolera Minimal", ref: "REF-107", price: 65, quantity: 1 },
    ],
    shippingMethod: { label: "ESTÁNDAR", price: 4.95 },
    total: 158.95,
    status: "entregado",
    statusHistory: [
      { status: "pendiente", at: haceDias(16) },
      { status: "confirmado", at: haceDias(15) },
      { status: "enviado", at: haceDias(14) },
      { status: "entregado", at: haceDias(11) },
    ],
    createdAt: haceDias(16),
    updatedAt: haceDias(11),
  },
  {
    _id: "demo-ord-002",
    orderNumber: "DEMO-0002",
    customer: {
      name: "Bruno Muestra",
      email: "bruno.muestra@example.com",
      city: "Barcelona",
      phone: "+34 600 000 002",
      address: "Avenida Ficticia 44, 1º",
      postalCode: "08018",
      province: "Barcelona",
    },
    items: [{ productId: "demo-prod-003", name: "Camiseta Oversized Negra", ref: "REF-103", price: 49, quantity: 2, size: "L" }],
    shippingMethod: { label: "EXPRÉS", price: 9.95 },
    total: 107.95,
    status: "enviado",
    statusHistory: [
      { status: "pendiente", at: haceDias(3) },
      { status: "confirmado", at: haceDias(2) },
      { status: "enviado", at: haceDias(1) },
    ],
    createdAt: haceDias(3),
    updatedAt: haceDias(1),
  },
  {
    _id: "demo-ord-003",
    orderNumber: "DEMO-0003",
    customer: {
      name: "Carla Demostración",
      email: "carla.demostracion@example.com",
      city: "Valencia",
      phone: "",
      address: "Plaza de Prueba 7, bajo",
      postalCode: "46002",
      province: "Valencia",
    },
    items: [{ productId: "demo-prod-005", name: "Pantalón Cargo Ancho", ref: "REF-105", price: 110, quantity: 1, size: "S" }],
    shippingMethod: { label: "ESTÁNDAR", price: 4.95 },
    total: 114.95,
    status: "pendiente",
    statusHistory: [{ status: "pendiente", at: haceDias(1) }],
    createdAt: haceDias(1),
    updatedAt: haceDias(1),
  },
];

export const DEMO_SHIPPING: ShippingMethod[] = [
  { id: "standard", label: "ESTÁNDAR", detail: "3 A 5 DÍAS LABORABLES", price: 4.95 },
  { id: "express", label: "EXPRÉS", detail: "24 A 48 HORAS", price: 9.95 },
];

export const DEMO_SIZE_GUIDES = DEFAULT_SIZE_GUIDES;

/** Carrito de ejemplo para el checkout de prueba. */
export const DEMO_CART = [
  { key: "demo-prod-001:M", productId: "demo-prod-001", slug: "sudadera-oversized-oscura", name: "Sudadera Oversized Oscura", price: 89, image: "/products/ref-001-a.jpg", size: "M", qty: 1, maxQty: 7 },
  { key: "demo-prod-007:U", productId: "demo-prod-007", slug: "bolso-bandolera-minimal", name: "Bolso Bandolera Minimal", price: 65, image: "/products/ref-010-a.jpg", size: null, qty: 1, maxQty: 12 },
];

/** Datos calculados para el resumen del panel. */
export function demoStats() {
  const entregados = DEMO_ORDERS.filter((o) => o.status === "entregado");
  const totalRevenue = entregados.reduce((sum, o) => sum + o.total, 0);
  const monthRevenue = entregados
    .filter((o) => new Date(o.createdAt).getMonth() === new Date().getMonth())
    .reduce((sum, o) => sum + o.total, 0);
  const activeOrders = DEMO_ORDERS.filter((o) => ["pendiente", "confirmado", "enviado"].includes(o.status)).length;
  const soldOutCount = DEMO_PRODUCTS.filter((p) => p.soldOut).length;

  const byStatus = new Map<string, number>();
  for (const o of DEMO_ORDERS) byStatus.set(o.status, (byStatus.get(o.status) ?? 0) + 1);

  const byCategory = new Map<string, number>();
  for (const p of DEMO_PRODUCTS) byCategory.set(p.category, (byCategory.get(p.category) ?? 0) + 1);

  // Ingresos de los últimos seis meses (datos inventados)
  const revenueByMonth = [0, 1, 2, 3, 4, 5].map((offset) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - offset);
    return { _id: { year: d.getFullYear(), month: d.getMonth() + 1 }, revenue: 1200 + ((offset * 347) % 900) };
  }).reverse();

  return {
    totalRevenue,
    monthRevenue,
    activeOrders,
    soldOutCount,
    totalSubscribers: DEMO_SUBSCRIBERS.length,
    recentSubscribers: DEMO_SUBSCRIBERS.slice(0, 5).map((s) => ({
      name: s.name,
      email: s.email,
      city: s.city,
      createdAt: s.createdAt.toISOString(),
    })),
    ordersByStatus: [...byStatus.entries()].map(([status, count]) => ({ _id: status, count })),
    revenueByMonth,
    productsByCategory: [...byCategory.entries()].map(([category, count]) => ({ _id: category, count })),
  };
}
