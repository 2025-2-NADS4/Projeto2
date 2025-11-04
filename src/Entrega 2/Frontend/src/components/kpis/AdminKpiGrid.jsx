import { Wallet, Users, Timer, Store } from "lucide-react";
import KpiCard from "./KpiCard";

export default function AdminKpiGrid({ resumo, isDark }) {
  return (
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
  );
}
