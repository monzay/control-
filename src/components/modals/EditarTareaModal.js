import { useState } from "react"
import { X } from "lucide-react"
import { useObjetivos } from "@/Context/ObjetivosContext"

function EditarTareaModal({ tarea, onClose, onSave }) {
    const [tareaEditada, setTareaEditada] = useState(tarea)
    const [errores, setErrores] = useState({})
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const { actualizarObjetivo } = useObjetivos()

    const validar = () => {
      const nuevosErrores = {};
      if (!tareaEditada.titulo || tareaEditada.titulo.trim() === "") {
        nuevosErrores.titulo = "El título es obligatorio";
      }
      if (!tareaEditada.cantidasDias || tareaEditada.cantidasDias <= 0) {
        nuevosErrores.cantidasDias = "La cantidad de días debe ser mayor a 0";
      }
      if (!tareaEditada.fechaFin || tareaEditada.fechaFin === "") {
        nuevosErrores.fechaFin = "La fecha de finalización es obligatoria";
      }
      return nuevosErrores;
    }

    const guardarCambios = async () => {
      const nuevosErrores = validar();
      setErrores(nuevosErrores);
      if (Object.keys(nuevosErrores).length > 0) return;
      setLoading(true);
      try {
        await actualizarObjetivo(tareaEditada.id,{
          titulo:tareaEditada.titulo,
          descripcion:tareaEditada.descripcion,
          fechaFin:tareaEditada.fechaFin,
          cantidasDias:tareaEditada.cantidasDias
        });
        setSuccess(true);
        onClose(); // Cierra el modal al guardar correctamente
      } catch (e) {
        setErrores({ general: "Error al guardar los cambios" });
      } finally {
        setLoading(false);
      }
    }

    const handleChange = (campo, valor) => {
      setTareaEditada((prev) => ({ ...prev, [campo]: valor }))
      setErrores((prev) => ({ ...prev, [campo]: undefined }));
    }

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm p-4">
        <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-4 shadow-lg max-w-md w-full p-5 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Editar Objetivo</h3>
            <button onClick={onClose} className="text-white/50 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Título <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                value={tareaEditada.titulo}
                onChange={(e) => handleChange("titulo", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Título del objetivo"
              />
              {errores.titulo && <p className="text-red-400 text-xs mt-1">{errores.titulo}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                value={tareaEditada.descripcion || ""}
                onChange={(e) => handleChange("descripcion", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[80px]"
                placeholder="Descripción del objetivo"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cantidad de días</label>
              <input
                type="number"
                value={tareaEditada.cantidasDias || ""}
                onChange={(e) => handleChange("cantidasDias", Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                min={1}
              />
              {errores.cantidasDias && <p className="text-red-400 text-xs mt-1">{errores.cantidasDias}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fecha de finalización</label>
              <input
                type="date"
                value={tareaEditada.fechaFin || ""}
                onChange={(e) => handleChange("fechaFin", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {errores.fechaFin && <p className="text-red-400 text-xs mt-1">{errores.fechaFin}</p>}
            </div>
            {errores.general && <p className="text-red-400 text-xs mt-1">{errores.general}</p>}
            {success && <p className="text-emerald-400 text-xs mt-1">¡Guardado!</p>}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-white/10 hover:bg-white/20 text-white"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={guardarCambios}
                className="px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

export default EditarTareaModal