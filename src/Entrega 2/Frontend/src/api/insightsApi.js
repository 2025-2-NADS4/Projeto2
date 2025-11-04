// src/api/insightsApi.js
const API_BASE = "http://localhost:3000/api/dashboard";

export async function fetchInsights(period = "30d", filters = {}) {
  const token = localStorage.getItem("token");
  const params = new URLSearchParams({ ...filters });
  const res = await fetch(`${API_BASE}/insights/${period}?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Falha ao buscar insights");
  return res.json();
}

export async function fetchAlerts(period = "30d") {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/alerts/${period}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Falha ao buscar alertas");
  return res.json();
}

export async function exportReport(type = "csv", period = "30d", filters = {}) {
  const token = localStorage.getItem("token");
  const params = new URLSearchParams({ ...filters, period, type });
  const res = await fetch(`${API_BASE}/export?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Falha ao exportar relatório");

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `relatorio_${period}.${type === "xlsx" ? "xlsx" : type}`;
  a.click();
  window.URL.revokeObjectURL(url);
}
