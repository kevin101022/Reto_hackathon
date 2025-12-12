"use client";

import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function ChartsSection() {
    // Datos ficticios para el gráfico (como en el script original)
    const flujoData = {
        labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
        datasets: [
            {
                label: "Ingresos",
                data: [1500000, 1600000, 1450000, 1800000, 1550000, 1700000],
                backgroundColor: "rgba(16, 185, 129, 0.8)", // secondary
            },
            {
                label: "Egresos",
                data: [700000, 900000, 850000, 1100000, 750000, 950000],
                backgroundColor: "rgba(37, 99, 235, 0.8)", // primary
            },
        ],
    };

    const flujoOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const egresosData = {
        labels: [
            "Mantenimiento",
            "Servicios",
            "Seguridad",
            "Aseo",
            "Administrativo",
            "Otro",
        ],
        datasets: [
            {
                data: [3500000, 2100000, 1800000, 1200000, 900000, 500000],
                backgroundColor: [
                    "#10b981",
                    "#2563eb",
                    "#f59e0b",
                    "#ef4444",
                    "#a855f7",
                    "#64748b",
                ],
                hoverOffset: 4,
            },
        ],
    };

    const egresosOptions = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <>
            <div className="card">
                <div className="card-header">
                    <h3>Flujo de Caja (Últimos 6 Meses)</h3>
                </div>
                <div className="chart-container">
                    <Bar data={flujoData} options={flujoOptions} />
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3>Egresos por Categoría</h3>
                </div>
                <div className="chart-container">
                    <Doughnut data={egresosData} options={egresosOptions} />
                </div>
            </div>
        </>
    );
}
