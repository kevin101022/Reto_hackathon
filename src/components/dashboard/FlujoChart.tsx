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
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function FlujoChart() {
    const data = {
        labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
        datasets: [
            {
                label: "Ingresos",
                data: [1500000, 1600000, 1450000, 1800000, 1550000, 1700000],
                backgroundColor: "rgba(16, 185, 129, 0.8)",
            },
            {
                label: "Egresos",
                data: [700000, 900000, 850000, 1100000, 750000, 950000],
                backgroundColor: "rgba(37, 99, 235, 0.8)",
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="card">
            <div className="card-header">
                <h3>Flujo de Caja (Últimos 6 Meses)</h3>
            </div>
            <div className="chart-container">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}
