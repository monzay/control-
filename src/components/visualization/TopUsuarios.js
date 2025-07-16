
import { Trophy, Medal } from 'lucide-react'
import { useState, useEffect } from 'react'
import { CallApi } from '@/hooks/CallApi'

function TopUsuarios() {
  const [topUsuarios, setTopUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tipo, setTipo] = useState('week') // week por defecto
  const { request } = CallApi('http://localhost:4000') // Cambia la URL si tu backend es diferente

  const obtenerTop = async (tipoSeleccionado) => {
    setLoading(true)
    setError(null)
    try {
      const respuesta = await request('/top', {
        method: 'POST',
        body: { tipo: tipoSeleccionado },
      })
      if (respuesta && respuesta.data) {
        setTopUsuarios(respuesta.data)
        console.log(respuesta)
      } else {
        setTopUsuarios([])
      }
    } catch (err) {
      setError('No se pudo obtener el top de usuarios')
      setTopUsuarios([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    obtenerTop(tipo)
    // eslint-disable-next-line
  }, [tipo])

  const handleTipoChange = (nuevoTipo) => {
    if (nuevoTipo !== tipo) {
      setTipo(nuevoTipo)
    }
  }

  return (
    <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-4 shadow-lg mb-4">
      <h3 className="text-sm font-medium mb-3 text-white/70 flex items-center gap-2">
        <Trophy className="h-4 w-4 text-emerald-400" />
        Top Usuarios
      </h3>
      <div className="flex gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors duration-200 ${tipo === 'week' ? 'bg-emerald-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
          onClick={() => handleTipoChange('week')}
        >
          Semana
        </button>
        <button
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors duration-200 ${tipo === 'month' ? 'bg-emerald-600 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
          onClick={() => handleTipoChange('month')}
        >
          Mes
        </button>
      </div>
      {loading ? (
        <div className="text-center text-white/50 py-4">Cargando...</div>
      ) : error ? (
        <div className="text-center text-red-400 py-4">{error}</div>
      ) : !topUsuarios || topUsuarios.length === 0 ? (
        <div className="text-center text-white/50 py-4">No hay usuarios en el top</div>
      ) : (
        <div className="space-y-3">
          {topUsuarios.map((usuario, index) => (
            <div key={usuario.email || index} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white/10
                ${index === 0 ? 'bg-yellow-400 text-black' : index === 1 ? 'bg-gray-400 text-black' : 'bg-amber-700'}`}
                >
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-medium truncate">{usuario.nombre || 'Sin nombre'}</p>
                </div>
                <p className="text-xs text-white/50 flex items-center gap-1">
                  <Medal className="h-3 w-3 text-emerald-400" />
                  {usuario.email || 'Sin email'}
                </p>
                <p className="text-xs text-emerald-300 mt-1">
                  Promedio: <span className="font-bold">{usuario.promedio?.toFixed(2) ?? 0}%</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TopUsuarios