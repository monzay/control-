import { Check, Play, Edit, Trash2 } from "lucide-react";
import AnimacionModulo from "@/function/Confeti";
import {  useState } from "react";
import funcionesGlobales from "@/function/funcionesGlobales";
import { useActividad } from "@/Context/ActividadContext.js";
import { DateTime } from 'luxon';
import { useSemanas } from "@/Context/SemanasContext";
import { useHistorial } from "@/Context/HistorialContext";

function CardModoVisualizacionMiSemana({
  tarea,
  iniciarTemporizadorTarea,
  iniciarEdicionEnLinea,
  eliminarTareaSemanal,
  desactivar,
  completarTarea
}) {
  const [diaActual] = useState(funcionesGlobales.obtenerNombreDelDia);
  const { actualizarActividad } = useActividad();

  function obtenerDiaActual() {
    return DateTime.now().ordinal;
  }

  const {refrescarSemanas} = useSemanas()
  const {obtenerPorcentajePorDiaSemana} = useHistorial()

  async function ejecutarFuncionBtnTareaCompletada() {
    if (diaActual === tarea.dia) {
      if (!tarea.completada) {
        try {
          AnimacionModulo.lanzarConfeti();
          await completarTarea(tarea.id);
          await actualizarActividad({ dia: obtenerDiaActual() });
          await   refrescarSemanas()
          await  obtenerPorcentajePorDiaSemana()
        } catch (error) {
          console.error("Error al completar tarea:", error);
          alert("Error al completar la tarea. Inténtalo de nuevo.");
        }
      }
    } else {
      alert("Ya pasó el día para completar esta tarea");
    }
  }

  return (
    <>
      <td className="py-3 px-3 text-sm">{tarea.titulo}</td>
      <td className="py-3 px-3 text-sm text-white/70">{tarea.horaACompletar}</td>
      <td className="py-3 px-3 text-sm text-white/70 ">{tarea.duracion}</td>
      <td className="py-3 px-3 text-center">
        <button
          onClick={ejecutarFuncionBtnTareaCompletada}
          className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors mx-auto ${
            tarea.completada
              ? "bg-emerald-600 text-white"
              : "border border-white/20 hover:bg-white/10"
          }`}
          disabled={tarea.completada}
        >
          {tarea.completada && <Check className="h-3 w-3" />}
        </button>
      </td>
      <td className="py-3 px-3 text-center">
        <span className="text-emerald-400 text-xs">
          {tarea._count.historial || 0}
        </span>
      </td>
      <td className="py-3 px-3 text-center">
        <span className="text-emerald-400 text-xs">
          {tarea.contadorNoCompletadas || 0}
        </span>
      </td>
      <td className="py-3 px-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => iniciarTemporizadorTarea(tarea)}
            className="text-white/30 hover:text-emerald-400 p-1 rounded-full transition-colors"
            title="Iniciar tarea"
            disabled={desactivar}
          >
            <Play className="h-3 w-3" />
          </button>
          <button
            onClick={() => {
              iniciarEdicionEnLinea(tarea)
            }}
            className="text-white/30 hover:text-emerald-400 p-1 rounded-full transition-colors"
            disabled={desactivar}
          >
            <Edit className="h-3 w-3" />
          </button>
          <button
            onClick={async () => {
            await  eliminarTareaSemanal(tarea.id)
            await obtenerPorcentajePorDiaSemana()
            }}
            className="text-white/30 hover:text-emerald-400 p-1 rounded-full transition-colors"
            disabled={desactivar}
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </td>
    </>
  );
}

export default CardModoVisualizacionMiSemana;
