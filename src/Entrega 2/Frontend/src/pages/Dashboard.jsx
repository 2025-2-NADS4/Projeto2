import React from "react";
import DashboardAdmin from "./DashboardAdmin";
import DashboardClient from "./DashboardClient";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.role === "admin" ? <DashboardAdmin /> : <DashboardClient />;
}
