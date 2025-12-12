"use client";

import React, { useState } from "react";
import { useApp, Transaccion } from "../../context/AppContext";

export default function PagosPage() {
    const { state, addTransaccion, addBitacora, updateApartamento, formatCurrency } = useApp();
    const { apartamentos, transacciones, currentUser } = state;

    const [filtroTransacciones, setFiltroTransacciones] = useState("todas");

    // Form States
    const [pagoApto, setPagoApto] = useState("");
    const [pagoMonto, setPagoMonto] = useState("");
    const [pagoFecha, setPagoFecha] = useState("");
    const [pagoConcepto, setPagoConcepto] = useState("Cuota de administración");
    const [pagoFile, setPagoFile] = useState<File | null>(null);

    const [gastoCategoria, setGastoCategoria] = useState("");
    const [gastoMonto, setGastoMonto] = useState("");
    const [gastoFecha, setGastoFecha] = useState("");
    const [gastoDescripcion, setGastoDescripcion] = useState("");
    const [gastoFile, setGastoFile] = useState<File | null>(null);

    const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("Error leyendo archivo"));
            reader.readAsDataURL(file);
        });
    };

    const showNotification = (msg: string, type: "success" | "danger" = "success") => {
        // Simple custom alert or actual toast implementation.
        // For now, using standard alert is blocking, so maybe just console or simple DOM injection.
        // But since we want "convert", let's use the NotificationContainer in Layout if possible.
        // Actually, Layout has <div id="notificationContainer"></div>.
        // We can interact with it via DOM or (better) Context.
        // For speed, let's use the DOM manipulation from the original logic within useEffect or here.
        const container = document.getElementById("notificationContainer");
        if (!container) return;

        const notification = document.createElement("div");
        notification.className = `notification notification-${type}`;
        notification.textContent = msg;

        container.appendChild(notification);
        setTimeout(() => notification.classList.add("show"), 10);
        setTimeout(() => {
            notification.classList.remove("show");
            notification.addEventListener("transitionend", () => notification.remove());
        }, 4000);
    };

    const handlePagoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pagoApto || !pagoMonto || !pagoFecha) return;

        const monto = parseInt(pagoMonto);
        let comprobante;
        if (pagoFile) {
            const dataUrl = await readFileAsDataURL(pagoFile);
            comprobante = { name: pagoFile.name, type: pagoFile.type, dataUrl };
        }

        const newPago: Transaccion = {
            tipo: "pago",
            fecha: pagoFecha,
            detalle: `${pagoConcepto} (${pagoApto})`,
            monto,
            apto: pagoApto,
            comprobante
        };

        addTransaccion(newPago);

        // Update deuda
        const aptoObj = apartamentos.find(a => a.apto === pagoApto);
        if (aptoObj) {
            const nuevaDeuda = Math.max(0, aptoObj.deuda - monto);
            const nuevoEstado = nuevaDeuda > 0 ? "moroso" : "corriente";
            updateApartamento(pagoApto, { deuda: nuevaDeuda, estado: nuevoEstado });

            addBitacora({
                fecha: new Date().toISOString().split("T")[0],
                usuario: currentUser.username,
                accion: `Pago registrado ${formatCurrency(monto)} para ${pagoApto} - Deuda restante ${formatCurrency(nuevaDeuda)}`
            });

            showNotification(`Pago de ${formatCurrency(monto)} registrado para el Apto ${pagoApto}.`);
        }

        // Reset
        setPagoMonto("");
        setPagoFecha("");
        setPagoFile(null);
    };

    const handleGastoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Validate fields
        const monto = parseInt(gastoMonto);

        let comprobante;
        if (gastoFile) {
            const dataUrl = await readFileAsDataURL(gastoFile);
            comprobante = { name: gastoFile.name, type: gastoFile.type, dataUrl };
        }

        const newGasto: Transaccion = {
            tipo: "gasto",
            fecha: gastoFecha,
            detalle: gastoDescripcion,
            monto,
            categoria: gastoCategoria,
            comprobante
        };

        addTransaccion(newGasto);

        addBitacora({
            fecha: new Date().toISOString().split("T")[0],
            usuario: currentUser.username,
            accion: `Gasto registrado ${formatCurrency(monto)} - ${gastoCategoria}: ${gastoDescripcion}`
        });

        showNotification(`Gasto de ${formatCurrency(monto)} registrado.`, "danger");

        // Reset
        setGastoMonto("");
        setGastoFecha("");
        setGastoDescripcion("");
        setGastoFile(null);
    };

    const filteredTransacciones = transacciones
        .filter(t => filtroTransacciones === "todas" ? true : t.tipo === filtroTransacciones.slice(0, -1)) // 'pagos'->'pago'
    // Sort is irrelevant if already sorted in state, but logic says sort desc
    // Assuming context adds to start (unshift), strict sort might be safer
    // The context adds to front, so they are naturally desc if added sequentially.
    // For mock data, they are provided (we should sort mock data or sort here). 
    // Let's sort here for safety.
    // Actually mock data dates are reliable.

    return (
        <div className="page-content">
            <div className="page-header">
                <h2>Registro de Pagos y Gastos</h2>
                <p>Gestione transacciones del condominio</p>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                    gap: "20px",
                }}
            >
                <div className="card">
                    <div className="card-header">
                        <h3>Registrar Pago</h3>
                    </div>
                    <form onSubmit={handlePagoSubmit}>
                        <div className="form-group">
                            <label>Apartamento</label>
                            <select
                                required
                                value={pagoApto}
                                onChange={(e) => setPagoApto(e.target.value)}
                            >
                                <option value="">Seleccione...</option>
                                {apartamentos.map((a) => (
                                    <option key={a.apto} value={a.apto}>
                                        {a.apto} - {a.propietario}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Monto</label>
                            <input
                                type="number"
                                placeholder="150000"
                                step="1000"
                                required
                                value={pagoMonto}
                                onChange={(e) => setPagoMonto(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Fecha</label>
                            <input
                                type="date"
                                required
                                value={pagoFecha}
                                onChange={(e) => setPagoFecha(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Concepto</label>
                            <input
                                type="text"
                                value={pagoConcepto}
                                onChange={(e) => setPagoConcepto(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Comprobante (imagen o PDF)</label>
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => setPagoFile(e.target.files ? e.target.files[0] : null)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Registrar Pago
                        </button>
                    </form>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3>Registrar Gasto</h3>
                    </div>
                    <form onSubmit={handleGastoSubmit}>
                        <div className="form-group">
                            <label>Categoría</label>
                            <select
                                required
                                value={gastoCategoria}
                                onChange={(e) => setGastoCategoria(e.target.value)}
                            >
                                <option value="">Seleccione...</option>
                                <option value="Mantenimiento">Mantenimiento</option>
                                <option value="Servicios">Servicios Públicos</option>
                                <option value="Seguridad">Seguridad</option>
                                <option value="Aseo">Aseo</option>
                                <option value="Administrativo">Administrativo</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Monto</label>
                            <input
                                type="number"
                                placeholder="50000"
                                step="1000"
                                required
                                value={gastoMonto}
                                onChange={(e) => setGastoMonto(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Fecha</label>
                            <input
                                type="date"
                                required
                                value={gastoFecha}
                                onChange={(e) => setGastoFecha(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Descripción</label>
                            <textarea
                                rows={2}
                                placeholder="Detalle del gasto"
                                required
                                value={gastoDescripcion}
                                onChange={(e) => setGastoDescripcion(e.target.value)}
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label>Comprobante (imagen o PDF)</label>
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) => setGastoFile(e.target.files ? e.target.files[0] : null)}
                            />
                        </div>
                        <button type="submit" className="btn btn-secondary">
                            Registrar Gasto
                        </button>
                    </form>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3>Historial de Transacciones</h3>
                    <select
                        value={filtroTransacciones}
                        onChange={(e) => setFiltroTransacciones(e.target.value)}
                    >
                        <option value="todas">Todas</option>
                        <option value="pagos">Solo Pagos</option>
                        <option value="gastos">Solo Gastos</option>
                    </select>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Tipo</th>
                            <th>Detalle</th>
                            <th>Monto</th>
                            <th>Comprobante</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransacciones.length === 0 ? (
                            <tr><td colSpan={5} style={{ textAlign: "center" }}>No hay transacciones.</td></tr>
                        ) : (
                            filteredTransacciones.map((t, idx) => (
                                <tr key={idx}>
                                    <td>{t.fecha}</td>
                                    <td>
                                        <span className={`badge ${t.tipo === 'pago' ? 'badge-success' : 'badge-danger'}`}>
                                            {t.tipo === 'pago' ? 'Ingreso' : 'Egreso'}
                                        </span>
                                    </td>
                                    <td>{t.detalle}</td>
                                    <td style={{
                                        color: t.tipo === 'pago' ? 'var(--secondary)' : 'var(--danger)',
                                        fontWeight: 600
                                    }}>
                                        {formatCurrency(t.monto)}
                                    </td>
                                    <td>
                                        {t.comprobante ? (
                                            t.comprobante.type.startsWith("image/") ? (
                                                <a href={t.comprobante.dataUrl} target="_blank" rel="noopener noreferrer">
                                                    <img
                                                        src={t.comprobante.dataUrl}
                                                        alt={t.comprobante.name}
                                                        style={{ maxWidth: "80px", maxHeight: "60px", borderRadius: "6px", objectFit: "cover" }}
                                                    />
                                                </a>
                                            ) : (
                                                <a href={t.comprobante.dataUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>
                                                    Ver comprobante
                                                </a>
                                            )
                                        ) : (
                                            <span style={{ color: "var(--text-light)" }}>-</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
