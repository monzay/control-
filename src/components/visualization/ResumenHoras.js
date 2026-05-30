import { Clock, Timer } from "lucide-react"

export default function ResumenHoras({ tiempoPlanificado, tiempoLibre }) {
  return (
    <div className="flex items-center justify-center gap-6 px-2 pt-3 pb-1 border-t border-white/5">
      <div className="flex items-center gap-1.5">
        <Timer className="h-3 w-3 text-white/30" />
        <span className="text-xs text-white/30">Planificado</span>
        <span className="text-xs font-mono text-emerald-400/80">{tiempoPlanificado}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Clock className="h-3 w-3 text-white/30" />
        <span className="text-xs text-white/30">Libre</span>
        <span className="text-xs font-mono text-white/50">{tiempoLibre}</span>
      </div>
    </div>
  )
}
