/**
 * Módulo para gestionar la racha del usuario
 * 
 * ALGORITMO DE RACHA:
 * 1. La racha aumenta cuando el usuario completa al menos UNA tarea al día
 * 2. Si no completa ninguna tarea en un día, la racha se reinicia a 0
 * 3. La racha máxima se guarda en localStorage pero NO se muestra
 * 4. Se verifica automáticamente al completar tareas y al cambiar el día
 */

const RachaModulo = {
  /**
   * Obtiene la fecha actual en formato YYYY-MM-DD
   * @returns {string} Fecha actual en formato YYYY-MM-DD
   */
  obtenerFechaHoy: () => {
    return new Date().toISOString().split("T")[0];
  },

  /**
   * Obtiene la racha actual del usuario desde localStorage
   * @returns {number} Racha actual (0 si no existe)
   */
  obtenerRachaActual: () => {
    if (typeof window === "undefined") return 0;
    const racha = localStorage.getItem("usuario-racha-actual");
    return racha ? parseInt(racha, 10) : 0;
  },

  /**
   * Guarda la racha actual en localStorage
   * @param {number} racha - Racha actual a guardar
   */
  guardarRachaActual: (racha) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("usuario-racha-actual", racha.toString());
  },

  /**
   * Obtiene la última fecha en que se completó al menos una tarea
   * @returns {string|null} Fecha en formato YYYY-MM-DD o null si no existe
   */
  obtenerUltimaFechaCompletada: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("usuario-ultima-fecha-completada");
  },

  /**
   * Guarda la última fecha en que se completó al menos una tarea
   * @param {string} fecha - Fecha en formato YYYY-MM-DD
   */
  guardarUltimaFechaCompletada: (fecha) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("usuario-ultima-fecha-completada", fecha);
  },

  /**
   * Obtiene la racha máxima del usuario (guardada pero no mostrada)
   * @returns {number} Racha máxima (0 si no existe)
   */
  obtenerRachaMaxima: () => {
    if (typeof window === "undefined") return 0;
    const rachaMax = localStorage.getItem("usuario-racha-maxima");
    return rachaMax ? parseInt(rachaMax, 10) : 0;
  },

  /**
   * Guarda la racha máxima si la racha actual es mayor
   * @param {number} rachaActual - Racha actual a comparar
   */
  actualizarRachaMaxima: (rachaActual) => {
    if (typeof window === "undefined") return;
    const rachaMaximaActual = RachaModulo.obtenerRachaMaxima();
    if (rachaActual > rachaMaximaActual) {
      localStorage.setItem("usuario-racha-maxima", rachaActual.toString());
    }
  },

  /**
   * Verifica si se completó al menos una tarea en una fecha específica
   * @param {string} fecha - Fecha a verificar en formato YYYY-MM-DD
   * @param {Array} tareasSemana - Array de tareas semanales
   * @param {Array} tareas - Array de tareas/hábitos
   * @returns {boolean} true si se completó al menos una tarea ese día
   */
  seCompletoAlMenosUnaTarea: (fecha, tareasSemana = [], tareas = []) => {
    // Verificar tareas/hábitos: buscar en el historial si se completó ese día
    const tareaCompletadaEnFecha = tareas.some((tarea) => {
      if (!tarea.historial || !Array.isArray(tarea.historial)) return false;
      return tarea.historial.some(
        (h) => h.fecha === fecha && h.completada === true
      );
    });

    // Si ya encontramos una tarea completada, retornar true
    if (tareaCompletadaEnFecha) return true;

    // Para tareas semanales, verificamos usando los datos guardados en localStorage
    // que guardan el porcentaje de tareas completadas por día
    if (typeof window !== "undefined") {
      const datosDias = localStorage.getItem("datos-dias-porcentajes");
      if (datosDias) {
        try {
          const datos = JSON.parse(datosDias);
          const datoDia = datos.find((d) => d.fecha === fecha);
          // Si hay datos para ese día y el porcentaje es mayor a 0, 
          // significa que se completó al menos una tarea
          if (datoDia && datoDia.porcentaje > 0) {
            return true;
          }
        } catch (e) {
          console.warn("Error al parsear datos-dias-porcentajes:", e);
        }
      }
    }

    // Si la fecha es hoy, también verificar tareas semanales completadas actualmente
    const fechaHoy = RachaModulo.obtenerFechaHoy();
    if (fecha === fechaHoy) {
      const fechaObj = new Date(fecha + "T00:00:00");
      const diaSemana = fechaObj.getDay(); // 0 = domingo, 1 = lunes, etc.
      const diasSemanaNombres = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
      const nombreDia = diasSemanaNombres[diaSemana];

      const tareaSemanalCompletadaHoy = tareasSemana.some((tarea) => {
        // Verificar si la tarea corresponde al día de la semana de la fecha
        // y está completada
        return tarea.dia === nombreDia && tarea.completada === true;
      });

      if (tareaSemanalCompletadaHoy) return true;
    }

    return false;
  },

  /**
   * Verifica y actualiza la racha cuando se completa una tarea
   * @param {Array} tareasSemana - Array de tareas semanales
   * @param {Array} tareas - Array de tareas/hábitos
   * @returns {number} Nueva racha actual
   */
  actualizarRachaPorCompletado: (tareasSemana = [], tareas = []) => {
    const fechaHoy = RachaModulo.obtenerFechaHoy();
    const ultimaFechaCompletada = RachaModulo.obtenerUltimaFechaCompletada();
    let rachaActual = RachaModulo.obtenerRachaActual();

    // Si ya se completó una tarea hoy, no hacer nada (evitar múltiples incrementos)
    if (ultimaFechaCompletada === fechaHoy) {
      return rachaActual;
    }

    // Verificar si ayer se completó al menos una tarea
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    const fechaAyer = ayer.toISOString().split("T")[0];

    if (ultimaFechaCompletada === fechaAyer) {
      // Ayer se completó, incrementar racha
      rachaActual += 1;
    } else if (!ultimaFechaCompletada) {
      // Primera vez que se completa una tarea
      rachaActual = 1;
    } else {
      // Hubo un día sin completar, reiniciar racha
      rachaActual = 1;
    }

    // Guardar nueva racha
    RachaModulo.guardarRachaActual(rachaActual);
    RachaModulo.guardarUltimaFechaCompletada(fechaHoy);
    RachaModulo.actualizarRachaMaxima(rachaActual);

    return rachaActual;
  },

  /**
   * Verifica días pasados que no se completó ninguna tarea y reinicia la racha si es necesario
   * Se debe llamar al cargar la app o cuando cambia el día
   * @param {Array} tareasSemana - Array de tareas semanales
   * @param {Array} tareas - Array de tareas/hábitos
   * @returns {number} Racha actual actualizada
   */
  verificarYActualizarRacha: (tareasSemana = [], tareas = []) => {
    const fechaHoy = RachaModulo.obtenerFechaHoy();
    const ultimaFechaCompletada = RachaModulo.obtenerUltimaFechaCompletada();

    // Si no hay fecha previa, iniciar racha
    if (!ultimaFechaCompletada) {
      // Verificar si hoy se completó al menos una tarea
      const completadaHoy = RachaModulo.seCompletoAlMenosUnaTarea(
        fechaHoy,
        tareasSemana,
        tareas
      );
      if (completadaHoy) {
        RachaModulo.guardarRachaActual(1);
        RachaModulo.guardarUltimaFechaCompletada(fechaHoy);
        RachaModulo.actualizarRachaMaxima(1);
        return 1;
      }
      return 0;
    }

    // Calcular diferencia de días entre la última fecha completada y hoy
    const ultimaFecha = new Date(ultimaFechaCompletada + "T00:00:00");
    const hoy = new Date(fechaHoy + "T00:00:00");
    const diferenciaDias = Math.floor((hoy - ultimaFecha) / (1000 * 60 * 60 * 24));

    // Si pasó más de un día, verificar días intermedios
    if (diferenciaDias > 1) {
      // Verificar todos los días entre la última fecha y hoy
      let huboDiaSinCompletar = false;
      
      for (let i = 1; i < diferenciaDias; i++) {
        const fechaIntermedia = new Date(ultimaFecha);
        fechaIntermedia.setDate(fechaIntermedia.getDate() + i);
        const fechaIntermediaStr = fechaIntermedia.toISOString().split("T")[0];
        
        const completadaIntermedia = RachaModulo.seCompletoAlMenosUnaTarea(
          fechaIntermediaStr,
          tareasSemana,
          tareas
        );

        if (!completadaIntermedia) {
          huboDiaSinCompletar = true;
          break; // Si hay un día sin completar, la racha se rompe
        }
      }

      // Si hubo un día sin completar, reiniciar racha
      if (huboDiaSinCompletar) {
        // Verificar si hoy se completó al menos una tarea
        const completadaHoy = RachaModulo.seCompletoAlMenosUnaTarea(
          fechaHoy,
          tareasSemana,
          tareas
        );
        if (completadaHoy) {
          RachaModulo.guardarRachaActual(1);
          RachaModulo.guardarUltimaFechaCompletada(fechaHoy);
          RachaModulo.actualizarRachaMaxima(1);
          return 1;
        } else {
          RachaModulo.guardarRachaActual(0);
          return 0;
        }
      }
    }

    // Si ayer fue la última fecha completada, verificar si hoy se completó
    if (diferenciaDias === 1) {
      const completadaHoy = RachaModulo.seCompletoAlMenosUnaTarea(
        fechaHoy,
        tareasSemana,
        tareas
      );
      if (completadaHoy) {
        // Incrementar racha
        const rachaActual = RachaModulo.obtenerRachaActual() + 1;
        RachaModulo.guardarRachaActual(rachaActual);
        RachaModulo.guardarUltimaFechaCompletada(fechaHoy);
        RachaModulo.actualizarRachaMaxima(rachaActual);
        return rachaActual;
      } else {
        // No se completó hoy, pero aún no se rompió la racha (el día no terminó)
        return RachaModulo.obtenerRachaActual();
      }
    }

    // Si hoy es la misma fecha, mantener racha actual
    if (diferenciaDias === 0) {
      return RachaModulo.obtenerRachaActual();
    }

    // Si la última fecha es futura (caso de cambio de fecha del sistema), reiniciar
    if (diferenciaDias < 0) {
      const completadaHoy = RachaModulo.seCompletoAlMenosUnaTarea(
        fechaHoy,
        tareasSemana,
        tareas
      );
      if (completadaHoy) {
        RachaModulo.guardarRachaActual(1);
        RachaModulo.guardarUltimaFechaCompletada(fechaHoy);
        RachaModulo.actualizarRachaMaxima(1);
        return 1;
      }
      return 0;
    }

    return RachaModulo.obtenerRachaActual();
  },

  /**
   * Reinicia la racha a 0 (útil para testing o reinicio manual)
   */
  reiniciarRacha: () => {
    if (typeof window === "undefined") return;
    RachaModulo.guardarRachaActual(0);
    localStorage.removeItem("usuario-ultima-fecha-completada");
  },

  /**
   * Hitos de racha para mostrar mensajes (5 mensajes en total)
   */
  HITOS_RACHA: [1, 7, 14, 30, 50],

  /**
   * Obtiene el mensaje de hito según la racha actual
   * @param {number} racha - Racha actual
   * @returns {object|null} Objeto con mensaje y racha, o null si no hay mensaje para esta racha
   */
  obtenerMensajeHito: (racha) => {
    const mensajes = {
      1: {
        racha: 1,
        partes: [
          "bien al fin arrancaste  este es el primer paso capo",
          `${racha} día`,
          " - ¡Sigue así y mantén tu consistencia!",
        ],
      },
      7: {
        racha: 7,
        partes: [
          "¡Increíble! Llevas ",
          `${racha} días`,
          " de racha - ¡Una semana completa! Tu dedicación es admirable.",
        ],
      },
      14: {
        racha: 14,
        partes: [
          "¡Wow! Ya son ",
          `${racha} días`,
          " de racha - ¡Dos semanas consecutivas! Estás construyendo un hábito sólido.",
        ],
      },
      30: {
        racha: 30,
        partes: [
          "¡ÉPICO! Has alcanzado ",
          `${racha} días`,
          " de racha - ¡Un mes completo! Eres una máquina de la consistencia.",
        ],
      },
      50: {
        racha: 50,
        partes: [
          "¡LEGENDARIO! Has superado ",
          `${racha} días`,
          " de racha - ¡Eres una verdadera leyenda! Tu compromiso es inspirador.",
        ],
      },
    };

    return mensajes[racha] || null;
  },

  /**
   * Verifica si se debe mostrar un mensaje de hito para la racha actual
   * @param {number} racha - Racha actual
   * @returns {object|null} Mensaje de hito si corresponde, null en caso contrario
   */
  verificarMensajeHito: (racha) => {
    if (!racha || racha === 0) return null;

    // Verificar si la racha coincide con algún hito
    if (RachaModulo.HITOS_RACHA.includes(racha)) {
      // Verificar si ya se mostró este mensaje
      const mensajesMostrados = RachaModulo.obtenerMensajesMostrados();
      if (!mensajesMostrados.includes(racha)) {
        const mensaje = RachaModulo.obtenerMensajeHito(racha);
        if (mensaje) {
          // Marcar como mostrado
          RachaModulo.marcarMensajeMostrado(racha);
          return mensaje;
        }
      }
    }

    return null;
  },

  /**
   * Obtiene la lista de mensajes de hito que ya se mostraron
   * @returns {Array} Array de números de racha que ya se mostraron
   */
  obtenerMensajesMostrados: () => {
    if (typeof window === "undefined") return [];
    const mensajes = localStorage.getItem("usuario-mensajes-racha-mostrados");
    return mensajes ? JSON.parse(mensajes) : [];
  },

  /**
   * Marca un mensaje de hito como mostrado
   * @param {number} racha - Racha del hito que se mostró
   */
  marcarMensajeMostrado: (racha) => {
    if (typeof window === "undefined") return;
    const mensajesMostrados = RachaModulo.obtenerMensajesMostrados();
    if (!mensajesMostrados.includes(racha)) {
      mensajesMostrados.push(racha);
      localStorage.setItem("usuario-mensajes-racha-mostrados", JSON.stringify(mensajesMostrados));
    }
  },
};

export default RachaModulo;

