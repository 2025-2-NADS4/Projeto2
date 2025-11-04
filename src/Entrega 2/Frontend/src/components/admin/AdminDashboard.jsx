import React, { useMemo, useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import {
  Wallet,
  Users,
  Timer,
  Store,
  Download,
  Sparkles,
  SlidersHorizontal,
  Play,
} from "lucide-react";
import { exportReport } from "../../api/insightsApi";

export default function AdminDashboard({ data, isDark, onFilterChange }) {
  const [metric, setMetric] = useState("receita");
  const [channel, setChannel] = useState("all");
  const [region, setRegion] = useState("all");
  const [sim, setSim] = useState({ investimento: 1000, taxa: 2, publico: 1000 });

  useEffect(() => {
    onFilterChange?.({ metric, channel, region });
  }, [metric, channel, region, onFilterChange]);

  const resumo = data?.resumo_geral || {};

  const campanhasFiltradas = useMemo(() => {
    if (!data?.campanhas_resumo) return [];
    return data.campanhas_resumo.filter(
      (camp) => camp["taxa_resposta_%"] < 100
    );
  }, [data?.campanhas_resumo]);

  const lojasData = useMemo(() => {
    if (!data?.lojas_top) return [];
    let base = data.lojas_top;
    if (channel !== "all")
      base = base.filter(
        (x) => (x.saleschannel || "").toLowerCase() === channel
      );
    if (region !== "all")
      base = base.filter(
        (x) =>
          (x["delivery.region"] || x.region || "").toLowerCase() === region
      );
    return base;
  }, [data?.lojas_top, channel, region]);

  const simResult = useMemo(() => {
    const conv = Math.max(0, (sim.taxa || 0) / 100);
    const pedidos = Math.round(sim.publico * conv);
    const ticket = Number(resumo.ticket_medio_geral || 0);
    const receita = (pedidos * ticket).toFixed(2);
    const roi = ticket
      ? (((receita - sim.investimento) / sim.investimento) * 100).toFixed(1)
      : 0;
    return { conv, pedidos, receita, roi };
  }, [sim, resumo.ticket_medio_geral]);

  const axisColor = isDark ? "#E0E0E0" : "#333";
  const tooltipBg = isDark ? "#1C1C1C" : "#FFFFFF";
  const tooltipColor = isDark ? "#FFF" : "#000";

  if (!data) return null;

  return (
    <div className="space-y-10">
      {/* === HEADER === */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FF8C00] bg-clip-text text-transparent">
          Painel Administrativo Cannoli
        </h2>

        {/* === FILTROS === */}
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
                key={c.saleschannel || c.salesChannel}
                value={(c.saleschannel || c.salesChannel || "").toLowerCase()}
              >
                {c.saleschannel || c.salesChannel}
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
                  .map((x) => (x["delivery.region"] || x.region || "").toLowerCase())
                  .filter(Boolean)
              )
            ).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          {/* === EXPORTAÇÕES === */}
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <KpiCard
          icon={<Wallet className="text-[#FFD700]" />}
          label="Ticket Médio"
          value={`R$ ${resumo.ticket_medio_geral || "0.00"}`}
          isDark={isDark}
        />
        <KpiCard
          icon={<Timer className="text-[#00BFA6]" />}
          label="Tempo Médio de Preparo"
          value={`${resumo.tempo_medio_preparo || 0} min`}
          isDark={isDark}
        />
        <KpiCard
          icon={<Users className="text-[#FF8C00]" />}
          label="Total de Clientes"
          value={resumo.total_clientes || 0}
          isDark={isDark}
        />
        <KpiCard
          icon={<Store className="text-[#FFD700]" />}
          label="Total de Pedidos"
          value={resumo.total_pedidos || 0}
          isDark={isDark}
        />
      </div>

      {/* === GRÁFICOS === */}
      <ChartsSection
        {...{
          isDark,
          axisColor,
          tooltipBg,
          tooltipColor,
          lojasData,
          campanhasFiltradas,
          metric,
        }}
      />

      {/* === SUGESTÕES + SIMULADOR === */}
      <ExtrasSection {...{ data, isDark, sim, setSim, simResult }} />
    </div>
  );
}

/* === COMPONENTES AUXILIARES === */
function KpiCard({ icon, label, value, isDark }) {
  return (
    <div
      className={`p-5 rounded-2xl border shadow-md flex flex-col items-center justify-center transition-colors duration-300 ${
        isDark
          ? "bg-[#1C1C1C] border-[#222] text-white"
          : "bg-white border-gray-200 text-gray-900"
      }`}
    >
      <div className="mb-2">{icon}</div>
      <p className="text-sm opacity-70">{label}</p>
      <h3 className="text-xl font-bold">{value}</h3>
    </div>
  );
}

/* === GRÁFICOS === */
function ChartsSection({ isDark, axisColor, tooltipBg, tooltipColor, lojasData, campanhasFiltradas, metric }) {
  return (
    <>
      {/* Lojas */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-[#FFD700]">
          🏆 Lojas com Maior Receita
        </h3>
        <div
          className={`rounded-2xl border ${
            isDark ? "border-[#222]" : "border-gray-200"
          } p-4 shadow-lg`}
        >
          <ResponsiveContainer width="100%" height={460}>
            <BarChart data={lojasData} margin={{ top: 48, right: 30, left: 10, bottom: 90 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#ddd"} />
              <XAxis dataKey="store.name" stroke={axisColor} angle={-25} textAnchor="end" interval={0} height={95} tick={{ fontSize: 12 }} />
              <YAxis stroke={axisColor} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderRadius: "10px", border: "1px solid #555", color: tooltipColor }} formatter={(v) => `R$ ${Number(v).toFixed(2)}`} />
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFD700" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#FF8C00" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <Bar
                dataKey={
                  metric === "ticket"
                    ? "ticket_medio"
                    : metric === "tempo"
                    ? "tempo_medio"
                    : metric === "pedidos"
                    ? "pedidos"
                    : "receita"
                }
                fill="url(#goldGradient)"
                radius={[8, 8, 0, 0]}
                barSize={40}
              >
                <LabelList dataKey="receita" position="top" dy={-6} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Campanhas */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-[#00BFA6]">
          💬 Campanhas com Maior Engajamento
        </h3>
        <div
          className={`rounded-2xl border ${
            isDark ? "border-[#222]" : "border-gray-200"
          } p-4 shadow-lg`}
        >
          <ResponsiveContainer width="100%" height={480}>
            <BarChart layout="vertical" data={campanhasFiltradas} margin={{ top: 16, right: 30, left: 110, bottom: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#ddd"} />
              <XAxis type="number" stroke={axisColor} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <YAxis dataKey="nome" type="category" width={160} tick={{ fill: axisColor }} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderRadius: "10px", border: "1px solid #00BFA6", color: tooltipColor }} formatter={(v) => `${v}%`} />
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0077FF" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#00D4FF" stopOpacity={0.9} />
                </linearGradient>
              </defs>
              <Bar dataKey="taxa_resposta_%" fill="url(#blueGradient)" radius={[0, 10, 10, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  );
}

function ExtrasSection({ data, isDark, sim, setSim, simResult }) {
  return (
    <section className="grid md:grid-cols-2 gap-6">
      {/* Sugestões Automáticas */}
      <div
        className={`rounded-2xl border ${
          isDark ? "border-[#222]" : "border-gray-200"
        } p-5`}
      >
        <h3 className="text-xl font-semibold mb-3 text-[#FFD700] flex items-center gap-2">
          <Sparkles className="text-[#FFD700]" size={18} /> Sugestões Automáticas
        </h3>

        <ul className="list-disc ml-5 text-sm space-y-1">
          {(data.recomendacoes || []).length > 0 ? (
            data.recomendacoes.map((r, i) => (
              <li key={i}>
                {typeof r === "object"
                  ? r.mensagem || r.message || JSON.stringify(r)
                  : r}
              </li>
            ))
          ) : (
            <li>Nenhuma sugestão no momento.</li>
          )}
        </ul>
      </div>

      {/* Simulador de Campanha */}
      <div
        className={`rounded-2xl border ${
          isDark ? "border-[#222]" : "border-gray-200"
        } p-5`}
      >
        <h3 className="text-xl font-semibold mb-3 text-[#FF8C00] flex items-center gap-2">
          <Play size={18} className="text-[#FF8C00]" /> Simulador de Campanha
        </h3>

        <div className="grid grid-cols-3 gap-3 text-sm">
          <InputField
            label="Investimento (R$)"
            value={sim.investimento}
            onChange={(v) => setSim((s) => ({ ...s, investimento: +v }))}
          />
          <InputField
            label="Taxa Conversão (%)"
            value={sim.taxa}
            onChange={(v) => setSim((s) => ({ ...s, taxa: +v }))}
          />
          <InputField
            label="Público impactado"
            value={sim.publico}
            onChange={(v) => setSim((s) => ({ ...s, publico: +v }))}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <ResultCard label="Pedidos previstos" value={simResult.pedidos} />
          <ResultCard
            label="Receita prevista"
            value={`R$ ${simResult.receita}`}
          />
          <ResultCard label="ROI estimado" value={`${simResult.roi}%`} full />
        </div>
      </div>
    </section>
  );
}


function InputField({ label, value, onChange }) {
  return (
    <div>
      <label className="block mb-1 opacity-80">{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
    </div>
  );
}

function ResultCard({ label, value, full }) {
  return (
    <div className={`p-3 rounded-lg bg-black/5 dark:bg-white/5 ${full ? "col-span-2" : ""}`}>
      {label}: <b>{value}</b>
    </div>
  );
}
