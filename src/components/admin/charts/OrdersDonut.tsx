"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS: Record<string, string> = {
  pendiente:  "#FF0000",
  confirmado: "rgba(226, 226, 226, 0.45)",
  enviado:    "#E2E2E2",
  entregado:  "#6B6B6B",
  cancelado:  "#2A2A2A",
};

interface Props {
  data: { _id: string; count: number }[];
}

export default function OrdersDonut({ data }: Props) {
  const formatted = data.map((d) => ({ name: d._id.toUpperCase(), value: d.count, key: d._id }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie animationDuration={400} animationEasing="ease-out" data={formatted} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
          {formatted.map((entry, i) => (
            <Cell key={i} fill={COLORS[entry.key] ?? "#6B6B6B"} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: "#1A1A1A", border: "1px solid #2A2A2A", fontFamily: "IBM Plex Mono", fontSize: 11, color: "#E2E2E2" }}
        />
        <Legend iconType="square" iconSize={8} wrapperStyle={{ fontFamily: "IBM Plex Mono", fontSize: 10, color: "#6B6B6B" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
