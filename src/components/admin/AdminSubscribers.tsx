"use client";

import { useEffect, useState } from "react";
import type { ISubscriber } from "@/lib/models/subscriber";

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<ISubscriber[]>([]);

  useEffect(() => {
    fetch("/api/admin/subscribers").then((r) => r.json()).then((d) => setSubscribers(d.subscribers ?? []));
  }, []);

  function exportCSV() {
    const header = "Nombre,Email,Móvil,Ciudad,Fecha";
    const rows = subscribers.map((s) =>
      `${s.name},${s.email},${s.mobile},${s.city},${new Date(s.createdAt).toLocaleDateString("es-ES")}`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "suscriptores-04009c.csv"; a.click();
  }

  return (
    <div className="p-4 md:p-6 pt-16 md:pt-6 flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="data-label">// GESTIÓN</span>
          <h1 className="font-display text-2xl md:text-3xl text-off-white tracking-wider">SUSCRIPTORES</h1>
        </div>
        <button onClick={exportCSV}
          className="font-terminal text-[11px] tracking-widest uppercase px-4 py-2 border border-border text-dim hover:border-amber hover:text-amber transition-colors">
          EXPORTAR CSV
        </button>
      </div>

      <div className="bg-surface border border-border overflow-x-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="font-terminal text-[10px] text-dim">{subscribers.length} REGISTRADOS</span>
        </div>

        {subscribers.length === 0 ? (
          <div className="p-8 text-center">
            <span className="font-terminal text-[11px] text-dim">// SIN SUSCRIPTORES AÚN</span>
          </div>
        ) : (
          <table className="w-full min-w-[560px]">
            <thead className="border-b border-border">
              <tr>
                {["NOMBRE","EMAIL","MÓVIL","CIUDAD","FECHA"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-terminal text-[10px] text-dim tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscribers.map((s) => (
                <tr key={s._id} className="hover:bg-black/30 transition-colors">
                  <td className="px-4 py-3 font-terminal text-[11px] text-off-white">{s.name}</td>
                  <td className="px-4 py-3 font-terminal text-[11px] text-dim">{s.email}</td>
                  <td className="px-4 py-3 font-terminal text-[11px] text-dim">{s.mobile || "—"}</td>
                  <td className="px-4 py-3 font-terminal text-[11px] text-dim">{s.city || "—"}</td>
                  <td className="px-4 py-3 font-terminal text-[11px] text-amber/60">
                    {new Date(s.createdAt).toLocaleDateString("es-ES")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
