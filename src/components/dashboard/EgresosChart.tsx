"use client";

import React from "react";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function EgresosChart() {
    const data = {
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

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div className="card">
            <div className="card-header">
                <h3>Egresos por Categoría</h3>
            </div>
            <div className="chart-container">
                <Doughnut data={data} options={options} />
            </div>
        </div>
    );
}
