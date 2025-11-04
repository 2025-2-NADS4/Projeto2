import { Sparkles } from "lucide-react";

export default function AdminSuggestions({ data, isDark }) {
  return (
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
  );
}
