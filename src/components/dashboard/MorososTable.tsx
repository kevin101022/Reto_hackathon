"use client";

import React from "react";
import { useApp } from "../../context/AppContext";

export default function MorososTable() {
    const { state, formatCurrency } = useApp();
    const { apartamentos } = state;

    const topMorosos = apartamentos
        .filter((a) => a.deuda > 0)
        .sort((a, b) => b.deuda - a.deuda)
        .slice(0, 5);

    return (
        <div className="card">
            <div className="card-header">
                <h3>Top 5 Morosos</h3>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Apto</th>
                        <th>Propietario</th>
                        <th>Deuda</th>
                    </tr>
                </thead>
                <tbody>
                    {topMorosos.length === 0 ? (
                        <tr>
                            <td colSpan={3} style={{ textAlign: "center" }}>
                                No hay apartamentos morosos.
                            </td>
                        </tr>
                    ) : (
                        topMorosos.map((apto) => (
                            <tr key={apto.apto}>
                                <td>{apto.apto}</td>
                                <td>{apto.propietario}</td>
                                <td>{formatCurrency(apto.deuda)}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
