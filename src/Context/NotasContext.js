import { createContext, useContext, useState, useCallback } from "react";
import { CallApi } from "@/hooks/CallApi"; 

const NotasContext = createContext();

export function NotasProvider({ children }) {
  const [notas, setNotas] = useState([]);
  const { request, loading, error } = CallApi("http://localhost:4000/nota"); // Instanciar el hook

  // Refrescar todas las notas
  const refrescarNotas = useCallback(async () => {
    try {
      const res = await request("/obtener");
      setNotas(res?.data || []);
    } catch (err) {
      // El error ya se maneja en el hook, pero puedes añadir lógica extra aquí si es necesario
      setNotas([]);
    }
  }, [request]);

  // Crear nota
  const crearNota = async (body) => {
    await request("/crear", { method: "POST", body });
    await refrescarNotas();
  };

  // Actualizar nota
  const actualizarNota = async (id, body) => {
    await request(`/actualizar/${id}`, { method: "PUT", body });
    await refrescarNotas();
  };

  // Eliminar nota
  const eliminarNota = async (id) => {
    await request(`/eliminar/${id}`, { method: "DELETE" });
    await refrescarNotas();
  };

  return (
    <NotasContext.Provider value={{
      notas,
      loading, // opcional: exponer el estado de carga
      error,   // opcional: exponer el estado de error
      refrescarNotas,
      crearNota,
      actualizarNota,
      eliminarNota
    }}>
      {children}
    </NotasContext.Provider>
  );
}

export function useNotas() {
  return useContext(NotasContext);
} 