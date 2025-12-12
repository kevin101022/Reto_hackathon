"use client";

import React from "react";
import { jsPDF } from "jspdf";

export default function ReportsGrid() {
    const exportarReporte = (tipo: string) => {
        // Basic implementation of PDF export using jsPDF
        const doc = new jsPDF();
        doc.text(`Reporte de ${tipo.toUpperCase()}`, 10, 10);
        doc.text("Este es un reporte generado automáticamente.", 10, 20);
        doc.save(`reporte_${tipo}.pdf`);
    };

    const exportarRespaldo = () => {
        // Generate JSON backup logic
        alert("Respaldo descargado como JSON (simulado)");
    };

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
            }}
        >
            <div className="card">
                <h3 style={{ marginBottom: "15px" }}>Estado de Cartera</h3>
                <p style={{ color: "var(--text-light)", marginBottom: "20px" }}>
                    Reporte completo de cartera por apartamento
                </p>
                <button
                    className="btn btn-primary"
                    onClick={() => exportarReporte("cartera")}
                >
                    Exportar PDF
                </button>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: "15px" }}>Flujo de Caja</h3>
                <p style={{ color: "var(--text-light)", marginBottom: "20px" }}>
                    Ingresos y egresos del período
                </p>
                <button
                    className="btn btn-primary"
                    onClick={() => exportarReporte("flujo")}
                >
                    Exportar PDF
                </button>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: "15px" }}>Egresos por Categoría</h3>
                <p style={{ color: "var(--text-light)", marginBottom: "20px" }}>
                    Análisis de gastos por rubro
                </p>
                <button
                    className="btn btn-primary"
                    onClick={() => exportarReporte("egresos")}
                >
                    Exportar PDF
                </button>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: "15px" }}>Morosidad</h3>
                <p style={{ color: "var(--text-light)", marginBottom: "20px" }}>
                    Listado de apartamentos morosos
                </p>
                <button
                    className="btn btn-primary"
                    onClick={() => exportarReporte("morosos")}
                >
                    Exportar PDF
                </button>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: "15px" }}>Censo Completo</h3>
                <p style={{ color: "var(--text-light)", marginBottom: "20px" }}>
                    Base de datos de residentes y vehículos
                </p>
                <button
                    className="btn btn-primary"
                    onClick={() => exportarReporte("censo")}
                >
                    Exportar PDF
                </button>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: "15px" }}>Respaldo Completo</h3>
                <p style={{ color: "var(--text-light)", marginBottom: "20px" }}>
                    Exportar todos los datos del sistema
                </p>
                <button className="btn btn-secondary" onClick={exportarRespaldo}>
                    Descargar Backup JSON
                </button>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: "15px" }}>
                    Estado de Cuenta por Apartamento
                </h3>
                <p style={{ color: "var(--text-light)", marginBottom: "20px" }}>
                    Generar estado de cuenta detallado por apartamento.
                </p>
                <button
                    className="btn btn-primary"
                    onClick={() => exportarReporte("estado_cuenta_apto")}
                >
                    Generar Estado de Cuenta
                </button>
            </div>
        </div>
    );
}
