"use client"
import { createContext, useContext, useState, useCallback } from "react";
import { CallApi } from "@/hooks/CallApi";

const PerfilContext = createContext();

export function PerfilProvider({ children }) {
  const [perfil, setPerfil] = useState(null);
  const { request, loading, error } = CallApi("http://localhost:4000/perfil");

  // Obtener perfil
  const obtenerPerfil = useCallback(async () => {
    try {
      const res = await request("/", { method: "GET" });
      setPerfil(res?.data || null);
    } catch (err) {
      setPerfil(null);
    }
  }, [request]);

  // Actualizar perfil (nombre y descripcion)
  const actualizarPerfil = async (body) => {
    await request("/", { method: "PATCH", body });
    await obtenerPerfil();
  };

  return (
    <PerfilContext.Provider value={{
      perfil,
      loading,
      error,
      obtenerPerfil,
      actualizarPerfil
    }}>
      {children}
    </PerfilContext.Provider>
  );
}

export function usePerfil() {
  return useContext(PerfilContext);
} 