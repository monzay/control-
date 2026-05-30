import { useState } from "react"
import { PenTool, X } from "lucide-react"

function CrearNotaModal({ onClose, onSuccess }) {

  const [nuevaNota, setNuevaNota] = useState({
    titulo: "",
    descripcion: "",
    fechaRecordatorio: "",
    diasAntelacion: "",
    repetirMensualmente: false,
    fechaCreacion: new Date().toISOString().split("T")[0],
  })
  const [error, setError] = useState("")

  const validarFormulario = () => {
    if (!nuevaNota.titulo.trim()) {
      setError("El título es obligatorio")
      return false
    }
    setError("")
    return true
  }

  const guardarNota = () => {
    if (!validarFormulario()) return

    const nota = {
      id: `nota-${Date.now()}`,
      titulo: nuevaNota.titulo,
      descripcion: nuevaNota.descripcion,
      tipo: "nota",
      completada: false,
      prioridad: 2,
      fechaFin: nuevaNota.fechaRecordatorio || undefined,
      diasAntelacion: nuevaNota.diasAntelacion ? Number(nuevaNota.diasAntelacion) : undefined,
      repetirMensualmente: nuevaNota.repetirMensualmente || undefined,
      diaMes: nuevaNota.repetirMensualmente && nuevaNota.fechaRecordatorio
        ? new Date(nuevaNota.fechaRecordatorio + "T00:00:00").getDate()
        : undefined,
      fechaCreacion: nuevaNota.fechaCreacion,
      etiquetas: [],
    }

    onSuccess(nota)

    // Resetear el estado antes de cerrar el modal
    setNuevaNota({
      titulo: "",
      descripcion: "",
      fechaRecordatorio: "",
      diasAntelacion: "",
      repetirMensualmente: false,
      fechaCreacion: new Date().toISOString().split("T")[0],
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm p-4">
      <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-5 shadow-lg max-w-md w-full animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <PenTool className="h-5 w-5 text-emerald-400" />
            Nueva Nota
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
              value={nuevaNota.titulo}
              onChange={(e) => setNuevaNota({ ...nuevaNota, titulo: e.target.value })}
              onKeyDown={(e) => { if (e.key === "Enter") guardarNota() }}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Título de la nota"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              value={nuevaNota.descripcion}
              onChange={(e) => setNuevaNota({ ...nuevaNota, descripcion: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500 min-h-[100px] resize-y"
              placeholder="Descripción de la nota (puedes pegar links y serán clicables)"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Fecha de recordatorio</label>
            <input
              type="date"
              value={nuevaNota.fechaRecordatorio}
              onChange={(e) => setNuevaNota({ ...nuevaNota, fechaRecordatorio: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Días de antelación</label>
            <input
              type="number"
              value={nuevaNota.diasAntelacion}
              onChange={(e) => setNuevaNota({ ...nuevaNota, diasAntelacion: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Ej: 2 días antes del recordatorio"
              min={1}
            />
          </div>

          <div className="border border-white/10 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Repetir cada mes</label>
                {nuevaNota.repetirMensualmente && nuevaNota.fechaRecordatorio && (
                  <p className="text-xs text-blue-400 mt-0.5">
                    Se repetirá el día {new Date(nuevaNota.fechaRecordatorio + "T00:00:00").getDate()} de cada mes
                  </p>
                )}
                {nuevaNota.repetirMensualmente && !nuevaNota.fechaRecordatorio && (
                  <p className="text-xs text-white/40 mt-0.5">Requiere una fecha de recordatorio</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setNuevaNota({ ...nuevaNota, repetirMensualmente: !nuevaNota.repetirMensualmente })}
                disabled={!nuevaNota.fechaRecordatorio}
                className={`relative w-10 h-5 rounded-full transition-colors duration-200 disabled:opacity-30 ${nuevaNota.repetirMensualmente ? "bg-blue-500" : "bg-white/20"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${nuevaNota.repetirMensualmente ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
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
              onClick={guardarNota}
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


export default CrearNotaModal