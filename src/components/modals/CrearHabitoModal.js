import { useState } from 'react'
import { Sparkles, X } from 'lucide-react'

function CrearHabitoModal({ onClose, onSuccess }) {
    const [nuevoHabito, setNuevoHabito] = useState({
      titulo: "",
      descripcion: "",
      fechaFin: "",
      fechaCreacion: new Date().toISOString().split("T")[0],
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
  
  
    const guardarHabito = () => {
      if (!validarFormulario()) return

      const habito = {
        id: `habito-${Date.now()}`,
        titulo: nuevoHabito.titulo,
        descripcion: nuevoHabito.descripcion,
        tipo: "habito",
        completada: false,
        prioridad: 2,
        racha: 0,
        fechaFin: nuevoHabito.fechaFin || undefined,
        fechaCreacion: nuevoHabito.fechaCreacion,
        historial: [],
        subtareas: [],
        etiquetas: [],
      }

      onSuccess(habito)

      // Resetear el estado antes de cerrar el modal
      setNuevoHabito({
        titulo: "",
        descripcion: "",
        fechaFin: "",
        fechaCreacion: new Date().toISOString().split("T")[0],
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
              <label className="block text-sm font-medium mb-1">Fecha de finalización</label>
              <input
                type="date"
                value={nuevoHabito.fechaFin}
                onChange={(e) => setNuevoHabito({ ...nuevoHabito, fechaFin: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                min={new Date().toISOString().split("T")[0]}
              />
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