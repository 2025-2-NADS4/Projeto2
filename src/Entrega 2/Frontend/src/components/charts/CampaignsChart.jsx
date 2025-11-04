import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import ChartCard from "./ChartCard";

export default function CampaignsChart({ data, isDark }) {
  const chartData = Object.entries(data || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const axisColor = isDark ? "#E0E0E0" : "#333";
  const gridColor = isDark ? "#2A2A2A" : "#E5E5E5";
  const tooltipBg = isDark ? "#1C1C1C" : "#FFFFFF";
  const tooltipBorder = isDark ? "#FFD700" : "#FF8C00";
  const tooltipText = isDark ? "#EAEAEA" : "#222";
  const bgColor = isDark ? "#0F0F0F" : "#F8F8F8";
  const barColor = isDark ? "#00BFA6" : "#00A884";

  return (
    <ChartCard title="Campanhas Inteligentes" isDark={isDark}>
      <div
        className="rounded-2xl p-4 transition-colors"
        style={{ backgroundColor: bgColor }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              stroke={axisColor}
              tick={{ fill: axisColor }}
              tickLine={{ stroke: axisColor }}
              axisLine={{ stroke: axisColor }}
            />
            <YAxis
              stroke={axisColor}
              tick={{ fill: axisColor }}
              tickLine={{ stroke: axisColor }}
              axisLine={{ stroke: axisColor }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                color: tooltipText,
              }}
              itemStyle={{ color: tooltipText }}
              labelStyle={{ color: tooltipText }}
            />
            <Bar dataKey="value" fill={barColor} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
