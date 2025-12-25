import { useState } from 'react'
import { Copy, X } from 'lucide-react'

function ModalClonarTareas({ 
  onClose, 
  onConfirm, 
  diaOrigen, 
  diasSemana 
}) {
  const [diaDestino, setDiaDestino] = useState(null)

  const handleConfirmar = () => {
    if (!diaDestino) return
    onConfirm(diaDestino)
    onClose()
  }

  // Capitalizar primera letra del día
  const capitalizarDia = (dia) => {
    return dia.charAt(0).toUpperCase() + dia.slice(1)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm p-4">
      <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-4 shadow-lg max-w-md w-full p-5 animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium flex items-center gap-2 text-white">
            <Copy className="h-5 w-5 text-emerald-400" />
            Clonar Tareas
          </h3>
          <button 
            onClick={onClose} 
            className="text-white/50 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-white/90">
              Día origen
            </label>
            <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white">
              {capitalizarDia(diaOrigen)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-white/90">
              Selecciona el día destino <span className="text-emerald-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {diasSemana.map((dia) => {
                // No permitir seleccionar el mismo día
                if (dia === diaOrigen) return null
                
                return (
                  <button
                    key={dia}
                    onClick={() => setDiaDestino(dia)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                      diaDestino === dia
                        ? "bg-emerald-600 text-white"
                        : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
                    }`}
                  >
                    {capitalizarDia(dia)}
                  </button>
                )
              })}
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
              onClick={handleConfirmar}
              disabled={!diaDestino}
              className="px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clonar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalClonarTareas

