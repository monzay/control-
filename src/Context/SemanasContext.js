import { createContext, useContext, useState, useCallback } from "react";
import { CallApi } from "../hooks/CallApi.js";

const SemanasContext = createContext();

export function SemanasProvider({ children }) {
  const { request } = CallApi("http://localhost:4000/semana");
  const [semanas, setSemanas] = useState([]);

  // Refrescar todas las semanas
  const refrescarSemanas = useCallback(async () => {
    try {
      const res = await request("/obtener", { method: "GET" });
      setSemanas(res?.data || []);
    } catch (error) {
      setSemanas([]);
    }
  }, [request]);

  // Crear semana
  const crearSemana = async (body) => {
    await request("/crear", { method: "POST", body });
    refrescarSemanas();
  };

  // Actualizar semana
  const actualizarSemana = async (id, body) => {
    await request(`/actulizar/${id}`, { method: "PATCH", body });
    refrescarSemanas();
  };

  // Eliminar semana
  const eliminarSemana = async (id) => {
    await request(`/eliminar/${id}`, { method: "DELETE" });
    refrescarSemanas();
  };

  // Obtener semana por ID
  const obtenerSemanaPorId = async (id) => {
    try {
      const res = await request(`/obtenerId/${id}`, { method: "GET" });
      return res?.data;
    } catch (error) {
      console.error("Error al obtener semana:", error);
      return null;
    }
  };

  // Reiniciar semana
  const reiniciarSemana = async () => {
    try {
      await request("/reiniciar", { method: "POST" });
      refrescarSemanas();
    } catch (error) {
      console.error("Error al reiniciar semana:", error);
    }
  };

  // Clonar día
  const clonarDia = async (diaOrigen, diaDestino) => {
    await request("/clonar", { method: "POST", body: { diaOrigen, diaDestino } });
    refrescarSemanas();
  };

  return (
    <SemanasContext.Provider value={{
      semanas,
      setSemanas,
      refrescarSemanas,
      crearSemana,
      actualizarSemana,
      eliminarSemana,
      obtenerSemanaPorId,
      reiniciarSemana,
      clonarDia // <-- exportar la función
    }}>
      {children}
    </SemanasContext.Provider>
  );
}

export function useSemanas() {
  return useContext(SemanasContext);
} 