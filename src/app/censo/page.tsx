"use client";

import React, { useState } from "react";
import { useApp } from "../../context/AppContext";

export default function CensoPage() {
    const { state } = useApp();
    const { apartamentos, vehiculos } = state;

    const [contactModalOpen, setContactModalOpen] = useState(false);
    const [vehicleModalOpen, setVehicleModalOpen] = useState(false);

    // Mocks for modal functionality - in a real app these would be connected to update handlers
    // For the purpose of "convert", we'll just show the UI structure and open/close.

    return (
        <div className="page-content">
            <div className="page-header">
                <h2>Censo de Residentes</h2>
                <p>Base de datos de propietarios y vehículos</p>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3>Propietarios y Residentes</h3>
                    <div>
                        <button
                            className="btn-small btn-primary"
                            onClick={() => setContactModalOpen(true)}
                        >
                            Agregar
                        </button>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Apto</th>
                            <th>Propietario</th>
                            <th>Teléfono</th>
                            <th>Email</th>
                            <th>Residentes</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {apartamentos.map((apto) => (
                            <tr key={apto.apto}>
                                <td>{apto.apto}</td>
                                <td>{apto.propietario}</td>
                                <td>{apto.telefono}</td>
                                <td>{apto.email}</td>
                                <td>{apto.residentes}</td>
                                <td>
                                    <button className="btn-small btn-secondary">Editar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3>Registro de Vehículos</h3>
                    <div>
                        <button
                            className="btn-small btn-primary"
                            onClick={() => setVehicleModalOpen(true)}
                        >
                            Agregar
                        </button>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Apto</th>
                            <th>Tipo</th>
                            <th>Marca</th>
                            <th>Placa</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehiculos.map((v, i) => (
                            <tr key={i}>
                                <td>{v.apto}</td>
                                <td>{v.tipo}</td>
                                <td>{v.marca}</td>
                                <td>{v.placa}</td>
                                <td>
                                    <button className="btn-small btn-danger">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {contactModalOpen && (
                <div className="modal active">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Agregar Residente</h3>
                            <button
                                className="btn-close"
                                onClick={() => setContactModalOpen(false)}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); setContactModalOpen(false); }}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Apartamento (ej: A101)</label>
                                    <input type="text" required />
                                </div>
                                <div className="form-group">
                                    <label>Propietario</label>
                                    <input type="text" required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Teléfono</label>
                                    <input type="text" />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Residentes</label>
                                    <input type="number" min="0" />
                                </div>
                                <div className="form-group">
                                    <label>Cuota</label>
                                    <input type="number" step="1000" />
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                                <button type="submit" className="btn btn-primary">
                                    Guardar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setContactModalOpen(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {vehicleModalOpen && (
                <div className="modal active">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Agregar Vehículo</h3>
                            <button
                                className="btn-close"
                                onClick={() => setVehicleModalOpen(false)}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); setVehicleModalOpen(false); }}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Apartamento</label>
                                    <input type="text" required />
                                </div>
                                <div className="form-group">
                                    <label>Tipo</label>
                                    <input
                                        type="text"
                                        placeholder="Automóvil / Motocicleta"
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Marca</label>
                                    <input type="text" />
                                </div>
                                <div className="form-group">
                                    <label>Placa</label>
                                    <input type="text" required />
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                                <button type="submit" className="btn btn-primary">
                                    Guardar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setVehicleModalOpen(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
