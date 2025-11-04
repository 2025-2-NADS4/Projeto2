import { Wallet, Users, TrendingUp, Target, RefreshCcw } from "lucide-react";
import KpiCard from "./KpiCard";

export default function KpiGrid({ resumo, isDark }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
      <KpiCard icon={<Wallet className="text-[#FFD700]" />} label="Ticket Médio" value={`R$ ${resumo.ticket_medio}`} isDark={isDark} />
      <KpiCard icon={<TrendingUp className="text-[#00BFA6]" />} label="Receita Total" value={`R$ ${resumo.receita_total?.toLocaleString("pt-BR")}`} isDark={isDark} />
      <KpiCard icon={<Users className="text-[#FFD700]" />} label="Clientes Ativos" value={resumo.clientes_ativos} isDark={isDark} />
      <KpiCard icon={<RefreshCcw className="text-[#00BFA6]" />} label="Clientes Reativados" value={resumo.clientes_reativados || 0} isDark={isDark} />
      <KpiCard icon={<Target className="text-red-400" />} label="Taxa de Inatividade" value={`${resumo.taxa_inatividade}%`} isDark={isDark} />
    </section>
  );
}
