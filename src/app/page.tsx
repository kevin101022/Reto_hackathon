import React from "react";
import StatsGrid from "../components/dashboard/StatsGrid";
import FlujoChart from "../components/dashboard/FlujoChart";
import EgresosChart from "../components/dashboard/EgresosChart";
import MorososTable from "../components/dashboard/MorososTable";
import ReportsGrid from "../components/dashboard/ReportsGrid";

export default function Dashboard() {
  return (
    <div id="pageDashboard" className="page-content">
      <div className="page-header">
        <h2>Dashboard General</h2>
        <p>Vista general del condominio</p>
      </div>

      <StatsGrid />

      {/* Flujo de caja full width */}
      <FlujoChart />

      {/* Grid for Egresos and Morosos */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "20px",
        }}
      >
        <EgresosChart />
        <MorososTable />
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3 style={{ fontSize: "20px", marginBottom: "20px" }}>
          Reportes y Exportación
        </h3>
        <ReportsGrid />
      </div>
    </div>
  );
}
