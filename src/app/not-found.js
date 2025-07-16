"use client"
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-950 w-screen h-screen">
      <div className=" 8 py-10 max-w-sm w-full text-center flex flex-col items-center gap-6">
        <AlertCircle className="h-14 w-14 text-emerald-400 mb-2" />
        <h1 className="text-2xl font-bold text-white">Página no encontrada</h1>
        <p className="text-zinc-400 text-base">La ruta que intentaste visitar no existe o fue movida.</p>
      </div>
    </div>
  );
}