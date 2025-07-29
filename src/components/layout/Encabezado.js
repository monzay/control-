"use client"
import { Menu, X, LogIn, UserPlus, EyeOff, Eye } from "lucide-react"
import { diasTotales } from "@/Varibles"
import { useEffect, useState } from "react"

export default function Encabezado({
  horaActual,
  diaActualDelAnio,
  menuAbierto,
  setMenuAbierto,
  mostrarTareas,
  setMostrarTareas,
}) {
  const [autenticado, setAutenticado] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken")
      setAutenticado(!!token)
    }
  }, [])

  return (
    <header className="sticky top-0 z-30 bg-black/30 backdrop-filter backdrop-blur-md border-b border-white/5 py-3 px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="p-1.5 rounded-full transition-colors duration-200 text-white/70 hover:text-white"
        >
          {menuAbierto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <h1 className="text-lg font-medium text-white">Control de Hábitos</h1>
      </div>
      <div className="flex items-center gap-4">
        {!autenticado && (
          <>
            <button
              className="px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden md:inline">Iniciar sesión</span>
            </button>
            <button
              className="px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-white/10 hover:bg-white/20 text-white flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              <span className="hidden md:inline">Registrarse</span>
            </button>
          </>
        )}
        <button
          onClick={() => setMostrarTareas(!mostrarTareas)}
          className="p-1.5 rounded-full transition-colors duration-200 text-white/70 hover:text-white"
          title={mostrarTareas ? "Ocultar tareas" : "Mostrar tareas"}
        >
          {mostrarTareas ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
        <div className="text-xs text-white/50 hidden md:block">
          Día {diaActualDelAnio}/{diasTotales}
        </div>
      </div>
    </header>
  )
}