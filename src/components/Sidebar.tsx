"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === "/" && pathname === "/") return "active";
        if (path !== "/" && pathname.startsWith(path)) return "active";
        return "";
    };

    return (
        <aside className="sidebar">
            <Link href="/" className={`nav-item ${isActive("/")}`}>
                Dashboard
            </Link>
            <Link href="/cartera" className={`nav-item ${isActive("/cartera")}`}>
                Gestión de Cartera
            </Link>
            <Link href="/pagos" className={`nav-item ${isActive("/pagos")}`}>
                Pagos y Gastos
            </Link>
            <Link href="/censo" className={`nav-item ${isActive("/censo")}`}>
                Censo de Residentes
            </Link>
            <Link
                href="/configuracion"
                className={`nav-item ${isActive("/configuracion")}`}
                id="navConfig"
            >
                Configuración
            </Link>
        </aside>
    );
}
