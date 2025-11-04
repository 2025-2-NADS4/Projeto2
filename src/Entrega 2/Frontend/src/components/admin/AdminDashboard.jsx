import React, { useEffect, useMemo, useState } from "react";
import { Download, SlidersHorizontal } from "lucide-react";
import { exportReport } from "../../api/insightsApi";
import AdminKpiGrid from "../kpis/AdminKpiGrid";
import StoreChart from "../charts/StoreChart";
import CampaignsChartAdmin from "../charts/CampaignsChartAdmin";
import AdminSuggestions from "../insights/AdminSuggestions";
import CampaignSimulator from "../simulador/CampaignSimulator";

export default function AdminDashboard({ data, isDark, onFilterChange }) {
  const [metric, setMetric] = useState("receita");
  const [channel, setChannel] = useState("all");
  const [region, setRegion] = useState("all");

  const resumo = data?.resumo_geral || {};

  const campanhasFiltradas = useMemo(() => {
    return (data?.campanhas_resumo || []).filter(
      (camp) => camp["taxa_resposta_%"] < 100
    );
  }, [data]);

  const lojasData = useMemo(() => {
    const base = data?.lojas_top || [];
    let filtradas = [...base];

    if (channel !== "all") {
      filtradas = filtradas.filter(
        (x) => (x.saleschannel || "").toLowerCase() === channel
      );
    }

    if (region !== "all") {
      filtradas = filtradas.filter(
        (x) =>
          (x["delivery.region"] || x.region || "").toLowerCase() === region
      );
    }

    return filtradas;
  }, [data, channel, region]);

  useEffect(() => {
    onFilterChange?.({ metric, channel, region });
  }, [metric, channel, region, onFilterChange]);

  if (!data) {
    return (
      <div className="p-10 text-center text-gray-500 dark:text-gray-300">
        Carregando dados do painel...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* === FILTROS === */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FF8C00] bg-clip-text text-transparent">
          Painel Administrativo Cannoli
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-[#FF8C00]" />
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="receita">Métrica: Receita</option>
              <option value="ticket">Métrica: Ticket Médio</option>
              <option value="pedidos">Métrica: Pedidos</option>
              <option value="tempo">Métrica: Tempo de Preparo</option>
            </select>
          </div>

          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">Todos os Canais</option>
            {(data.canais_venda || []).map((c) => (
              <option
                key={c.saleschannel}
                value={(c.saleschannel || "").toLowerCase()}
              >
                {c.saleschannel}
              </option>
            ))}
          </select>

          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">Todas as Regiões</option>
            {Array.from(
              new Set(
                (data.lojas_top || [])
                  .map((x) =>
                    (x["delivery.region"] || x.region || "").toLowerCase()
                  )
                  .filter(Boolean)
              )
            ).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            {["csv", "xlsx", "pdf"].map((ext) => (
              <button
                key={ext}
                onClick={() =>
                  exportReport(ext, data.period, { metric, channel, region })
                }
                className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-black/5 dark:hover:bg-white/5"
              >
                <Download size={16} /> {ext.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* === KPIs === */}
      <AdminKpiGrid resumo={resumo} isDark={isDark} />

      {/* === GRÁFICOS === */}
      <StoreChart data={lojasData} metric={metric} isDark={isDark} />
      <CampaignsChartAdmin data={campanhasFiltradas} isDark={isDark} />

      {/* === INSIGHTS + SIMULADOR === */}
      <div className="grid md:grid-cols-2 gap-6">
        <AdminSuggestions data={data} isDark={isDark} />
        <CampaignSimulator resumo={resumo} isDark={isDark} />
      </div>
    </div>
  );
}
