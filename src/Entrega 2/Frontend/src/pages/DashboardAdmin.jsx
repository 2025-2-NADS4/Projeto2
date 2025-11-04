import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchInsights } from "../api/insightsApi";
import useTheme from "../hooks/useTheme";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import AdminDashboard from "../components/admin/AdminDashboard";

export default function DashboardAdmin() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDark, toggleTheme, themeClasses } = useTheme();

  useEffect(() => {
    setLoading(true);
    fetchInsights(selectedPeriod)
      .then((data) => setInsights(data))
      .catch((err) => console.error("Erro ao buscar insights:", err))
      .finally(() => setLoading(false));
  }, [selectedPeriod]);

  if (loading)
    return (
      <div
        className={`${themeClasses.bg} min-h-screen flex flex-col items-center justify-center`}
      >
        <div className="flex gap-3 items-center">
          <div className="w-3 h-3 rounded-full bg-[#FFD700] animate-bounce"></div>
          <div className="w-3 h-3 rounded-full bg-[#FF8C00] animate-bounce delay-150"></div>
          <div className="w-3 h-3 rounded-full bg-[#00BFA6] animate-bounce delay-300"></div>
        </div>
        <p className={`${themeClasses.muted} mt-4 text-sm`}>
          Carregando painel administrativo...
        </p>
      </div>
    );

  return (
    <motion.div
      key={selectedPeriod}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className={`${themeClasses.bg} ${themeClasses.text} min-h-screen flex flex-col transition-colors duration-500`}
    >
      <Header
        {...{
          isDark,
          toggleTheme,
          selectedPeriod,
          setSelectedPeriod,
          muted: themeClasses.muted,
          border: themeClasses.border,
        }}
      />

      <main className="flex-1 px-8 py-10">
        <AdminDashboard data={insights} isDark={isDark} />
      </main>

      <Footer muted={themeClasses.muted} border={themeClasses.border} />
    </motion.div>
  );
}
