import React, { useState, useEffect, useCallback } from 'react';
import { useCanal } from '@/Context/CanalContext';
import { Plus } from 'lucide-react';

const CanalNotas = ({ canalId }) => {
  const { crearNotaCanal, loading, error, request } = useCanal();
  const [notasCanal, setNotasCanal] = useState([]);
  const [showCreateNotaModal, setShowCreateNotaModal] = useState(false);
  const [newNotaTitulo, setNewNotaTitulo] = useState('');
  const [newNotaDescripcion, setNewNotaDescripcion] = useState('');
  const [newNotaFechaFin, setNewNotaFechaFin] = useState('');
  const [newNotaCantidadDias, setNewNotaCantidadDias] = useState('');

  const fetchNotasCanal = useCallback(async () => {
    try {
      const res = await request(`/${canalId}/notas`); // Asumiendo que existe un endpoint para listar notas del canal
      setNotasCanal(res?.data || []);
    } catch (err) {
      console.error("Error al obtener notas del canal:", err);
      setNotasCanal([]);
    }
  }, [canalId, request]);

  useEffect(() => {
    if (canalId) {
      fetchNotasCanal();
    }
  }, [canalId, fetchNotasCanal]);

  const handleCreateNota = async () => {
    if (newNotaTitulo.trim() === '') {
      alert('El título de la nota no puede estar vacío.');
      return;
    }
    const body = { 
      titulo: newNotaTitulo, 
      descripcion: newNotaDescripcion,
      fechaFin: newNotaFechaFin ? new Date(newNotaFechaFin).toISOString() : undefined,
      cantidadDias: newNotaCantidadDias ? Number(newNotaCantidadDias) : undefined,
    };
    await crearNotaCanal(canalId, body);
    setNewNotaTitulo('');
    setNewNotaDescripcion('');
    setNewNotaFechaFin('');
    setNewNotaCantidadDias('');
    setShowCreateNotaModal(false);
    fetchNotasCanal(); // Refrescar la lista de notas después de crear una
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-white">Notas del Canal</h2>
      
      <button
        onClick={() => setShowCreateNotaModal(true)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200 mb-4"
      >
        <Plus className="h-5 w-5 mr-2" />
        Añadir Nota
      </button>

      {showCreateNotaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
            <h2 className="text-2xl font-bold mb-5 text-white">Crear Nueva Nota</h2>
            <input
              type="text"
              placeholder="Título de la Nota"
              value={newNotaTitulo}
              onChange={(e) => setNewNotaTitulo(e.target.value)}
              className="bg-gray-700 text-white border border-gray-600 p-3 rounded-md w-full mb-4 focus:outline-none focus:border-emerald-500"
            />
            <textarea
              placeholder="Descripción (opcional)"
              value={newNotaDescripcion}
              onChange={(e) => setNewNotaDescripcion(e.target.value)}
              className="bg-gray-700 text-white border border-gray-600 p-3 rounded-md w-full mb-4 resize-y h-24 focus:outline-none focus:border-emerald-500"
            ></textarea>
            <input
              type="date"
              placeholder="Fecha Fin (opcional)"
              value={newNotaFechaFin}
              onChange={(e) => setNewNotaFechaFin(e.target.value)}
              className="bg-gray-700 text-white border border-gray-600 p-3 rounded-md w-full mb-4 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="number"
              placeholder="Cantidad Días (opcional)"
              value={newNotaCantidadDias}
              onChange={(e) => setNewNotaCantidadDias(e.target.value)}
              className="bg-gray-700 text-white border border-gray-600 p-3 rounded-md w-full mb-6 focus:outline-none focus:border-emerald-500"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCreateNota}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-lg transition-colors duration-200"
              >
                Crear Nota
              </button>
              <button
                onClick={() => setShowCreateNotaModal(false)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-lg transition-colors duration-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-white/70">Cargando notas...</p>
      ) : notasCanal && notasCanal.length > 0 ? (
        <ul className="space-y-3">
          {notasCanal.map((nota) => (
            <li key={nota.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <h3 className="text-emerald-400 text-lg font-semibold">{nota.titulo}</h3>
              {nota.descripcion && <p className="text-white/80 text-sm mt-1">{nota.descripcion}</p>}
              {nota.fechaFin && <p className="text-white/60 text-xs mt-1">Fecha Fin: {new Date(nota.fechaFin).toLocaleDateString()}</p>}
              {nota.cantidadDias && <p className="text-white/60 text-xs mt-1">Días: {nota.cantidadDias}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-white/70">No hay notas en este canal todavía.</p>
      )}
    </div>
  );
};

export default CanalNotas; 