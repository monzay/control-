import { useState  } from "react";

function SeccionObjetivo ({ guardarObjetivo }) {
    const [nuevoObjetivo, setNuevoObjetivo] = useState("");
  
    const manejarSubmit = (e) => {
      e.preventDefault();
      guardarObjetivo(nuevoObjetivo);
    };
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
        <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold mb-6">Define tu objetivo</h2>
          <form onSubmit={manejarSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="objetivo"
                className="block text-sm font-medium mb-2"
              >
                ¿Qué quieres lograr este año?
              </label>
              <input
                type="text"
                id="objetivo"
                value={nuevoObjetivo}
                onChange={(e) => setNuevoObjetivo(e.target.value)}
                placeholder="Ej: crear una agencia, aprender programación..."
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-md transition-colors"
            >
              Guardar objetivo
            </button>
          </form>
        </div>
      </div>
    );
  }

export default SeccionObjetivo  