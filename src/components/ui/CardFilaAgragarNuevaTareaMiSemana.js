import { Save, X } from "lucide-react";
import { formatearYValidarHora } from "@/function/FormatearYValidarHora";
function CardFilaAgregarNuevaTareaMiSemana({
  nuevaTareaSemanal,
  setNuevaTareaSemanal,
  agregarTareaSemanal,
  setAgregandoTareaSemanal
}) {

     
  return (
    <tr className="border-b border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-transparent">
      <td className="py-4 px-4">
        <input
          type="text"
          value={nuevaTareaSemanal.titulo}
          onChange={(e) => setNuevaTareaSemanal({ ...nuevaTareaSemanal, titulo: e.target.value })}
          placeholder="Nombre de la tarea..."
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-white/40 transition-all"
        />
      </td>
      <td className="py-4 px-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="sinHoraTabla"
              checked={nuevaTareaSemanal.sinHora || false}
              onChange={(e) =>
                setNuevaTareaSemanal({
                  ...nuevaTareaSemanal,
                  sinHora: e.target.checked,
                })
              }
              className="w-4 h-4 rounded border-white/30 bg-white/10 text-emerald-500 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="sinHoraTabla" className="text-xs text-white/80 cursor-pointer font-medium">
              Sin hora
            </label>
          </div>
          {!nuevaTareaSemanal.sinHora && (
            <input
              type="time"
              value={nuevaTareaSemanal.horaInicio || "09:00"}
              onChange={(e) => setNuevaTareaSemanal({ ...nuevaTareaSemanal, horaInicio: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white transition-all"
            />
          )}
        </div>
      </td>
      <td className="py-4 px-4">
        {nuevaTareaSemanal.sinHora ? (
          <span className="text-xs text-white/40 font-medium">-</span>
        ) : (
          <input
            type="text"
            value={nuevaTareaSemanal.duracion}
            placeholder="01:00"
            onChange={(e) =>
              setNuevaTareaSemanal({
                ...nuevaTareaSemanal,
                duracion:formatearYValidarHora(e.target.value),
              })
            }
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-white/40 transition-all"
          />
        )}
      </td>
      <td className="py-3 px-3 text-center">-</td>
      <td className="py-3 px-3 text-center">-</td>
      <td className="py-3 px-3 text-center">-</td>
      <td className="py-4 px-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={agregarTareaSemanal}
            disabled={!nuevaTareaSemanal.titulo.trim()}
            className="group relative p-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white transition-all duration-200 shadow-md shadow-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/40 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            title="Guardar tarea"
          >
            <Save className="h-4 w-4 relative z-10 transition-transform duration-200 group-hover:scale-110" />
          </button>
          <button
            onClick={() => setAgregandoTareaSemanal(false)}
            className="group p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white/70 hover:text-white transition-all duration-200 hover:scale-110"
            title="Cancelar"
          >
            <X className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default CardFilaAgregarNuevaTareaMiSemana;