import { createContext, useContext, useState, useCallback } from "react";
import { CallApi } from "../hooks/CallApi.js";


const HistorialContext = createContext();

export function HistorialProvider({ children }) {
  const { request } = CallApi("http://localhost:4000/historial");
  const [historial, setHistorial] = useState([]);

  // Refrescar todo el historial
  const refrescarHistorial = useCallback(async () => {
    try {
      const res = await request("/obtenerhistorial", { method: "GET" });
      setHistorial(res?.data || [])
    } catch (error) {
      setHistorial([]);
    }
  }, [request]);

  // Crear historial (marcar tarea como completada)
  const crearHistorial = async (id) => {
    return await request(`/crear/${id}`, { method: "GET" });
  };

  // Obtener historial completo
  const obtenerHistorialCompleto = async () => {
    try {
      const res = await request("/obtenerhistorial", { method: "GET" });
      return res?.data || [];
    } catch (error) {
      console.error("Error al obtener historial completo:", error);
      return [];
    }
  };

  // Obtener porcentaje por día de la semana
  const obtenerPorcentajePorDiaSemana = async () => {
    try {
      const res = await request("/obtenerPorcentajeSemana", { method: "GET" });
      return res?.data || {};
    } catch (error) {
      console.error("Error al obtener porcentaje por día:", error);
      return {};
    }
  };

  // Obtener tasa de tareas completadas de la semana
  const obtenerTasaDeTareasCompletadasSemana = async () => {
    try {
      const res = await request("/", { method: "GET" });
      return res?.data || {};
    } catch (error) {
      console.error("Error al obtener tasa de tareas completadas:", error);
      return {};
    }
  };

  return (
    <HistorialContext.Provider value={{
      historial,
      setHistorial,
      refrescarHistorial,
      crearHistorial,
      obtenerHistorialCompleto,
      obtenerPorcentajePorDiaSemana,
      obtenerTasaDeTareasCompletadasSemana
    }}>
      {children}
    </HistorialContext.Provider>
  );
}

export function useHistorial() {
  return useContext(HistorialContext);
} 