import { Menu, X, LogIn, UserPlus, EyeOff, Eye, Flame } from "lucide-react"
import { diasTotales } from "@/Varibles"

export default function Encabezado({
  horaActual,
  diaActualDelAnio,
  menuAbierto,
  setMenuAbierto,
  mostrarTareas,
  setMostrarTareas,
  rachaActual = 0,
}) {
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
        {/* Mostrar racha del usuario */}
        {rachaActual > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/30">
            <Flame className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">
              {rachaActual} {rachaActual === 1 ? "día" : "días"}
            </span>
          </div>
        )}
        <button
          onClick={() => false }
          className="px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
        >
          <LogIn className="h-4 w-4" />
          <span className="hidden md:inline">Iniciar sesión</span>
        </button>
        <button
          onClick={() => false}
          className="px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-white/10 hover:bg-white/20 text-white flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          <span className="hidden md:inline">Registrarse</span>
        </button>
        <button
          onClick={() => setMostrarTareas(!mostrarTareas)}
          className="p-1.5 rounded-full transition-colors duration-200 text-white/70 hover:text-white"
          title={mostrarTareas ? "Ocultar tareas" : "Mostrar tareas"}
        >
          {mostrarTareas ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
        <div className="text-xs text-white/50 hidden md:block">
          Día {diaActualDelAnio || 1}/{diasTotales}
        </div>
      </div>
    </header>
  )
}