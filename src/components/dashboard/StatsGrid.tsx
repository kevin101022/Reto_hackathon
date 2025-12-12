"use client";

import React, { useMemo } from "react";
import { useApp } from "../../context/AppContext";

export default function StatsGrid() {
    const { state, formatCurrency } = useApp();
    const { transacciones, apartamentos } = state;

    const stats = useMemo(() => {
        const totalRecaudado = transacciones
            .filter((t) => t.tipo === "pago")
            .reduce((sum, t) => sum + t.monto, 0);

        const totalGastos = transacciones
            .filter((t) => t.tipo === "gasto")
            .reduce((sum, t) => sum + t.monto, 0);

        const totalPendiente = apartamentos.reduce((sum, a) => sum + a.deuda, 0);

        const aptosMorosos = apartamentos.filter(
            (a) => a.estado === "moroso"
        ).length;

        return { totalRecaudado, totalGastos, totalPendiente, aptosMorosos };
    }, [transacciones, apartamentos]);

    return (
        <div className="stats-grid">
            <div className="stat-card success">
                <div className="label">Total Recaudado</div>
                <div className="value" id="statRecaudado">
                    {formatCurrency(stats.totalRecaudado)}
                </div>
            </div>
            <div className="stat-card">
                <div className="label">Total Gastos</div>
                <div className="value" id="statGastos">
                    {formatCurrency(stats.totalGastos)}
                </div>
            </div>
            <div className="stat-card warning">
                <div className="label">Cartera Pendiente</div>
                <div className="value" id="statPendiente">
                    {formatCurrency(stats.totalPendiente)}
                </div>
            </div>
            <div className="stat-card danger">
                <div className="label">Apartamentos Morosos</div>
                <div className="value" id="statMorosos">
                    {stats.aptosMorosos}
                </div>
            </div>
        </div>
    );
}
