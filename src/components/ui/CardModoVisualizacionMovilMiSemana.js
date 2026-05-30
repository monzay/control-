import { Play, Edit, Trash2, Check, Clock, Timer } from "lucide-react";
import AnimacionModulo from "@/function/Confeti";
import FechaModulo from "@/function/FechaModulo";
import { useContext, useState } from "react";
import { ContextVolverACargarTareasFiltradas } from "@/Context/ProviderVolverACargarTareasFiltradas";
import funcionesGlobales from "@/function/funcionesGlobales";
import { contextoStateX } from "@/Context/ProviderStateX";
import alternarTareaSemanal from "@/function/ActualizarActividad";

function CardModoVisualizacionMovilMiSemana({ tarea, iniciarTemporizadorTarea, iniciarEdicionEnLinea, eliminarTareaSemanal }) {
  const [diaActual] = useState(funcionesGlobales.obtenerNombreDelDia());
  const { setVolverCargarTareasFiltradas } = useContext(ContextVolverACargarTareasFiltradas);
  const { setTareasSemana, tareasSemana, tareas } = useContext(contextoStateX);

  const completar = () => {
    if (diaActual === tarea.dia && !tarea.completada) {
      AnimacionModulo.lanzarConfeti();
      alternarTareaSemanal(tarea.id, setTareasSemana, tareas || []);
      setVolverCargarTareasFiltradas(prev => !prev);
    } else if (diaActual !== tarea.dia) {
      alert("Ya pasó el día");
    }
  };

  return (
    <div className={`flex flex-col gap-3 ${tarea.completada ? "opacity-60" : ""}`}>

      {/* Título + estado */}
      <div className="flex items-start justify-between gap-2">
        <span className={`text-sm font-medium leading-snug ${tarea.completada ? "line-through text-white/40" : "text-white"}`}>
          {tarea.titulo}
        </span>
        <button
          onClick={completar}
          disabled={tarea.completada}
          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
            tarea.completada
              ? "bg-emerald-600 text-white"
              : "border border-white/20 hover:border-emerald-500/60 hover:bg-emerald-500/10"
          }`}
        >
          {tarea.completada && <Check className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Hora y duración */}
      {!tarea.sinHora && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-xs text-white/50">
            <Clock className="h-3 w-3" />
            {tarea.horaInicio}
          </div>
          <div className="flex items-center gap-1 text-xs text-white/50">
            <Timer className="h-3 w-3" />
            {FechaModulo.formatearDuracion(tarea.duracion)}
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="flex items-center justify-end gap-1 border-t border-white/5 pt-2">
        <button
          onClick={() => iniciarTemporizadorTarea(tarea)}
          className="p-1.5 rounded-lg text-white/40 hover:text-emerald-400 hover:bg-white/5 transition-colors"
          title="Iniciar temporizador"
        >
          <Play className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => iniciarEdicionEnLinea(tarea)}
          className="p-1.5 rounded-lg text-white/40 hover:text-emerald-400 hover:bg-white/5 transition-colors"
          title="Editar"
        >
          <Edit className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => { setVolverCargarTareasFiltradas(prev => !prev); eliminarTareaSemanal(tarea.id); }}
          className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors"
          title="Eliminar"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default CardModoVisualizacionMovilMiSemana;
