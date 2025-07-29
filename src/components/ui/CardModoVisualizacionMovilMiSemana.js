import { Check, Play, Edit, Trash2 } from "lucide-react";
import AnimacionModulo from "@/function/Confeti";
import FechaModulo from "@/function/FechaModulo";
import { useState } from "react";
import funcionesGlobales from "@/function/funcionesGlobales";
import { useActividad } from "@/Context/ActividadContext";
import { DateTime } from "luxon";
function CardModoVisualizacionMovilMiSemana({
  tarea,
  iniciarTemporizadorTarea,
  iniciarEdicionEnLinea,
  eliminarTareaSemanal,
  desactivar,
  completarTarea
}) {
  const [diaActual] = useState(funcionesGlobales.obtenerNombreDelDia);

  const {refrescarActividades} = useActividad()


  

   function ejecutarFuncionBtnTareaCompletada() {
    if (diaActual === tarea.dia) {
      if (!tarea.completada) {
          AnimacionModulo.lanzarConfeti();
           completarTarea(tarea.id);
      }
    } else {
      alert("Ya pasó el día para completar esta tarea");
    }
  }

   
    return (
        <>
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-sm font-medium">
            {tarea.titulo}
          </h4>
          <button
            onClick={ejecutarFuncionBtnTareaCompletada}
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
              tarea.completada
                ? "bg-emerald-600 text-white"
                : "border border-white/20 hover:bg-white/10"
            }`}
            disabled={tarea.completada}
          >
            {tarea.completada && (
              <Check className="h-3 w-3" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1 text-xs text-white/70 mb-2">
          <div>
            <span className="text-white/50">Hora: </span>
            {tarea.horaInicio}
          </div>
          <div>
            <span className="text-white/50">
              Duración:{" "}
            </span>
            {FechaModulo.formatearDuracion(tarea.duracion)}
          </div>
          <div>
            <span className="text-white/50">
              Completadas:{" "}
            </span>
            <span className="text-emerald-400">
              {tarea.contadorCompletadas}
            </span>
          </div>
          <div>
            <span className="text-white/50">
              Fallidas:{" "}
            </span>
            <span className="text-emerald-400">
              {tarea.contadorNoCompletadas}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => iniciarTemporizadorTarea(tarea)}
            className="text-white/50 hover:text-emerald-400 p-1 rounded-full transition-colors"
            title="Iniciar tarea"
            disabled={desactivar}
          >
            <Play className="h-4 w-4" />
          </button>
          <button
            onClick={() => iniciarEdicionEnLinea(tarea)}
            className="text-white/50 hover:text-emerald-400 p-1 rounded-full transition-colors"
            disabled={desactivar}
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={ () => {
               eliminarTareaSemanal(tarea.id)
               refrescarActividades() 
            }}
            className="text-white/50 hover:text-emerald-400 p-1 rounded-full transition-colors"
            disabled={desactivar}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </>
    )
}

export default CardModoVisualizacionMovilMiSemana 