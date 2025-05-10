export default function ResumenHoras({ tiempoPlanificado, tiempoLibre }) {
  return (
    <div className="mt-6 backdrop-blur-md bg-black/30 rounded-xl border border-white/10 shadow-lg overflow-hidden">
      <div className="grid grid-cols-2 divide-x divide-white/10">
        <div className="p-4 relative overflow-hidden transition-all hover:bg-white/5">
          <div className="flex flex-col items-start">
            <h4 className="text-xs uppercase tracking-wider text-white/50 mb-1 flex items-center">
              Tiempo planificado
            </h4>
            <p className="text-2xl font-mono font-light text-emerald-400">
              {tiempoPlanificado}
            </p>
          </div>
        </div>
        <div className="p-4 relative overflow-hidden transition-all hover:bg-white/5">
          <div className="flex flex-col items-start">
            <h4 className="text-xs uppercase tracking-wider text-white/50 mb-1 flex items-center">Tiempo libre</h4>
            <p className="text-2xl font-mono font-light text-emerald-400">
              {tiempoLibre}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 
