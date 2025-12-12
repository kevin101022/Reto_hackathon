"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";

export default function CarteraPage() {
    const { state, formatCurrency } = useApp();
    const { apartamentos, transacciones } = state;

    const [filtroEstado, setFiltroEstado] = useState("todos");
    const [filtroApto, setFiltroApto] = useState("todos");
    const [filtroTorre, setFiltroTorre] = useState("todas");
    const [filtroDesde, setFiltroDesde] = useState("");
    const [filtroHasta, setFiltroHasta] = useState("");

    const filteredCartera = useMemo(() => {
        return apartamentos.filter((apto) => {
            // Filter by state
            if (filtroEstado !== "todos" && apto.estado !== filtroEstado)
                return false;

            // Filter by apto
            if (filtroApto !== "todos" && apto.apto !== filtroApto) return false;

            // Filter by torre (first char)
            if (filtroTorre !== "todas" && apto.apto.charAt(0) !== filtroTorre)
                return false;

            // Date filtering applies to "Last Payment" logic, which is tricky to filter the *apartment* list by.
            // The original script filtered the rows if the last payment wasn't in range.
            // Let's replicate that logic inside the map/render or here.
            // For efficiency, we'll check it here if dates are set.
            if (filtroDesde || filtroHasta) {
                // Find last payment
                const pagosApto = transacciones
                    .filter((t) => t.tipo === "pago" && t.apto === apto.apto)
                    .map((t) => new Date(t.fecha));

                if (pagosApto.length === 0) return false; // "Sin pagos" usually excluded by date filter in original logic? 
                // Original logic: if "Sin pagos", remove.

                const ultimo = new Date(Math.max(...pagosApto.map((d) => d.getTime())));

                if (filtroDesde && ultimo < new Date(filtroDesde)) return false;
                if (filtroHasta && ultimo > new Date(filtroHasta)) return false;
            }

            return true;
        });
    }, [
        apartamentos,
        transacciones,
        filtroEstado,
        filtroApto,
        filtroTorre,
        filtroDesde,
        filtroHasta,
    ]);

    // Derived lists for selects
    const torres = useMemo(() => {
        const t = new Set(apartamentos.map((a) => a.apto.charAt(0)));
        return Array.from(t).sort();
    }, [apartamentos]);

    return (
        <div className="page-content">
            <div className="page-header">
                <h2>Gestión de Cartera</h2>
                <p>Control de pagos y morosidad</p>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3>Estado de Cartera por Apartamento</h3>
                    <div className="filters-cartera">
                        <select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                        >
                            <option value="todos">Todos</option>
                            <option value="corriente">Al Corriente</option>
                            <option value="moroso">Morosos</option>
                        </select>

                        <select
                            value={filtroApto}
                            onChange={(e) => setFiltroApto(e.target.value)}
                        >
                            <option value="todos">Todos los Aptos</option>
                            {apartamentos.map((a) => (
                                <option key={a.apto} value={a.apto}>
                                    {a.apto} - {a.propietario}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filtroTorre}
                            onChange={(e) => setFiltroTorre(e.target.value)}
                        >
                            <option value="todas">Todas las Torres</option>
                            {torres.map((t) => (
                                <option key={t} value={t}>
                                    Torre {t}
                                </option>
                            ))}
                        </select>

                        <input
                            type="date"
                            value={filtroDesde}
                            onChange={(e) => setFiltroDesde(e.target.value)}
                        />
                        <input
                            type="date"
                            value={filtroHasta}
                            onChange={(e) => setFiltroHasta(e.target.value)}
                        />
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Apto</th>
                            <th>Propietario</th>
                            <th>Cuota Mensual</th>
                            <th>Pagado</th>
                            <th>Pendiente</th>
                            <th>Meses Adeudados</th>
                            <th>Estado</th>
                            <th>Último Pago</th>
                            <th>Próximo Pago</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCartera.length === 0 ? (
                            <tr>
                                <td colSpan={9} style={{ textAlign: "center" }}>
                                    No se encontraron resultados
                                </td>
                            </tr>
                        ) : (
                            filteredCartera.map((apto) => {
                                const mesesAdeudados =
                                    apto.cuota > 0 && apto.deuda > 0
                                        ? Math.ceil(apto.deuda / apto.cuota)
                                        : 0;

                                // Pagado simulado
                                const pagadoSimulado = apto.estado === "corriente" ? apto.cuota * 10 : 0;

                                // Dates logic
                                const pagosApto = transacciones
                                    .filter((t) => t.tipo === "pago" && t.apto === apto.apto)
                                    .map((t) => new Date(t.fecha));

                                let ultimoPagoText = "Sin pagos";
                                let proximoPagoText = "—";

                                if (pagosApto.length > 0) {
                                    const ultimo = new Date(Math.max(...pagosApto.map((d) => d.getTime())));
                                    // Format YYYY-MM-DD
                                    ultimoPagoText = ultimo.toISOString().split("T")[0];

                                    const prox = new Date(ultimo);
                                    prox.setMonth(prox.getMonth() + 1);
                                    proximoPagoText = prox.toISOString().split("T")[0];
                                }

                                return (
                                    <tr key={apto.apto}>
                                        <td>{apto.apto}</td>
                                        <td>{apto.propietario}</td>
                                        <td>{formatCurrency(apto.cuota)}</td>
                                        <td>{formatCurrency(pagadoSimulado)}</td>
                                        <td>{formatCurrency(apto.deuda)}</td>
                                        <td>{mesesAdeudados > 0 ? mesesAdeudados : "-"}</td>
                                        <td>
                                            <span
                                                className={`badge ${apto.estado === "corriente"
                                                        ? "badge-success"
                                                        : "badge-danger"
                                                    }`}
                                            >
                                                {apto.estado === "corriente"
                                                    ? "Al Corriente"
                                                    : "Moroso"}
                                            </span>
                                        </td>
                                        <td>{ultimoPagoText}</td>
                                        <td>{proximoPagoText}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
