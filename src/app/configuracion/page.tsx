"use client";

import React from "react";
import { useApp } from "../../context/AppContext";

export default function ConfiguracionPage() {
    const { state } = useApp();
    const { config, bitacora } = state;

    return (
        <div className="page-content">
            <div className="page-header">
                <h2>Configuración del Sistema</h2>
                <p>Administración y configuración general</p>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3>Configuración de Cuotas</h3>
                </div>
                <form>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Cuota Mensual Base</label>
                            <input
                                type="number"
                                placeholder="150000"
                                step="1000"
                                required
                                defaultValue={config.cuotaBase}
                            />
                        </div>
                        <div className="form-group">
                            <label>Tasa de Interés Mora (%)</label>
                            <input
                                type="number"
                                placeholder="2.5"
                                step="0.1"
                                defaultValue={config.tasaInteres}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Guardar Configuración
                    </button>
                </form>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3>Usuarios del Sistema</h3>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Rol</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>admin</td>
                            <td>
                                <span className="badge badge-success">Administrador</span>
                            </td>
                            <td>
                                <span className="badge badge-success">Activo</span>
                            </td>
                        </tr>
                        <tr>
                            <td>consulta</td>
                            <td>
                                <span className="badge badge-warning">Solo Lectura</span>
                            </td>
                            <td>
                                <span className="badge badge-success">Activo</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3>Bitácora de Cambios (Últimos 20)</h3>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Usuario</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bitacora.length === 0 ? (
                            <tr>
                                <td colSpan={3} style={{ textAlign: "center" }}>
                                    Sin registros
                                </td>
                            </tr>
                        ) : (
                            bitacora.map((b, i) => (
                                <tr key={i}>
                                    <td>{b.fecha}</td>
                                    <td>{b.usuario}</td>
                                    <td>{b.accion}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
