import { Plus, Copy, X as CloseIcon } from "lucide-react";
import { useState } from "react";

function BtnAgregarMiSemana({ setAgregandoTareaSemanal, agregandoTareaSemanal, desactivar, diasSemana = [], onClonarDia }) {
  const [mostrarClonar, setMostrarClonar] = useState(false);
  const [diaOrigen, setDiaOrigen] = useState("");
  const [diaDestino, setDiaDestino] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClonar = async () => {
    setLoading(true);
    await onClonarDia(diaOrigen, diaDestino);
    setLoading(false);
    setMostrarClonar(false);
    setDiaOrigen("");
    setDiaDestino("");
  };

  return (
    <div className="flex flex-col items-end mt-6 gap-2">
      <div className="flex gap-2">
        <button
          onClick={() => setAgregandoTareaSemanal(true)}
          className="px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow"
          disabled={agregandoTareaSemanal || desactivar}
        >
          <Plus className="h-4 w-4" />
          <span>Planificar nueva tarea</span>
        </button>
        <button
          onClick={() => setMostrarClonar((v) => !v)}
          className="px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-white/10 hover:bg-emerald-700 text-emerald-400 flex items-center gap-2 border border-emerald-400 shadow"
        >
          <Copy className="h-4 w-4" />
          <span>Clonar día</span>
        </button>
      </div>
      {mostrarClonar && (
        <div className="relative z-50">
          <div className="absolute right-0 mt-2 w-72 bg-[#181f2a] border border-white/10 rounded-xl shadow-2xl p-5 animate-in fade-in duration-200">
            <button
              className="absolute top-2 right-2 text-white/50 hover:text-white"
              onClick={() => setMostrarClonar(false)}
              aria-label="Cerrar"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-white/80 mb-1 block">Día a clonar (origen):</label>
                <select
                  className="rounded px-2 py-1 text-sm bg-white text-gray-800 w-full border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={diaOrigen}
                  onChange={e => setDiaOrigen(e.target.value)}
                >
                  <option value="">Selecciona un día</option>
                  {diasSemana.map(dia => (
                    <option key={dia} value={dia}>{dia.charAt(0).toUpperCase() + dia.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/80 mb-1 block">Día destino:</label>
                <select
                  className="rounded px-2 py-1 text-sm bg-white text-gray-800 w-full border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={diaDestino}
                  onChange={e => setDiaDestino(e.target.value)}
                >
                  <option value="">Selecciona un día</option>
                  {diasSemana.map(dia => (
                    <option key={dia} value={dia}>{dia.charAt(0).toUpperCase() + dia.slice(1)}</option>
                  ))}
                </select>
              </div>
              <button
                className={`mt-2 px-3 py-2 rounded-lg flex items-center justify-center gap-2 w-full text-white text-sm font-semibold transition-colors duration-200 shadow ${loading ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}`}
                disabled={!diaOrigen || !diaDestino || diaOrigen === diaDestino || loading}
                onClick={handleClonar}
              >
                <Copy className="h-4 w-4" />
                {loading ? "Clonando..." : "Clonar actividades"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BtnAgregarMiSemana;