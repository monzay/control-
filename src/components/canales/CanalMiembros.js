import React, { useState, useEffect, useCallback } from 'react';
import { useCanal } from '@/Context/CanalContext';
import { Users, Edit } from 'lucide-react';

const CanalMiembros = ({ canalId, miembros: initialMembers, creadorId }) => {
  const { listarMiembrosCanal, modificarRolMiembro, eliminarMiembroCanal, loading, error } = useCanal();
  const [miembros, setMiembros] = useState(initialMembers || []); // Usar initialMembers como valor inicial
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [newRole, setNewRole] = useState('');

  const fetchMiembros = useCallback(async () => {
    if (canalId) {
      const fetchedMiembros = await listarMiembrosCanal(canalId);
      setMiembros(fetchedMiembros);
    }
  }, [canalId, listarMiembrosCanal]);

  useEffect(() => {
    // Si initialMembers está vacío o es diferente, o si canalId cambia, se vuelve a cargar.
    // Esto asegura que la carga inicial se haga y que se recarguen si las props cambian
    if (initialMembers && initialMembers.length > 0) {
        setMiembros(initialMembers);
    } else {
        fetchMiembros();
    }
  }, [canalId, initialMembers, fetchMiembros]);

  // Observar cambios en initialMembers para actualizar el estado interno si el padre refresca
  useEffect(() => {
    setMiembros(initialMembers || []);
  }, [initialMembers]);

  const handleEditRole = (miembro) => {
    setEditingMemberId(miembro.usuarioId);
    setNewRole(miembro.rol);
  };

  const handleSaveRole = async (usuarioId) => {
    await modificarRolMiembro(canalId, usuarioId, { nuevoRol: newRole });
    setEditingMemberId(null);
    fetchMiembros(); // Llamar a fetchMiembros para actualizar la lista
  };

  const handleCancelEdit = () => {
    setEditingMemberId(null);
    setNewRole('');
  };

  const handleDeleteMiembro = async (miembroId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar a este miembro del canal?')) {
      await eliminarMiembroCanal(canalId, miembroId);
      fetchMiembros(); // Llamar a fetchMiembros para actualizar la lista
    }
  };

  if (loading) {
    return <p className="text-white/70">Cargando miembros...</p>;
  }

  if (error) {
    return <p className="text-red-400">Error al cargar miembros: {error.message}</p>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-700 col-span-1 md:col-span-2">
      <h2 className="text-xl font-semibold mb-4 text-white">Miembros y Roles</h2>
      {miembros && miembros.length > 0 ? (
        <ul className="space-y-3">
          { miembros && miembros.map((miembro) => (
            <li key={miembro.usuarioId} className="bg-gray-700 p-4 rounded-lg border border-gray-600 flex justify-between items-center">
              <div>
                <p className="font-medium text-white">{miembro.usuario.nombre} (<span className="text-white/70">{miembro.usuario.email}</span>)</p>
                {editingMemberId === miembro.usuarioId ? (
                  <div className="flex items-center mt-2">
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="bg-gray-600 text-white p-2 rounded-md mr-2 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="MODERADOR">MODERADOR</option>
                      <option value="MIEMBRO">MIEMBRO</option>
                    </select>
                    <button
                      onClick={() => handleSaveRole(miembro.usuarioId)}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1.5 px-3 rounded-md transition-colors duration-200"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 hover:bg-gray-600 text-white text-xs font-bold py-1.5 px-3 rounded-md transition-colors duration-200 ml-2"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <span className="bg-gray-600 text-white text-xs font-semibold px-3 py-1 rounded-full mt-1">Rol: {miembro.rol} {miembro.usuarioId === creadorId && <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">Creador</span>}</span>
                )}
              </div>
              {creadorId === miembro.canal.creadorId && miembro.usuarioId !== creadorId && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditRole(miembro)}
                    className="text-emerald-400 hover:text-emerald-300 p-1 rounded-full transition-colors duration-200"
                    title="Editar Rol"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteMiembro(miembro.id)}
                    className="text-red-400 hover:text-red-300 p-1 rounded-full transition-colors duration-200"
                    title="Eliminar Miembro"
                  >
                    <Users className="h-5 w-5" />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-white/70">No hay miembros en este canal todavía.</p>
      )}
    </div>
  );
};

export default CanalMiembros; 