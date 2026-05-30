import { formatearYValidarHora } from "@/function/FormatearYValidarHora";

function CardModoEdicionMovilMiSemana({setEditandoEnLinea,editandoEnLinea,guardarTareaEditadaEnLinea}) {
  return (
    <>
      <div className="mb-2">
        <input
          type="text"
          value={editandoEnLinea.titulo}
          onChange={(e) =>
            setEditandoEnLinea({
              ...editandoEnLinea,
              titulo: e.target.value,
            })
          }
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <input
          type="checkbox"
          id="sinHoraEditar"
          checked={editandoEnLinea.sinHora || false}
          onChange={(e) =>
            setEditandoEnLinea({
              ...editandoEnLinea,
              sinHora: e.target.checked,
              horaInicio: e.target.checked ? null : editandoEnLinea.horaInicio || "09:00",
              duracion: e.target.checked ? null : editandoEnLinea.duracion || "01:00",
            })
          }
          className="w-4 h-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500"
        />
        <label htmlFor="sinHoraEditar" className="text-xs text-white/70 cursor-pointer">
          Sin hora específica
        </label>
      </div>
      {!editandoEnLinea.sinHora && (
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className="text-xs text-white/50 mb-1 block">Hora</label>
            <input
              type="time"
              value={editandoEnLinea.horaInicio || ""}
              onChange={(e) =>
                setEditandoEnLinea({
                  ...editandoEnLinea,
                  horaInicio: e.target.value,
                })
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="text-xs text-white/50 mb-1 block">Duración</label>
            <input
              type="text"
              placeholder="00:00"
              value={editandoEnLinea.duracion || ""}
              onChange={(e) =>
                setEditandoEnLinea({
                  ...editandoEnLinea,
                  duracion: formatearYValidarHora(e.target.value),
                })
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      )}
      <div className="flex justify-end gap-2">
        <button
          onClick={guardarTareaEditadaEnLinea}
          className="px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1"
        >
          Guardar
        </button>
        <button
          onClick={() => setEditandoEnLinea(null)}
          className="px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1"
        >
          Cancelar
        </button>
      </div>
    </>
  );
}

export default CardModoEdicionMovilMiSemana;
