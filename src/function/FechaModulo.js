
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

    /**
     * Obtiene el número de semana ISO del año (semana empieza en lunes)
     * La semana 1 es la que contiene el primer jueves del año
     * @returns {number} Número de semana (1-53)
     */
    obtenerNumeroSemana: () => {
      const ahora = new Date()
      const fecha = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())
      
      // Ajustar para que la semana empiece en lunes (ISO 8601)
      // getDay() devuelve 0=Domingo, 1=Lunes, ..., 6=Sábado
      // Ajustamos para que 0=Lunes, 1=Martes, ..., 6=Domingo
      const diaSemana = fecha.getDay() === 0 ? 7 : fecha.getDay()
      
      // Obtener el 4 de enero del año actual (el primer jueves del año siempre está en la semana 1)
      const enero4 = new Date(fecha.getFullYear(), 0, 4)
      const diaSemanaEnero4 = enero4.getDay() === 0 ? 7 : enero4.getDay()
      
      // Calcular el lunes de la semana que contiene el 4 de enero
      const lunesSemana1 = new Date(enero4)
      lunesSemana1.setDate(enero4.getDate() - diaSemanaEnero4 + 1)
      
      // Calcular el lunes de la semana actual
      const lunesSemanaActual = new Date(fecha)
      lunesSemanaActual.setDate(fecha.getDate() - diaSemana + 1)
      
      // Calcular la diferencia en milisegundos y convertir a semanas
      const diferencia = lunesSemanaActual - lunesSemana1
      const semanasTranscurridas = Math.floor(diferencia / (1000 * 60 * 60 * 24 * 7))
      
      return semanasTranscurridas + 1
    },

    /**
     * Obtiene la fecha del lunes de la semana actual en formato YYYY-MM-DD
     * @returns {string} Fecha del lunes de la semana actual (YYYY-MM-DD)
     */
    obtenerFechaInicioSemana: () => {
      const ahora = new Date()
      const fecha = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())
      
      // Ajustar para que la semana empiece en lunes
      const diaSemana = fecha.getDay() === 0 ? 7 : fecha.getDay()
      
      // Calcular el lunes de la semana actual
      const lunes = new Date(fecha)
      lunes.setDate(fecha.getDate() - diaSemana + 1)
      
      // Formatear como YYYY-MM-DD
      const año = lunes.getFullYear()
      const mes = String(lunes.getMonth() + 1).padStart(2, '0')
      const dia = String(lunes.getDate()).padStart(2, '0')
      
      return `${año}-${mes}-${dia}`
    },

    /**
     * Verifica si es el inicio de una nueva semana (lunes)
     * Compara la fecha del lunes actual con la última fecha de lunes registrada
     * @returns {boolean} true si es una nueva semana, false en caso contrario
     */
    esInicioNuevaSemana: () => {
      if (typeof window === 'undefined') {
        // Si no estamos en el navegador, retornar false
        return false;
      }
      
      // Obtener la fecha del lunes de la semana actual
      const ahora = new Date()
      const fecha = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())
      const diaSemana = fecha.getDay() === 0 ? 7 : fecha.getDay()
      const lunes = new Date(fecha)
      lunes.setDate(fecha.getDate() - diaSemana + 1)
      
      const año = lunes.getFullYear()
      const mes = String(lunes.getMonth() + 1).padStart(2, '0')
      const dia = String(lunes.getDate()).padStart(2, '0')
      const fechaInicioSemanaActual = `${año}-${mes}-${dia}`
      
      // Obtener la última fecha registrada
      const ultimaSemanaRegistrada = localStorage.getItem("ultima-semana-reinicio-fecha")
      
      // Si no hay registro previo o la fecha cambió, es una nueva semana
      return !ultimaSemanaRegistrada || ultimaSemanaRegistrada !== fechaInicioSemanaActual
    },
  }
  
  export default FechaModulo