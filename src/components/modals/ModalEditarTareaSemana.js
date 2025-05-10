
import {X} from "lucide-react"
function ModalEditarTareaSemana ({
  setEditandoTareaSemanal,
  editandoTareaSemanal,
  diasSemana,
  guardarTareaEditadaSemanal,

}){


    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
        <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-4 shadow-lg max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Editar tarea semanal</h3>
            <button onClick={() => setEditandoTareaSemanal(null)} className="text-white/50 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Título</label>
              <input
                type="text"
                value={editandoTareaSemanal.titulo}
                onChange={(e) => setEditandoTareaSemanal({ ...editandoTareaSemanal, titulo: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Día</label>
              <select
                value={editandoTareaSemanal.dia}
                onChange={(e) => setEditandoTareaSemanal({ ...editandoTareaSemanal, dia: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {diasSemana.map((dia) => (
                  <option key={dia} value={dia}>
                    {dia}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Hora de inicio</label>
              <input
                type="time"
                value={editandoTareaSemanal.horaInicio}
                onChange={(e) => setEditandoTareaSemanal({ ...editandoTareaSemanal, horaInicio: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Duración (horas)</label>
              <input
                type="number"
                min="0.25"
                step="0.25"
                value={editandoTareaSemanal.duracion}
                onChange={(e) =>
                  setEditandoTareaSemanal({ ...editandoTareaSemanal, duracion: Number.parseFloat(e.target.value) })
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditandoTareaSemanal(null)}
                className="px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-white/10 hover:bg-white/20 text-white"
              >
                Cancelar
              </button>
              <button
                onClick={guardarTareaEditadaSemanal}
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

export default ModalEditarTareaSemana