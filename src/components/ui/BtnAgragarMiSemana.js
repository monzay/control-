import { Plus, Copy } from "lucide-react";

function BtnAgregarMiSemana({ 
  setAgregandoTareaSemanal, 
  agregandoTareaSemanal,
  onClonarClick 
}) {
  return (
    <div className="flex justify-end gap-3 mt-6">
      <button
        onClick={onClonarClick}
        disabled={agregandoTareaSemanal}
        className="group relative px-5 py-3 rounded-xl transition-all duration-300 text-sm font-medium bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/30 text-white flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105"
      >
        <Copy className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
        <span>Clonar día</span>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>
      <button
        onClick={() => setAgregandoTareaSemanal(true)}
        disabled={agregandoTareaSemanal}
        className="group relative px-6 py-3.5 rounded-xl transition-all duration-300 text-sm font-semibold bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:via-emerald-400 hover:to-emerald-500 text-white flex items-center gap-2.5 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
        <Plus className="h-5 w-5 relative z-10 transition-transform duration-300 group-hover:rotate-90" />
        <span className="relative z-10">Nueva Tarea</span>
      </button>
    </div>
  );
}

export default BtnAgregarMiSemana;