import funcionesGlobales from "@/function/funcionesGlobales"

export default function RelojRestante({ horaActual, diaActualDelAnio, diasTotales }) {
  const diaNumero = diaActualDelAnio || funcionesGlobales.ObtenerDiaNumeroDelAño() || 1
  const progreso = (diaNumero / diasTotales) * 100

  return (
    <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-4 shadow-lg relative overflow-hidden">
      <div className="relative z-10">
        <div className="text-4xl font-mono font-light text-center mb-2">
          {String(23 - horaActual.getHours()).padStart(2, "0")}:{String(59 - horaActual.getMinutes()).padStart(2, "0")}
        </div>
        <div className="text-sm text-white/50 text-center">Tiempo restante del día</div>
        <div className="text-xs text-white/40 text-center mt-1">
          Día {diaNumero} de {diasTotales}
        </div>
        <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-400"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>
    </div>
  )
}
