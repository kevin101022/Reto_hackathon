"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Types based on the legacy data structure
export interface User {
  username: string;
  role: string;
  name: string;
}

export interface Config {
  cuotaBase: number;
  tasaInteres: number;
}

export interface Apartamento {
  apto: string;
  propietario: string;
  telefono: string;
  email: string;
  residentes: number;
  cuota: number;
  estado: "corriente" | "moroso";
  deuda: number;
}

export interface Transaccion {
  tipo: "pago" | "gasto";
  fecha: string;
  detalle: string;
  monto: number;
  apto?: string; // Optional because 'gasto' doesn't have it
  categoria?: string; // Optional because 'pago' doesn't have it
  comprobante?: {
    name: string;
    type: string;
    dataUrl: string;
  };
}

export interface Vehiculo {
  apto: string;
  tipo: string;
  marca: string;
  placa: string;
}

export interface BitacoraItem {
  fecha: string;
  usuario: string;
  accion: string;
}

export interface AppState {
  currentUser: User;
  config: Config;
  apartamentos: Apartamento[];
  transacciones: Transaccion[];
  vehiculos: Vehiculo[];
  bitacora: BitacoraItem[];
}

interface AppContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  addTransaccion: (t: Transaccion) => void;
  addBitacora: (b: BitacoraItem) => void;
  updateApartamento: (apto: string, updates: Partial<Apartamento>) => void;
  formatCurrency: (amount: number) => string;
}

// Initial Mock Data
const initialData: AppState = {
  currentUser: {
    username: "admin",
    role: "Administrador",
    name: "Administrador",
  },
  config: {
    cuotaBase: 150000,
    tasaInteres: 2.5,
  },
  apartamentos: [
    {
      apto: "A101",
      propietario: "Ana Pérez",
      telefono: "3101234567",
      email: "a.perez@email.com",
      residentes: 3,
      cuota: 150000,
      estado: "corriente",
      deuda: 0,
    },
    {
      apto: "A102",
      propietario: "Carlos Gómez",
      telefono: "3209876543",
      email: "c.gomez@email.com",
      residentes: 2,
      cuota: 150000,
      estado: "moroso",
      deuda: 300000,
    },
    {
      apto: "B201",
      propietario: "Elena Torres",
      telefono: "3005551122",
      email: "e.torres@email.com",
      residentes: 4,
      cuota: 150000,
      estado: "corriente",
      deuda: 0,
    },
    {
      apto: "B202",
      propietario: "David Reyes",
      telefono: "3157778899",
      email: "d.reyes@email.com",
      residentes: 1,
      cuota: 150000,
      estado: "moroso",
      deuda: 450000,
    },
    {
      apto: "C301",
      propietario: "Felipe Castro",
      telefono: "3114443322",
      email: "f.castro@email.com",
      residentes: 5,
      cuota: 150000,
      estado: "corriente",
      deuda: 0,
    },
    {
      apto: "C302",
      propietario: "Gloria Ruiz",
      telefono: "3016669988",
      email: "g.ruiz@email.com",
      residentes: 2,
      cuota: 150000,
      estado: "moroso",
      deuda: 150000,
    },
  ],
  transacciones: [
    {
      tipo: "pago",
      fecha: "2025-10-25",
      detalle: "Cuota A101",
      monto: 150000,
      apto: "A101",
    },
    {
      tipo: "gasto",
      fecha: "2025-10-24",
      detalle: "Mantenimiento ascensores",
      monto: 500000,
      categoria: "Mantenimiento",
    },
    {
      tipo: "pago",
      fecha: "2025-09-20",
      detalle: "Cuota B201",
      monto: 150000,
      apto: "B201",
    },
    {
      tipo: "gasto",
      fecha: "2025-09-15",
      detalle: "Factura de agua",
      monto: 350000,
      categoria: "Servicios",
    },
    {
      tipo: "pago",
      fecha: "2025-08-10",
      detalle: "Cuota C301",
      monto: 150000,
      apto: "C301",
    },
  ],
  vehiculos: [
    { apto: "A101", tipo: "Automóvil", marca: "Mazda", placa: "ABC123" },
    { apto: "A102", tipo: "Motocicleta", marca: "Yamaha", placa: "DEF45G" },
    { apto: "B201", tipo: "Automóvil", marca: "Toyota", placa: "HIJ789" },
  ],
  bitacora: [
    { fecha: "2025-10-25", usuario: "admin", accion: "Registro de pago A101" },
    {
      fecha: "2025-10-24",
      usuario: "admin",
      accion: "Registro de gasto Mantenimiento",
    },
    {
      fecha: "2025-10-01",
      usuario: "admin",
      accion: "Cambio de cuota base a $150.000",
    },
  ],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialData);

  const addTransaccion = (t: Transaccion) => {
    setState((prev) => ({
      ...prev,
      transacciones: [t, ...prev.transacciones],
    }));
  };

  const addBitacora = (b: BitacoraItem) => {
    setState((prev) => ({
      ...prev,
      bitacora: [b, ...prev.bitacora],
    }));
  };

  const updateApartamento = (aptoId: string, updates: Partial<Apartamento>) => {
    setState((prev) => ({
      ...prev,
      apartamentos: prev.apartamentos.map((a) =>
        a.apto === aptoId ? { ...a, ...updates } : a
      ),
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setState,
        addTransaccion,
        addBitacora,
        updateApartamento,
        formatCurrency,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
