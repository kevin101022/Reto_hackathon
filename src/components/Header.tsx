"use client";

import React from "react";
import { useApp } from "../context/AppContext";

export default function Header() {
    const { state } = useApp();
    const { currentUser } = state;

    const handleLogout = () => {
        // Simulating logout as in original script
        alert("Sesión cerrada (simulado). Tendrías que volver a la pantalla de login.");
        window.location.reload();
    };

    return (
        <header className="header">
            <div className="header-left">
                <h1>CondoManager Pro</h1>
                <p>Balcones de Salesia</p>
            </div>
            <div className="header-right">
                <div className="user-info">
                    <div className="name" id="userName">
                        {currentUser.name}
                    </div>
                    <div className="role" id="userRole">
                        {currentUser.role}
                    </div>
                </div>
                <button className="btn-logout" onClick={handleLogout}>
                    Cerrar Sesión
                </button>
            </div>
        </header>
    );
}
