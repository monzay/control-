import { useState, useEffect } from "react"
import { PenTool, X } from "lucide-react"
import { useNotas } from "@/Context/NotasContext";
import { contextoStateX } from "@/Context/ProviderStateX";

function EditarNotaModal({ nota, onClose, onSuccess }) {
  const { actualizarNota } = useNotas();
  const [notaEditada, setNotaEditada] = useState({
    titulo: "",
    descripcion: "",
    fechaRecordatorio: "",
    cantidadDias: "",
  })
  const [error, setError] = useState("")
  
  useEffect(() => {
    if (nota) {
      setNotaEditada({
        titulo: nota.titulo ,
        descripcion: nota.descripcion,
        fechaRecordatorio: nota.fechaFin, 
        cantidadDias: nota.cantidadDias ,
      })
    }
  }, [nota])

  const validarFormulario = () => {
    if (!notaEditada.titulo.trim()) {
      setError("El título es obligatorio")
      return false
    }
    if (!notaEditada.descripcion.trim()) {
      setError("La descripción es obligatoria")
      return false
    }
    setError("")
    return true
  }

  const guardarCambios = async () => {
    if (!validarFormulario()) return;
    const fechaFinFormateada = notaEditada.fechaRecordatorio
      ? new Date(notaEditada.fechaRecordatorio).toISOString().split("T")[0]
      : "";
    try {
      const body = {
        titulo: notaEditada.titulo,
        descripcion: notaEditada.descripcion,
        fechaFin: fechaFinFormateada,
        cantidadDias: Number(notaEditada.cantidadDias),
      };
      await actualizarNota(nota.id, body);
      onClose(); // Cierra el modal inmediatamente
      onSuccess && onSuccess({ ...notaEditada, id: nota.id, fechaFin: fechaFinFormateada });
    } catch (err) {
      console.log(err);
    }
  }


  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm p-4">
      <div className="p-4 shadow-lg max-w-md w-full p-5 animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <PenTool className="h-5 w-5 text-emerald-400" />
            Editar Nota
          </h3>
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
              value={notaEditada.titulo}
              onChange={(e) => setNotaEditada({ ...notaEditada, titulo: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Título de la nota"
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              value={notaEditada.descripcion}
              onChange={(e) => setNotaEditada({ ...notaEditada, descripcion: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500 min-h-[100px]"
              placeholder="Descripción de la nota"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha de recordatorio</label>
            <input
              type="date"
              value={notaEditada.fechaRecordatorio}
              onChange={(e) => setNotaEditada({ ...notaEditada, fechaRecordatorio: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cantidad de días</label>
            <input
              type="number"
              min="1"
              value={notaEditada.cantidadDias}
              onChange={(e) => setNotaEditada({ ...notaEditada, cantidadDias: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Ejemplo: 7"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-white/10 hover:bg-white/20 text-white"
            >
              Cancelar
            </button>
            <button
              onClick={guardarCambios}
              className="px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-green-600 hover:bg-green-700 text-white"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditarNotaModal 