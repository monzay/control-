
import {X} from "lucide-react"
import { useState } from "react";

function validarHora(hora) {
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return regex.test(hora);
}

function validarDuracion(duracion) {
  const regex = /^([0-9]{1,2}):([0-5]\d)$/;
  if (!regex.test(duracion)) return false;
  const [h, m] = duracion.split(":").map(Number);
  if (h > 10 || (h === 10 && m > 0)) return false;
  if (h === 0 && m === 0) return false;
  return true;
}

function ModalEditarTareaSemana ({
  setEditandoTareaSemanal,
  editandoTareaSemanal,
  diasSemana,
  guardarTareaEditadaSemanal,
}){
  const [error, setError] = useState("");

  const handleGuardar = () => {
    if (!editandoTareaSemanal.titulo.trim()) {
      setError("El título no puede estar vacío.");
      return;
    }
    if (!editandoTareaSemanal.dia) {
      setError("El día no puede estar vacío.");
      return;
    }
    if (!validarHora(editandoTareaSemanal.horaACompletar)) {
      setError("La hora debe tener formato HH:mm y estar entre 00:00 y 23:59.");
      return;
    }
    if (!validarDuracion(editandoTareaSemanal.duracion)) {
      setError("La duración debe tener formato HH:mm y máximo 10:00.");
      return;
    }
    setError("");
    guardarTareaEditadaSemanal();
  };

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
              <label className="block text-sm font-medium mb-1">Hora a completar</label>
              <input
                type="time"
                value={editandoTareaSemanal.horaACompletar || ""}
                onChange={(e) => setEditandoTareaSemanal({ ...editandoTareaSemanal, horaACompletar: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duración (HH:mm)</label>
              <input
                type="text"
                value={editandoTareaSemanal.duracion || ""}
                onChange={(e) => setEditandoTareaSemanal({ ...editandoTareaSemanal, duracion: e.target.value })}
                placeholder="Ej: 01:00"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            {error && <div className="text-red-400 text-xs mt-1 text-right">{error}</div>}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditandoTareaSemanal(null)}
                className="px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-white/10 hover:bg-white/20 text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
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