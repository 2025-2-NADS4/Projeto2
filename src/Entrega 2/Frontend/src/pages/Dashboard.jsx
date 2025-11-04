import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchInsights } from "../api/insightsApi";
import useTheme from "../hooks/useTheme";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import KpiGrid from "../components/kpis/KpiGrid";
import RevenueChart from "../components/charts/RevenueChart";
import CampaignsChart from "../components/charts/CampaignsChart";
import ComparisonTable from "../components/table/ComparisonTable";
import CampaignInsights from "../components/insights/CampaignInsights";
import AdminDashboard from "../components/admin/AdminDashboard"; // 👈 novo componente
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  // se não tiver token, redireciona pro login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDark, toggleTheme, themeClasses } = useTheme();

  // busca dados do backend (diferentes para admin/cliente)
  useEffect(() => {
    setLoading(true);
    fetchInsights(selectedPeriod)
      .then((data) => setInsights(data))
      .catch((err) => console.error("Erro ao buscar insights:", err))
      .finally(() => setLoading(false));
  }, [selectedPeriod]);

  // tela de carregamento
  if (loading)
    return (
      <motion.div
        key="loading"
        initial={{ opacity: 0, scale: 0.98, filter: "blur(5px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 0.98, filter: "blur(5px)" }}
        transition={{ duration: 0.4 }}
        className={`${themeClasses.bg} min-h-screen flex flex-col items-center justify-center`}
      >
        <div className="flex gap-3 items-center">
          <div className="w-3 h-3 rounded-full bg-[#FFD700] animate-bounce"></div>
          <div className="w-3 h-3 rounded-full bg-[#FF8C00] animate-bounce delay-150"></div>
          <div className="w-3 h-3 rounded-full bg-[#00BFA6] animate-bounce delay-300"></div>
        </div>
        <p className={`${themeClasses.muted} mt-4 text-sm`}>
          Carregando dados...
        </p>
      </motion.div>
    );

  // dashboard
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedPeriod}
        initial={{ opacity: 0, y: 15, scale: 0.98, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, scale: 0.98, filter: "blur(8px)" }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1],
        }}
        className={`${themeClasses.bg} ${themeClasses.text} min-h-screen flex flex-col transition-colors duration-500`}
      >
        <Header
          {...{
            isDark,
            toggleTheme,
            selectedPeriod,
            setSelectedPeriod,
            restaurant: insights.restaurante,
            muted: themeClasses.muted,
            border: themeClasses.border,
          }}
        />

        <main className="flex-1 px-8 py-10">
          {/* 🔀 alterna entre dashboards */}
          {isAdmin ? (
            <AdminDashboard data={insights} isDark={isDark} />
          ) : (
            <>
              <KpiGrid resumo={insights.resumo_geral} isDark={isDark} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                <CampaignsChart
                  data={insights.campanhas_inteligentes}
                  isDark={isDark}
                />
                <CampaignInsights
                  insights={insights.campanha_insights}
                  recomendacoes={insights.recomendacoes}
                  isDark={isDark}
                />
                <div className="lg:col-span-2">
                  <RevenueChart
                    data={insights.previsao_receita}
                    isDark={isDark}
                  />
                </div>
              </div>

              <ComparisonTable resumo={insights.resumo_geral} isDark={isDark} />
            </>
          )}
        </main>

        <Footer muted={themeClasses.muted} border={themeClasses.border} />
      </motion.div>
    </AnimatePresence>
  );
}
