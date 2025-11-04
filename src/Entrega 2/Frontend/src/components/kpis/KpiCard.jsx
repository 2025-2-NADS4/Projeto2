export default function KpiCard({ icon, label, value, isDark }) {
  return (
    <div className={`p-5 rounded-2xl flex flex-col items-center text-center shadow-md border ${isDark ? "bg-[#1C1C1C] border-[#222]" : "bg-white border-gray-200"}`}>
      <div className="mb-2">{icon}</div>
      <p className={`text-sm ${isDark ? "text-[#B0B0B0]" : "text-gray-600"}`}>{label}</p>
      <h3 className={`text-2xl font-bold ${isDark ? "text-white" : "text-[#222]"}`}>{value}</h3>
    </div>
  );
}
