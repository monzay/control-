import { Save, X } from "lucide-react";
import { formatearYValidarHora } from "@/function/FormatearYValidarHora";
import { CallApi } from "@/hooks/CallApi";

function CardFilaAgregarNuevaTareaMiSemana({
  nuevaTareaSemanal,
  setNuevaTareaSemanal,
  agregarTareaSemanal,
  setAgregandoTareaSemanal
}) {
  // Hook para la API del backend
  const { request, loading } = CallApi("http://localhost:3001/semana");

  // Nueva función para agregar tarea con API y token
  const handleAgregarTarea = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para agregar tareas a tu semana.");
      return;
    }
    try {
      await request("/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: {
          titulo: nuevaTareaSemanal.titulo,
          horaACompletar: nuevaTareaSemanal.horaInicio,
          duracion: nuevaTareaSemanal.duracion,
          dia: nuevaTareaSemanal.dia // Asegúrate de que este campo esté en el objeto
        }
      });
      // Llama la función original para refrescar la UI
      agregarTareaSemanal && agregarTareaSemanal();
    } catch (err) {
      alert("Error al agregar tarea: " + (err.message || "Error desconocido"));
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
            className="text-white/30 hover:text-emerald-400 p-1 rounded-full transition-colors"
            disabled={!nuevaTareaSemanal.titulo.trim() || loading}
          >
            <Save className="h-3 w-3" />
          </button>
          <button
            onClick={() => setAgregandoTareaSemanal(false)}
            className="text-white/30 hover:text-emerald-400 p-1 rounded-full transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default CardFilaAgregarNuevaTareaMiSemana;