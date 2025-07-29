import { createContext, useContext, useState, useCallback } from "react";
import { CallApi } from "../hooks/CallApi.js";

const ObjetivosContext = createContext();

export function ObjetivosProvider({ children }) {
  const { request } = CallApi("http://localhost:4000/objetivo");
  const [objetivos, setObjetivos] = useState([]);

  // Refrescar todos los objetivos
  const refrescarObjetivos = useCallback(async () => {
    try {
      const res = await request("/obtener", { method: "GET" });
      // Aseguramos que todos los objetivos tengan tipo: 'habito'
      const objetivosConTipo = (res?.data || []).map(obj => ({ ...obj, tipo: "habito" }));
      setObjetivos(objetivosConTipo)
    } catch (err) {
      console.log(err)
      setObjetivos([])
    }
  }, [request]);

  // Crear objetivo
  const crearObjetivo = async (body) => {
    await request("/crear", { method: "POST", body });
    refrescarObjetivos();
  };

  // Actualizar objetivo
  const actualizarObjetivo = async (id, body) => {
    await request(`/actualizar/${id}`, { method: "PUT", body });
    refrescarObjetivos();
  };

  // Eliminar objetivo
  const eliminarObjetivo = async (id) => {
    await request(`/eliminar/${id}`, { method: "DELETE" });
    refrescarObjetivos();
  };

  return (
    <ObjetivosContext.Provider value={{
      objetivos,
      refrescarObjetivos,
      crearObjetivo,
      actualizarObjetivo,
      eliminarObjetivo
    }}>
      {children}
    </ObjetivosContext.Provider>
  );
}

export function useObjetivos() {
  return useContext(ObjetivosContext);
} 