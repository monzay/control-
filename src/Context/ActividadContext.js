import { createContext, useContext, useState, useCallback } from "react";
import { CallApi } from "@/hooks/CallApi"; 

const ActividadContext = createContext();

export function ActividadProvider({ children }) {
  const [actividades, setActividades] = useState([]);
  const { request, loading, error } = CallApi("http://localhost:4000/actividad");

  const refrescarActividades = useCallback(async () => {
    try {
      const res = await request("/obtener");
      setActividades(res?.data || []);
    } catch (err) {
      setActividades([]);
    }
  }, [request]);

  const actualizarActividad = async (body) => {
    await request(`/actulizar`, { method: "PUT", body });
    await refrescarActividades();
  };

  return (
    <ActividadContext.Provider value={{
      actividades,
      loading,
      error,
      refrescarActividades,
      actualizarActividad,
    }}>
      {children}
    </ActividadContext.Provider>
  );
}

export function useActividad() {
  return useContext(ActividadContext);
} 