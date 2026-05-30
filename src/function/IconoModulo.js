import { Sparkles, PenTool, Award } from "lucide-react"

const IconoModulo = {
    obtenerIconoTarea: (tipo) => {
      switch (tipo) {
        case "habito":
          return <Sparkles className="h-4 w-4 text-emerald-400" />
        case "nota":
          return <PenTool className="h-4 w-4 text-emerald-400" />
        default:
          return null
      }
    },
  
    obtenerClaseColorPrioridad: (prioridad) => {
      switch (prioridad) {
        case 3:
          return "bg-emerald-500/20 text-emerald-400"
        case 2:
          return "bg-emerald-500/20 text-emerald-400"
        case 1:
          return "bg-emerald-500/20 text-emerald-400"
        default:
          return "bg-emerald-500/20 text-emerald-400"
      }
    },
  
    obtenerColorReputacion: (reputacion) => {
      if (reputacion >= 90) return "text-emerald-400"
      if (reputacion >= 75) return "text-emerald-400"
      if (reputacion >= 50) return "text-emerald-400"
      if (reputacion >= 25) return "text-emerald-400"
      return "text-emerald-400"
    },
  
    obtenerIconoReputacion: (reputacion) => {
      if (reputacion >= 90) return <Award className="h-4 w-4 text-emerald-400" />
      if (reputacion >= 75) return <Award className="h-4 w-4 text-emerald-400" />
      if (reputacion >= 50) return <Award className="h-4 w-4 text-emerald-400" />
      if (reputacion >= 25) return <Award className="h-4 w-4 text-emerald-400" />
      return <Award className="h-4 w-4 text-emerald-400" />
    },
    
  }

export default IconoModulo