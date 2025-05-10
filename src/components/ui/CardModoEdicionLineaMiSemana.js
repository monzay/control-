/**
 * Componente que representa una fila en modo edición para una tarea de Mi Semana
 * @param {Object} editandoEnLinea - Estado que contiene los datos de la tarea en edición
 * @param {Function} setEditandoEnLinea - Función para actualizar el estado de edición
 * @param {Object} tarea - Objeto con los datos de la tarea original
 * @param {Function} guardarTareaEditadaEnLinea - Función para guardar los cambios
 * 
 */


import { Save,X  } from "lucide-react"

function CardModoEdicionLineaMiSemana ({
  editandoEnLinea,
  setEditandoEnLinea, 
  tarea,
  guardarTareaEditadaEnLinea
}){
    return (
        <>
        <td className="py-3 px-3">
          <input
            type="text"
            value={editandoEnLinea.titulo}
            onChange={(e) => setEditandoEnLinea({ ...editandoEnLinea, titulo: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </td>
        <td className="py-3 px-3">
          <input
            type="time"
            value={editandoEnLinea.horaInicio}
            onChange={(e) =>
              setEditandoEnLinea({ ...editandoEnLinea, horaInicio: e.target.value })
            }
            className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </td>
        <td className="py-3 px-3">
          <input
            type="number"
            min="0.25"
            step="0.25"
            value={editandoEnLinea.duracion}
            onChange={(e) =>
              setEditandoEnLinea({
                ...editandoEnLinea,
                duracion: Number.parseFloat(e.target.value),
              })
            }
            className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </td>
        <td className="py-3 px-3 text-center">
          <span className={tarea.completada ? "text-emerald-400" : "text-white/50"}>
            {tarea.completada ? "Completada" : "Pendiente"}
          </span>
        </td>
        <td className="py-3 px-3 text-center">
          <span className="text-emerald-400 text-xs">{tarea.contadorCompletadas}</span>
        </td>
        <td className="py-3 px-3 text-center">
          <span className="text-emerald-400 text-xs">{tarea.contadorNoCompletadas}</span>
        </td>
        <td className="py-3 px-3 text-right">
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={guardarTareaEditadaEnLinea}
              className="text-white/30 hover:text-emerald-400 p-1 rounded-full transition-colors"
            >
              <Save className="h-3 w-3" />
            </button>
            <button
              onClick={() => setEditandoEnLinea(null)}
              className="text-white/30 hover:text-emerald-400 p-1 rounded-full transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </td>
      </>
    )
}

export default CardModoEdicionLineaMiSemana