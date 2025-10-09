import { Edit, Trash2, Clock, Calendar, Info, Check } from "lucide-react"
import IconoModulo from "@/function/IconoModulo.js"
export default function TaskCard({
  tarea,
  onEdit,
  onDelete,
  onToggleComplete,
  className = "",
}) {
  // Safety check to prevent rendering if tarea is invalid
  if (!tarea || typeof tarea !== 'object') {
    return null;
  }

  return (
    <div
      className={`backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-4 shadow-lg flex flex-col ${
        tarea.completada ? "border-emerald-500/30" : ""
      } ${className}`}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {tarea.tipo && IconoModulo.obtenerIconoTarea(tarea.tipo)}
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${IconoModulo.obtenerClaseColorPrioridad(tarea.prioridad)}`}
            >
              P{tarea.prioridad}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(tarea)}
              className="text-white/40 hover:text-emerald-400 p-1 rounded-full transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(tarea.id)}
              className="text-white/40 hover:text-emerald-400 p-1 rounded-full transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <h3
          className={`text-lg font-medium mb-1 ${tarea.completada ? "line-through text-white/50" : ""}`}
        >
          {tarea.titulo}
        </h3>

        {tarea.descripcion && (
          <p className="text-sm text-white/70 mb-3">{tarea.descripcion}</p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between">
          <div>
            {tarea.tipo === "habito" && (
              <div className="text-xs text-white/50 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {tarea.racha ? `Racha: ${tarea.racha} días` : "Sin racha"}
              </div>
            )}

            {tarea.fechaVencimiento && (
              <div className="text-xs text-white/50 flex items-center gap-1 mt-1">
                <Calendar className="h-3 w-3" />
                Vence: {tarea.fechaVencimiento}
              </div>
            )}

            {tarea.fechaFin && (
              <div className="text-xs text-white/50 flex items-center gap-1 mt-1">
                <Info className="h-3 w-3" />
                Finaliza: {tarea.fechaFin}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (!tarea.completada) {
                onToggleComplete(tarea.id)
              }
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              tarea.completada
                ? "bg-emerald-600 text-white"
                : "border border-white/30 hover:bg-white/10"
            }`}
            disabled={tarea.completada}
          >
            {tarea.completada && <Check className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  )
} 