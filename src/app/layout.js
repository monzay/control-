import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Encabezado from "@/components/layout/Encabezado";
import { useContext } from "react";
import { ContextoHeaderHorizontal } from "@/Context/ProviderHeaderHotizontal";
import MensajeDiasRestantes from "@/components/ui/MensajeDiasRestantes";
import { PerfilProvider } from "@/Context/PerfilContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Control",
  description: "esta app fue creado con el unico proposito que podas tener el control de tu vida",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MensajeDiasRestantes />
        <PerfilProvider>
          {children}
        </PerfilProvider>
      </body>
    </html>
  );
}
