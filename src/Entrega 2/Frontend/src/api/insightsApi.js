const BASE_URL = "http://localhost:3000/api/dashboard";

const getToken = () => localStorage.getItem("token");
const getHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

export async function fetchInsights(period = "30d", filters = {}) {
  const params = new URLSearchParams(filters);
  try {
    const response = await fetch(`${BASE_URL}/insights/${period}?${params}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Falha ao buscar insights.");
    return await response.json();
  } catch (error) {
    console.error("❌ fetchInsights error:", error);
    throw error;
  }
}

export async function fetchAlerts(period = "30d") {
  try {
    const response = await fetch(`${BASE_URL}/alerts/${period}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Falha ao buscar alertas.");
    return await response.json();
  } catch (error) {
    console.error("❌ fetchAlerts error:", error);
    throw error;
  }
}

export async function exportReport(type = "csv", period = "30d", filters = {}) {
  const params = new URLSearchParams({ ...filters, type, period });
  try {
    const response = await fetch(`${BASE_URL}/export?${params}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Falha ao exportar relatório.");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio_${period}.${type}`;
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("❌ exportReport error:", error);
    throw error;
  }
}
