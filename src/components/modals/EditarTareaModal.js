import { useState } from "react"
import { X, Plus, Trash2 } from "lucide-react"

function EditarTareaModal({ tarea, onClose, onSave }) {
    // Inicializar el estado solo una vez con los valores de la tarea
    const [tareaEditada, setTareaEditada] = useState(tarea)
    const [nuevasSubtareas, setNuevasSubtareas] = useState(tarea.subtareas?.map((st) => st.titulo) || [""])
    const [error, setError] = useState("")
  
    const validarFormulario = () => {
      if (!tareaEditada.titulo.trim()) {
        setError("El título es obligatorio")
        return false
      }
      setError("")
      return true
    }
  
    const manejarCambioSubtarea = (indice, valor) => {
      const listaSubtareasNueva = [...nuevasSubtareas]
      listaSubtareasNueva[indice] = valor
  
      // Si se está editando la última subtarea y no está vacía, agregar una nueva
      if (indice === listaSubtareasNueva.length - 1 && valor.trim() !== "") {
        listaSubtareasNueva.push("")
      }
  
      setNuevasSubtareas(listaSubtareasNueva)
    }
  
    const eliminarSubtarea = (indice) => {
      if (nuevasSubtareas.length <= 1) return
      const listaSubtareasNueva = [...nuevasSubtareas]
      listaSubtareasNueva.splice(indice, 1)
      setNuevasSubtareas(listaSubtareasNueva)
    }
  
    const guardarCambios = () => {
      if (!validarFormulario()) return
  
      // Filtrar subtareas vacías
      const subtareasFiltradas = nuevasSubtareas
        .filter((titulo) => titulo.trim() !== "")
        .map((titulo, indice) => {
          // Mantener IDs existentes si es posible
          const subtareaExistente = tarea.subtareas?.find((st, i) => i === indice)
          return {
            id: subtareaExistente?.id || `editar-${Date.now()}-${indice}`,
            titulo,
            completada: subtareaExistente?.completada || false,
          }
        })
  
      const tareaActualizada = {
        ...tareaEditada,
        subtareas: tareaEditada.tipo === "habito" ? subtareasFiltradas : undefined,
      }
  
      onSave(tareaActualizada)
    }
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm p-4">
        <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-4 shadow-lg max-w-md w-full p-5 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Editar {tareaEditada.tipo === "habito" ? "Hábito" : "Nota"}</h3>
            <button onClick={onClose} className="text-white/50 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
  
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Título <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                value={tareaEditada.titulo}
                onChange={(e) => setTareaEditada({ ...tareaEditada, titulo: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder={`Título del ${tareaEditada.tipo === "habito" ? "hábito" : "nota"}`}
              />
              {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
            </div>
  
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                value={tareaEditada.descripcion || ""}
                onChange={(e) => setTareaEditada({ ...tareaEditada, descripcion: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[80px]"
                placeholder={`Descripción del ${tareaEditada.tipo === "habito" ? "hábito" : "nota"}`}
              ></textarea>
            </div>
  
            {tareaEditada.tipo === "habito" && (
              <div>
                <label className="block text-sm font-medium mb-1">Prioridad</label>
                <select
                  value={tareaEditada.prioridad}
                  onChange={(e) => setTareaEditada({ ...tareaEditada, prioridad: Number.parseInt(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="1">Baja</option>
                  <option value="2">Media</option>
                  <option value="3">Alta</option>
                </select>
              </div>
            )}
  
            <div>
              <label className="block text-sm font-medium mb-1">
                Fecha de {tareaEditada.tipo === "habito" ? "finalización" : "recordatorio"}
              </label>
              <input
                type="date"
                value={tareaEditada.fechaFin || ""}
                onChange={(e) => setTareaEditada({ ...tareaEditada, fechaFin: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
  
            {tareaEditada.tipo === "habito" && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Subtareas</label>
                  <button
                    onClick={() => setNuevasSubtareas([...nuevasSubtareas, ""])}
                    className="text-xs px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded-md flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Añadir
                  </button>
                </div>
                <div className="space-y-2">
                  {nuevasSubtareas.map((subtarea, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={subtarea}
                        onChange={(e) => manejarCambioSubtarea(index, e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        placeholder={`Subtarea ${index + 1}`}
                      />
                      <button
                        onClick={() => eliminarSubtarea(index)}
                        className="text-white/50 hover:text-white p-2"
                        disabled={nuevasSubtareas.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
  
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-white/10 hover:bg-white/20 text-white"
              >
                Cancelar
              </button>
              <button
                onClick={guardarCambios}
                className="px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

export default EditarTareaModal