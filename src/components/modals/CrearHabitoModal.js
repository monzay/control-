import { useState } from 'react'
import { Sparkles, X } from 'lucide-react'
import { useObjetivos } from '@/Context/ObjetivosContext'

function CrearHabitoModal({ onClose, onSuccess }) {
  const { crearObjetivo } = useObjetivos();
  const [nuevoHabito, setNuevoHabito] = useState({
    titulo: "",
    descripcion: "",
    fechaFin: "",
    cantidasDias: ""
  })
  const [error, setError] = useState("")

  const validarFormulario = () => {
    if (!nuevoHabito.titulo.trim()) {
      setError("El título es obligatorio");
      return false;
    }
    if (!nuevoHabito.descripcion.trim()) {
      setError("La descripción es obligatoria");
      return false;
    }
    if (!nuevoHabito.fechaFin) {
      setError("La fecha de finalización es obligatoria");
      return false;
    }
 
    if (!nuevoHabito.cantidasDias || isNaN(Number(nuevoHabito.cantidasDias)) || Number(nuevoHabito.cantidasDias) <= 0) {
      setError("La cantidad de días debe ser mayor a 0");
      return false;
    }
    setError("");
    return true;
  }

  
  const guardarHabito = async () => {
    if (!validarFormulario()) return
    try {
      // Formatear fechaFin a ISO yyyy-mm-dd
      const fechaFinFormateada = nuevoHabito.fechaFin
        ? new Date(nuevoHabito.fechaFin).toISOString().split("T")[0]
        : "";

      const body = {
        titulo: nuevoHabito.titulo,
        descripcion: nuevoHabito.descripcion,
        fechaFin: fechaFinFormateada,
        cantidasDias: Number(nuevoHabito.cantidasDias)
      }
      console.log(body)
      await crearObjetivo(body)
      // reset 
      setNuevoHabito({
        titulo: "",
        descripcion: "",
        fechaFin: "",
        cantidasDias: ""
      })
      onSuccess && onSuccess()
      onClose()
    } catch (err) {
      setError("Error al crear hábito. Intenta nuevamente.");
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm p-4">
      <div className="p-4 shadow-lg max-w-md w-full p-5 animate-in slide-in-from-bottom duration-300">
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
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descripción <span className="text-emerald-400">*</span></label>
            <textarea
              value={nuevoHabito.descripcion}
              onChange={(e) => setNuevoHabito({ ...nuevoHabito, descripcion: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500 min-h-[100px]"
              placeholder="Descripción del hábito"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha de finalización <span className="text-emerald-400">*</span></label>
            <input
              type="date"
              value={nuevoHabito.fechaFin}
              onChange={(e) => setNuevoHabito({ ...nuevoHabito, fechaFin: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cantidad de días <span className="text-emerald-400">*</span></label>
            <input
              type="number"
              min="1"
              value={nuevoHabito.cantidasDias}
              onChange={(e) => setNuevoHabito({ ...nuevoHabito, cantidasDias: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Ejemplo: 7"
            />
          </div>
          {error && <div className="text-red-400 text-xs mt-1 text-right">{error}</div>}
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