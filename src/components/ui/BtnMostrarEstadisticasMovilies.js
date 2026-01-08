
import { BarChart2 } from "lucide-react";
function BtnMostrarEstadisticasMoviles({ mostrarEstadisticas, setMostrarEstadisticas }) {
  return (
    <div className="md:hidden mb-4">
      <button
        onClick={() => setMostrarEstadisticas(!mostrarEstadisticas)}
        className="px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-black/20 text-white/70 hover:text-white text-sm flex items-center justify-center gap-2"
      >
        <BarChart2 className="h-4 w-4" />
        <span>
          {mostrarEstadisticas
            ? "Ocultar estadísticas"
            : "Mostrar estadísticas"}
        </span>
      </button>
    </div>
  );
}

export default BtnMostrarEstadisticasMoviles;