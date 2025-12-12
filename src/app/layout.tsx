import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "../context/AppContext";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export const metadata: Metadata = {
  title: "CondoManager Pro - Balcones de Salesia",
  description: "Sistema de gestión de condominios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <AppProvider>
          <div id="notificationContainer"></div>
          <div id="appContainer" className="app-container active">
            <Header />
            <div className="main-content">
              <Sidebar />
              <main className="content-area">{children}</main>
            </div>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
