import React, { useEffect, useState } from 'react';
import { useCanal, CanalProvider } from '@/Context/CanalContext';
import { Plus, Bell } from 'lucide-react'; // Importar iconos de Lucide

const Canales = () => {
  const {
    canales,
    invitacionesPendientes,
    refrescarCanales,
    refrescarInvitacionesPendientes,
    aceptarInvitacionCanal,
    rechazarInvitacionCanal,
    loading,
    error,
    crearCanal
  } = useCanal();

  const [showInvitations, setShowInvitations] = useState(false);
  const [showCreateCanalModal, setShowCreateCanalModal] = useState(false);
  const [newCanalName, setNewCanalName] = useState('');
  const [newCanalDescription, setNewCanalDescription] = useState('');

  useEffect(() => {
    refrescarCanales();
    refrescarInvitacionesPendientes();
  }, [refrescarCanales, refrescarInvitacionesPendientes]);

  const handleAcceptInvitation = async (canalId) => {
    await aceptarInvitacionCanal(canalId);
    setShowInvitations(false);
  };

  const handleRejectInvitation = async (canalId) => {
    await rechazarInvitacionCanal(canalId);
  };

  const handleCreateCanal = async () => {
    if (newCanalName.trim() === '') {
      alert('El nombre del canal no puede estar vacío.');
      return;
    }
    await crearCanal({ nombre: newCanalName, descripcion: newCanalDescription });
    setNewCanalName('');
    setNewCanalDescription('');
    setShowCreateCanalModal(false);
  };

  if (loading) {
    return <p className="text-white/70">Cargando información de canales...</p>;
  }

  if (error) {
    return <p className="text-red-400">Error al cargar información de canales: {error.message}</p>;
  }

  return (
    <div className="p-4 bg-black/50 rounded-lg shadow-lg text-white">
      <div className="flex justify-between items-center mb-6">
        {/* Botón para crear un canal */}
        <button
          onClick={() => setShowCreateCanalModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          Crear Nuevo Canal
        </button>

        {/* Icono/Botón para desplegar invitaciones */}
        <div className="relative">
          <button
            onClick={() => setShowInvitations(!showInvitations)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
          >
            <Bell className="h-5 w-5 mr-2" />
            Invitaciones Pendientes ({invitacionesPendientes ? invitacionesPendientes.length : 0})
          </button>

          {showInvitations && (
            <div className="absolute right-0 z-10 mt-2 w-72 bg-gray-800 rounded-lg shadow-xl py-2 border border-gray-700">
              <h3 className="text-lg font-semibold px-4 py-2 text-white">Invitaciones:</h3>
              {invitacionesPendientes && invitacionesPendientes.length > 0 ? (
                <ul className="divide-y divide-gray-700">
                  {invitacionesPendientes.map((invitacion) => (
                    <li key={invitacion.id} className="px-4 py-3">
                      <p className="font-medium text-white">De: {invitacion.canal.creador.nombre} (<span className="text-white/70">{invitacion.canal.creador.email}</span>)</p>
                      <p className="text-sm text-white/80">Canal: {invitacion.canal.nombre}</p>
                      <div className="mt-3 flex justify-end space-x-2">
                        <button
                          onClick={() => handleAcceptInvitation(invitacion.canal.id)}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1.5 px-3 rounded-md transition-colors duration-200"
                        >
                          Aceptar
                        </button>
                        <button
                          onClick={() => handleRejectInvitation(invitacion.canal.id)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1.5 px-3 rounded-md transition-colors duration-200"
                        >
                          Rechazar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-2 text-white/70">No tienes invitaciones pendientes.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal para crear canal */}
      {showCreateCanalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
            <h2 className="text-2xl font-bold mb-5 text-white">Crear Nuevo Canal</h2>
            <input
              type="text"
              placeholder="Nombre del Canal"
              value={newCanalName}
              onChange={(e) => setNewCanalName(e.target.value)}
              className="bg-gray-700 text-white border border-gray-600 p-3 rounded-md w-full mb-4 focus:outline-none focus:border-emerald-500"
            />
            <textarea
              placeholder="Descripción del Canal (opcional)"
              value={newCanalDescription}
              onChange={(e) => setNewCanalDescription(e.target.value)}
              className="bg-gray-700 text-white border border-gray-600 p-3 rounded-md w-full mb-6 resize-y h-24 focus:outline-none focus:border-emerald-500"
            ></textarea>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCreateCanal}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-lg transition-colors duration-200"
              >
                Crear
              </button>
              <button
                onClick={() => setShowCreateCanalModal(false)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-lg transition-colors duration-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Canales del Usuario */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">Mis Canales</h2>
        {canales && canales.length > 0 ? (
          <ul className="space-y-3">
            {canales.map((miembroCanal) => (
              <li key={miembroCanal.canal.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600 flex justify-between items-center">
                <div>
                  <strong className="text-emerald-400 text-lg">{miembroCanal.canal.nombre}</strong>
                  <p className="text-white/80 text-sm">{miembroCanal.canal.descripcion}</p>
                </div>
                <span className="bg-gray-600 text-white text-xs font-semibold px-3 py-1 rounded-full">Rol: {miembroCanal.rol}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white/70">No perteneces a ningún canal todavía. ¡Crea uno o espera una invitación!</p>
        )}
      </div>
    </div>
  );
};

export default function CanalesWrapper() {
  return (
    <CanalProvider>
      <Canales />
    </CanalProvider>
  );
} 