export interface ShippingMethod {
  id: string;
  label: string;
  detail: string;
  price: number;
}

// Valores de partida PROVISIONALES: se editan en el panel → AJUSTES
export const DEFAULT_SHIPPING: ShippingMethod[] = [
  { id: "standard", label: "ESTÁNDAR", detail: "3 A 5 DÍAS LABORABLES", price: 4.95 },
  { id: "express",  label: "EXPRÉS",   detail: "24 A 48 HORAS",         price: 9.95 },
];
