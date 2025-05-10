
const FechaModulo = {
    obtenerColorProgresoAnual: (indiceDia, diasTotales, diaActualDelAnio, porcentajeCompletado = 0) => {
      // Si el día es futuro (después del día actual), devolver gris opaco
      if (indiceDia > diaActualDelAnio) {
        return "bg-gray-800"
      }
  
      // Para días pasados o el día actual, usar el porcentaje de completado con tonos de verde
      if (porcentajeCompletado < 25) {
        return "bg-green-900" // Verde muy oscuro
      } else if (porcentajeCompletado < 50) {
        return "bg-green-700" // Verde oscuro
      } else if (porcentajeCompletado < 75) {
        return "bg-green-500" // Verde medio
      } else {
        return "bg-green-400" // Verde claro
      }
    },
  
    formatearDuracion: (horas) => {
      if (horas === 1) return "1 hora"
      if (horas < 1) {
        const minutos = Math.round(horas * 60)
        return `${minutos} min`
      }
      return `${horas} horas`
    },
  
    obtenerFechaDia: (indiceDia) => {
      const ahora = new Date()
      const inicio = new Date(ahora.getFullYear(), 0, 0)
      inicio.setDate(inicio.getDate() + indiceDia)
      return inicio.toISOString().split("T")[0] 
      // "2025-01-01" 
    },
  
    esNuevaSemana: () => {
      // Verificar si es un nuevo lunes (día 1 de la semana)
      const hoy = new Date()
      return hoy.getDay() === 1 // 0 es domingo, 1 es lunes
    },
  
    obtenerNumeroSemana: () => {
      const ahora = new Date()
      const inicio = new Date(ahora.getFullYear(), 0, 1)
      const diff = ahora - inicio
      const unaSemana = 1000 * 60 * 60 * 24 * 7
      return Math.floor(diff / unaSemana) + 1
    },
  }
  
  export default FechaModulo