import React, { useState, useEffect, useCallback } from 'react';
import { useCanal } from '@/Context/CanalContext';
import { Plus } from 'lucide-react';

const CanalObjetivos = ({ canalId }) => {
  const { crearObjetivoCanal, loading, error, request } = useCanal();
  const [objetivosCanal, setObjetivosCanal] = useState([]);
  const [showCreateObjetivoModal, setShowCreateObjetivoModal] = useState(false);
  const [newObjetivoTitulo, setNewObjetivoTitulo] = useState('');
  const [newObjetivoDescripcion, setNewObjetivoDescripcion] = useState('');
  const [newObjetivoFechaFin, setNewObjetivoFechaFin] = useState('');
  const [newObjetivoCantidadDias, setNewObjetivoCantidadDias] = useState('');

  const fetchObjetivosCanal = useCallback(async () => {
    try {
      const res = await request(`/${canalId}/objetivos`); // Asumiendo que existe un endpoint para listar objetivos del canal
      setObjetivosCanal(res?.data || []);
    } catch (err) {
      console.error("Error al obtener objetivos del canal:", err);
      setObjetivosCanal([]);
    }
  }, [canalId, request]);

  useEffect(() => {
    if (canalId) {
      fetchObjetivosCanal();
    }
  }, [canalId, fetchObjetivosCanal]);

  const handleCreateObjetivo = async () => {
    if (newObjetivoTitulo.trim() === '') {
      alert('El título del objetivo no puede estar vacío.');
      return;
    }
    const body = {
      titulo: newObjetivoTitulo,
      descripcion: newObjetivoDescripcion,
      fechaFin: newObjetivoFechaFin ? new Date(newObjetivoFechaFin).toISOString() : undefined,
      cantidadDias: newObjetivoCantidadDias ? Number(newObjetivoCantidadDias) : undefined,
    };
    await crearObjetivoCanal(canalId, body);
    setNewObjetivoTitulo('');
    setNewObjetivoDescripcion('');
    setNewObjetivoFechaFin('');
    setNewObjetivoCantidadDias('');
    setShowCreateObjetivoModal(false);
    fetchObjetivosCanal(); // Refrescar la lista de objetivos después de crear uno
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-inner border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-white">Objetivos del Canal</h2>

      <button
        onClick={() => setShowCreateObjetivoModal(true)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-200 mb-4"
      >
        <Plus className="h-5 w-5 mr-2" />
        Añadir Objetivo
      </button>

      {showCreateObjetivoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
            <h2 className="text-2xl font-bold mb-5 text-white">Crear Nuevo Objetivo</h2>
            <input
              type="text"
              placeholder="Título del Objetivo"
              value={newObjetivoTitulo}
              onChange={(e) => setNewObjetivoTitulo(e.target.value)}
              className="bg-gray-700 text-white border border-gray-600 p-3 rounded-md w-full mb-4 focus:outline-none focus:border-emerald-500"
            />
            <textarea
              placeholder="Descripción (opcional)"
              value={newObjetivoDescripcion}
              onChange={(e) => setNewObjetivoDescripcion(e.target.value)}
              className="bg-gray-700 text-white border border-gray-600 p-3 rounded-md w-full mb-4 resize-y h-24 focus:outline-none focus:border-emerald-500"
            ></textarea>
            <input
              type="date"
              placeholder="Fecha Fin (opcional)"
              value={newObjetivoFechaFin}
              onChange={(e) => setNewObjetivoFechaFin(e.target.value)}
              className="bg-gray-700 text-white border border-gray-600 p-3 rounded-md w-full mb-4 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="number"
              placeholder="Cantidad Días (opcional)"
              value={newObjetivoCantidadDias}
              onChange={(e) => setNewObjetivoCantidadDias(e.target.value)}
              className="bg-gray-700 text-white border border-gray-600 p-3 rounded-md w-full mb-6 focus:outline-none focus:border-emerald-500"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCreateObjetivo}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-lg transition-colors duration-200"
              >
                Crear Objetivo
              </button>
              <button
                onClick={() => setShowCreateObjetivoModal(false)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-lg transition-colors duration-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-white/70">Cargando objetivos...</p>
      ) : objetivosCanal && objetivosCanal.length > 0 ? (
        <ul className="space-y-3">
          {objetivosCanal.map((objetivo) => (
            <li key={objetivo.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <h3 className="text-emerald-400 text-lg font-semibold">{objetivo.titulo}</h3>
              {objetivo.descripcion && <p className="text-white/80 text-sm mt-1">{objetivo.descripcion}</p>}
              {objetivo.fechaFin && <p className="text-white/60 text-xs mt-1">Fecha Fin: {new Date(objetivo.fechaFin).toLocaleDateString()}</p>}
              {objetivo.cantidadDias && <p className="text-white/60 text-xs mt-1">Días: {objetivo.cantidadDias}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-white/70">No hay objetivos en este canal todavía.</p>
      )}
    </div>
  );
};

export default CanalObjetivos; 