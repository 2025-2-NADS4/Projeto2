import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LabelList } from "recharts";

export default function StoreChart({ data, metric, isDark }) {
  const axisColor = isDark ? "#E0E0E0" : "#333";
  const tooltipBg = isDark ? "#1C1C1C" : "#FFFFFF";
  const tooltipColor = isDark ? "#FFF" : "#000";

  return (
    <section>
      <h3 className="text-xl font-semibold mb-4 text-[#FFD700]">🏆 Lojas com Maior Receita</h3>
      <div className={`rounded-2xl border ${isDark ? "border-[#222]" : "border-gray-200"} p-4 shadow-lg`}>
        <ResponsiveContainer width="100%" height={460}>
          <BarChart data={data} margin={{ top: 48, right: 30, left: 10, bottom: 90 }}>
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
  );
}
