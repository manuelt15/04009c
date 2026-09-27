"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const RevenueChart  = dynamic(() => import("./charts/RevenueChart"),  { ssr: false });
const OrdersDonut   = dynamic(() => import("./charts/OrdersDonut"),   { ssr: false });
const CategoryChart = dynamic(() => import("./charts/CategoryChart"), { ssr: false });

interface Stats {
  totalRevenue: number;
  monthRevenue: number;
  activeOrders: number;
  soldOutCount: number;
  totalSubscribers: number;
  recentSubscribers: { name: string; email: string; city: string; createdAt: string }[];
  ordersByStatus: { _id: string; count: number }[];
  revenueByMonth: { _id: { year: number; month: number }; revenue: number }[];
  productsByCategory: { _id: string; count: number }[];
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-surface border border-border p-4 flex flex-col gap-1">
      <span className="data-label">{label}</span>
      <span className="font-display text-2xl md:text-3xl text-off-white tracking-wider">{value}</span>
      {sub && <span className="font-terminal text-[10px] text-dim">{sub}</span>}
    </div>
  );
}

function ChartBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border p-4 flex flex-col gap-3">
      <span className="data-label">{title}</span>
      {children}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-full py-32">
        <span className="font-terminal text-[11px] text-dim tracking-widest animate-pulse">// CARGANDO...</span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 pt-16 md:pt-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-0.5">
        <span className="data-label">// PANEL DE CONTROL</span>
        <h1 className="font-display text-2xl md:text-3xl text-off-white tracking-wider">RESUMEN</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="// INGRESOS TOTALES"
          value={`${stats.totalRevenue.toLocaleString("es-ES")}€`}
        />
        <StatCard
          label="// INGRESOS MES"
          value={`${stats.monthRevenue.toLocaleString("es-ES")}€`}
        />
        <StatCard
          label="// PEDIDOS ACTIVOS"
          value={stats.activeOrders}
          sub="pendiente / enviado"
        />
        <StatCard
          label="// SUSCRIPTORES"
          value={stats.totalSubscribers}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <ChartBox title="// INGRESOS POR MES">
          <RevenueChart data={stats.revenueByMonth} />
        </ChartBox>
        <ChartBox title="// PEDIDOS POR ESTADO">
          <OrdersDonut data={stats.ordersByStatus} />
        </ChartBox>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <ChartBox title="// PRODUCTOS POR CATEGORÍA">
          <CategoryChart data={stats.productsByCategory} />
        </ChartBox>

        {/* Últimos suscriptores */}
        <div className="bg-surface border border-border p-4 flex flex-col gap-3">
          <span className="data-label">// ÚLTIMOS SUSCRIPTORES</span>
          {stats.recentSubscribers.length === 0 ? (
            <span className="font-terminal text-[11px] text-dim">SIN SUSCRIPTORES AÚN</span>
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {stats.recentSubscribers.map((s, i) => (
                <li key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 gap-0.5">
                  <div>
                    <p className="font-terminal text-[11px] text-off-white">{s.name}</p>
                    <p className="font-terminal text-[10px] text-dim truncate max-w-[200px]">{s.email}</p>
                  </div>
                  <span className="font-terminal text-[10px] text-brand-red/60">{s.city || "—"}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
