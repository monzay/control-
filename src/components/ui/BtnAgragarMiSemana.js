import { Plus } from "lucide-react";

function BtnAgregarMiSemana({ setAgregandoTareaSemanal, agregandoTareaSemanal }) {
  return (
    <div className="flex justify-end mt-6">
      <button
        onClick={() => setAgregandoTareaSemanal(true)}
        className="px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-emerald-600 hover:bg-emerald-700 text-white text-sm flex items-center gap-2"
        disabled={agregandoTareaSemanal}
      >
        <Plus className="h-4 w-4" />
        <span>Planificar nueva tarea</span>
      </button>
    </div>
  );
}

export default BtnAgregarMiSemana;