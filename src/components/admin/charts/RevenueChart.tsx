"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const MONTHS = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];

interface Props {
  data: { _id: { year: number; month: number }; revenue: number }[];
}

export default function RevenueChart({ data }: Props) {
  const formatted = data.map((d) => ({
    mes: MONTHS[d._id.month - 1],
    ingresos: d.revenue,
  }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={formatted} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
        <XAxis dataKey="mes" tick={{ fontFamily: "IBM Plex Mono", fontSize: 10, fill: "#6B6B6B" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontFamily: "IBM Plex Mono", fontSize: 10, fill: "#6B6B6B" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}€`} />
        <Tooltip
          contentStyle={{ background: "#1A1A1A", border: "1px solid #2A2A2A", fontFamily: "IBM Plex Mono", fontSize: 11, color: "#E2E2E2" }}
          formatter={(v: number) => [`${v.toLocaleString("es-ES")}€`, "Ingresos"]}
          cursor={{ fill: "rgba(240,165,0,0.05)" }}
        />
        <Bar dataKey="ingresos" radius={0}>
          {formatted.map((_, i) => (
            <Cell key={i} fill={i === formatted.length - 1 ? "#F0A500" : "#04009c"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
