import { Save, X } from "lucide-react";
import { formatearYValidarHora } from "@/function/FormatearYValidarHora";
import { useSemanas } from "@/Context/SemanasContext";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { useActividad } from "@/Context/ActividadContext";


function validarDuracion(duracion) {
  // Formato HH:mm y máximo 10:00
  const regex = /^([0-9]{1,2}):([0-5]\d)$/;
  if (!regex.test(duracion)) return false;
  const [h, m] = duracion.split(":").map(Number);
  if (h > 10 || (h === 10 && m > 0)) return false;
  if (h === 0 && m === 0) return false;
  return true;
}

function CardFilaAgregarNuevaTareaMiSemana({
  nuevaTareaSemanal,
  setNuevaTareaSemanal,
  setAgregandoTareaSemanal,
  diaSemanaSeleccionado,
  desactivar
}) {
  const {actualizarActividad} = useActividad()
  const { crearSemana } = useSemanas();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleAgregarTarea = async () => {
    // Validaciones
    if (!nuevaTareaSemanal.titulo.trim()) {
      setError("El título no puede estar vacío.");
      return;
    }
    if (!diaSemanaSeleccionado || !nuevaTareaSemanal.dia) {
      setError("El día no puede estar vacío.");
      return;
    }
    if (!validarDuracion(nuevaTareaSemanal.duracion)) {
      setError("La duración debe tener formato HH:mm y máximo 10:00.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await crearSemana({
        titulo: nuevaTareaSemanal.titulo,
        horaACompletar: nuevaTareaSemanal.horaInicio,
        duracion: nuevaTareaSemanal.duracion,
        dia: diaSemanaSeleccionado
      });

      await actualizarActividad({dia: DateTime.now().ordinal})
      setNuevaTareaSemanal({
        titulo: "",
        dia: diaSemanaSeleccionado,
        horaInicio: "00:00",
        duracion: "00:30",
      });
      setAgregandoTareaSemanal(false);
    } catch (error) {
      setError("Error al crear actividad semanal.");
      console.error("Error al crear actividad semanal:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr className="border-b border-white/5 bg-white/5">
      <td className="py-3 px-3">
        <input
          type="text"
          value={nuevaTareaSemanal.titulo}
          onChange={(e) => setNuevaTareaSemanal({ ...nuevaTareaSemanal, titulo: e.target.value })}
          placeholder="Título de la tarea"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </td>
      <td className="py-3 px-3">
        <input
          type="time"
          value={nuevaTareaSemanal.horaInicio}
          onChange={(e) => setNuevaTareaSemanal({ ...nuevaTareaSemanal, horaInicio: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </td>
      <td className="py-3 px-3">
        <input
          type="text"
          value={nuevaTareaSemanal.duracion}
          onChange={(e) =>
            setNuevaTareaSemanal({
              ...nuevaTareaSemanal,
              duracion:formatearYValidarHora(e.target.value),
            })
          }
          className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </td>
      <td className="py-3 px-3 text-center">-</td>
      <td className="py-3 px-3 text-center">-</td>
      <td className="py-3 px-3 text-center">-</td>
      <td className="py-3 px-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={handleAgregarTarea}
            className="text-white/30 hover:text-emerald-400 p-1 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || desactivar}
          >
            <Save className="h-3 w-3" />
          </button>
          <button
            onClick={() => setAgregandoTareaSemanal(false)}
            className="text-white/30 hover:text-emerald-400 p-1 rounded-full transition-colors"
            disabled={loading}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
        {error && (
          <div className="text-red-400 text-xs mt-1 text-right">{error}</div>
        )}
      </td>
    </tr>
  );
}

export default CardFilaAgregarNuevaTareaMiSemana;