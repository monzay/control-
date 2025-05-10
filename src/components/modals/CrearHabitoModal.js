import { useState } from 'react'
import { Sparkles, X, Plus, Trash2 } from 'lucide-react'

function CrearHabitoModal({ onClose, onSuccess }) {
    const [nuevoHabito, setNuevoHabito] = useState({
      titulo: "",
      descripcion: "",
      fechaFin: "",
      fechaCreacion: new Date().toISOString().split("T")[0],
      subtareas: [""],
      prioridad: 2,
    })
    const [error, setError] = useState("")
  
    const validarFormulario = () => {
      if (!nuevoHabito.titulo.trim()) {
        setError("El título es obligatorio")
        return false
      }
      setError("")
      return true
    }
  
    const agregarSubtarea = () => {
      setNuevoHabito({
        ...nuevoHabito,
        subtareas: [...nuevoHabito.subtareas, ""],
      })
    }
  
    const cambiarSubtarea = (index, valor) => {
      const nuevasSubtareas = [...nuevoHabito.subtareas]
      nuevasSubtareas[index] = valor
      setNuevoHabito({
        ...nuevoHabito,
        subtareas: nuevasSubtareas,
      })
    }
  
    const eliminarSubtarea = (index) => {
      if (nuevoHabito.subtareas.length <= 1) return
      const nuevasSubtareas = [...nuevoHabito.subtareas]
      nuevasSubtareas.splice(index, 1)
      setNuevoHabito({
        ...nuevoHabito,
        subtareas: nuevasSubtareas,
      })
    }
  
    const guardarHabito = () => {
      if (!validarFormulario()) return
  
      // Filtrar subtareas vacías
      const subtareasFiltradas = nuevoHabito.subtareas
        .filter((titulo) => titulo.trim() !== "")
        .map((titulo, indice) => ({
          id: `nueva-${Date.now()}-${indice}`,
          titulo,
          completada: false,
        }))
  
      const habito = {
        id: `habito-${Date.now()}`,
        titulo: nuevoHabito.titulo,
        descripcion: nuevoHabito.descripcion,
        tipo: "habito",
        completada: false,
        prioridad: nuevoHabito.prioridad,
        racha: 0,
        fechaFin: nuevoHabito.fechaFin || undefined,
        fechaCreacion: nuevoHabito.fechaCreacion,
        historial: [],
        subtareas: subtareasFiltradas,
        etiquetas: [],
      }
  
      onSuccess(habito)
  
      // Resetear el estado antes de cerrar el modal
      setNuevoHabito({
        titulo: "",
        descripcion: "",
        fechaFin: "",
        fechaCreacion: new Date().toISOString().split("T")[0],
        subtareas: [""],
        prioridad: 2,
      })
      onClose()
    }
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm p-4">
        <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-4 shadow-lg max-w-md w-full p-5 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              Nuevo Hábito
            </h3>
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
                value={nuevoHabito.titulo}
                onChange={(e) => setNuevoHabito({ ...nuevoHabito, titulo: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Título del hábito"
              />
              {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
            </div>
  
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                value={nuevoHabito.descripcion}
                onChange={(e) => setNuevoHabito({ ...nuevoHabito, descripcion: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500 min-h-[80px]"
                placeholder="Descripción del hábito"
              ></textarea>
            </div>
  
            <div>
              <label className="block text-sm font-medium mb-1">Prioridad</label>
              <select
                value={nuevoHabito.prioridad}
                onChange={(e) => setNuevoHabito({ ...nuevoHabito, prioridad: Number.parseInt(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="1">Baja</option>
                <option value="2">Media</option>
                <option value="3">Alta</option>
              </select>
            </div>
  
            <div>
              <label className="block text-sm font-medium mb-1">Fecha de finalización</label>
              <input
                type="date"
                value={nuevoHabito.fechaFin}
                onChange={(e) => setNuevoHabito({ ...nuevoHabito, fechaFin: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
  
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Subtareas</label>
                <button
                  onClick={agregarSubtarea}
                  className="text-xs px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-md flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> Añadir
                </button>
              </div>
              <div className="space-y-2">
                {nuevoHabito.subtareas.map((subtarea, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={subtarea}
                      onChange={(e) => cambiarSubtarea(index, e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                      placeholder={`Subtarea ${index + 1}`}
                    />
                    <button
                      onClick={() => eliminarSubtarea(index)}
                      className="text-white/50 hover:text-white p-2"
                      disabled={nuevoHabito.subtareas.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
  
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-white/10 hover:bg-white/20 text-white"
              >
                Cancelar
              </button>
              <button
                onClick={guardarHabito}
                className="px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-green-600 hover:bg-green-700 text-white"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
export default CrearHabitoModal 