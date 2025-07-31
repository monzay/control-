import React, { createContext, useContext, useState, useCallback } from 'react';
import { CallApi } from "@/hooks/CallApi"; 

export const CanalContext = createContext(null);

export const CanalProvider = ({ children }) => {
  const [canales, setCanales] = useState([]);
  const [invitacionesPendientes, setInvitacionesPendientes] = useState([]);
  const { request, loading, error } = CallApi("http://localhost:4000/canal");

  const refrescarCanales = useCallback(async () => {
    try {
      const res = await request("/mis-canales");
      setCanales(res?.data || []);
    } catch (err) {
      setCanales([]);
    }
  }, [request]);

  const refrescarInvitacionesPendientes = useCallback(async () => {
    try {
      const res = await request("/invitaciones-pendientes");
      setInvitacionesPendientes(res?.data || []);
    } catch (err) {
      setInvitacionesPendientes([]);
    }
  }, [request]);

  const crearCanal = async (body) => {
    await request("/crear", { method: "POST", body });
    await refrescarCanales();
  };

  const eliminarCanal = async (canalId) => {
    await request(`/${canalId}`, { method: "DELETE" });
    await refrescarCanales();
  };

  const actualizarCanal = async (canalId, body) => {
    await request(`/${canalId}`, { method: "PATCH", body });
    await refrescarCanales();
  };

  const crearNotaCanal = async (canalId, body) => {
    await request(`/${canalId}/nota`, { method: "POST", body });
  };

  const crearObjetivoCanal = async (canalId, body) => {
    await request(`/${canalId}/objetivo`, { method: "POST", body });
  };

  const listarMiembrosCanal = async (canalId) => {
    const res = await request(`/${canalId}/miembros`);
    return res?.data || [];
  };

  const eliminarMiembroCanal = async (canalId, miembroId) => {
    await request(`/${canalId}/miembros/${miembroId}`, { method: "DELETE" });
  };

  const invitarUsuarioCanal = async (canalId, body) => {
    await request(`/${canalId}/invitar`, { method: "POST", body });
  };

  const modificarRolMiembro = async (canalId, usuarioId, body) => {
    await request(`/${canalId}/miembros/${usuarioId}/rol`, { method: "PATCH", body });
  };

  const actualizarNotaCanal = async (canalId, notaId, body) => {
    await request(`/${canalId}/nota/${notaId}`, { method: "PATCH", body });
  };

  const actualizarObjetivoCanal = async (canalId, objetivoId, body) => {
    await request(`/${canalId}/objetivo/${objetivoId}`, { method: "PATCH", body });
  };

  const crearHistorialCanal = async (canalId, body) => {
    await request(`/${canalId}/historial`, { method: "POST", body });
  };

  const aceptarInvitacionCanal = async (canalId) => {
    await request(`/${canalId}/aceptar-invitacion`, { method: "POST" });
    await refrescarInvitacionesPendientes();
    await refrescarCanales();
  };

  const rechazarInvitacionCanal = async (canalId) => {
    await request(`/${canalId}/rechazar-invitacion`, { method: "POST" });
    await refrescarInvitacionesPendientes();
  };
 
  return (
    <CanalContext.Provider
      value={{
        canales,
        invitacionesPendientes,
        loading,
        error,
        refrescarCanales,
        refrescarInvitacionesPendientes,
        crearCanal,
        eliminarCanal,
        actualizarCanal,
        crearNotaCanal,
        crearObjetivoCanal,
        listarMiembrosCanal,
        eliminarMiembroCanal,
        invitarUsuarioCanal,
        modificarRolMiembro,
        actualizarNotaCanal,
        actualizarObjetivoCanal,
        crearHistorialCanal,
        aceptarInvitacionCanal,
        rechazarInvitacionCanal,
      }}
    >
      {children}
    </CanalContext.Provider>
  );
};

export const useCanal = () => {
  const context = useContext(CanalContext);
  if (!context) {
    throw new Error('useCanal debe ser usado dentro de un CanalProvider');
  }
  return context;
}; 