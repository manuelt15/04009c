"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: { _id: string; count: number }[];
}

export default function CategoryChart({ data }: Props) {
  const formatted = data.map((d) => ({ cat: d._id, total: d.count }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={formatted} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
        <XAxis type="number" tick={{ fontFamily: "IBM Plex Mono", fontSize: 10, fill: "#6B6B6B" }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="cat" tick={{ fontFamily: "IBM Plex Mono", fontSize: 10, fill: "#6B6B6B" }} axisLine={false} tickLine={false} width={90} />
        <Tooltip
          contentStyle={{ background: "#1A1A1A", border: "1px solid #2A2A2A", fontFamily: "IBM Plex Mono", fontSize: 11, color: "#E2E2E2" }}
          cursor={{ fill: "rgba(240,165,0,0.05)" }}
        />
        <Bar dataKey="total" fill="#04009c" radius={0} />
      </BarChart>
    </ResponsiveContainer>
  );
}
