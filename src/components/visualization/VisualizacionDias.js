import { useContext, useState } from "react";
import { ContextVolverACargarTareasFiltradas } from "@/Context/ProviderVolverACargarTareasFiltradas";
import funcionesGlobales from "@/function/funcionesGlobales";



/**
 * Componente de Visualización de Días - Muestra calendario estilo GitHub
 */
function VisualizacionDias({
  diasTotales,
  diaActualDelAnio,
  tareas = [],
  fechasImportantes = [],
  tareasSemana = [],
  diasSemana = [],
  setDiaSemanaSeleccionado,
  setVistaActiva,
}) {


  // Configuración para que se vea como la imagen de referencia
  const anioActual = new Date().getFullYear();
  const anioSiguiente = anioActual + 1;
  
  // Valores por defecto para evitar undefined
  const diaActualDelAnioValido = diaActualDelAnio ?? funcionesGlobales.ObtenerDiaNumeroDelAño() ?? 1;
  const diasTotalesValido = diasTotales ?? 365;
  const [diaHover, setDiaHover] = useState(null);
  const [anioHover, setAnioHover] = useState(null); // Para saber en qué año está el hover
  const [mostrarAnioSiguiente, setMostrarAnioSiguiente] = useState(false); // Estado para mostrar/ocultar año siguiente
  const [mostrarSoloProgreso, setMostrarSoloProgreso] = useState(false); // Estado para mostrar solo progreso sin fechas especiales
  const { setVolverCargarTareasFiltradas } = useContext(ContextVolverACargarTareasFiltradas);
  
  // Función auxiliar para obtener fecha de un día de un año específico
  const obtenerFechaDiaPorAnio = (indiceDia, anio) => {
    // El 1 de enero es el día 1, no el día 0
    // Creamos el 1 de enero del año y le restamos 1 día, luego sumamos el índice
    const inicio = new Date(anio, 0, 1);
    inicio.setDate(inicio.getDate() + indiceDia - 1);
    return inicio.toISOString().split("T")[0];
  };

  // Calcular porcentaje de tareas completadas por día
  const calcularPorcentajeCompletadoPorDia = (dia, anio = anioActual) => {
    const fechaDia = obtenerFechaDiaPorAnio(dia, anio);

    // Obtener tareas de "Mi Semana" para este día
    const diaSemana = new Date(fechaDia)
      .toLocaleDateString("es-ES", { weekday: "long" })
      .toLowerCase();
    const tareasSemanaDelDia = tareasSemana.filter(
      (tarea) => tarea.dia === diaSemana
    );

    // Obtener tareas regulares con historial para este día
    const tareasRegularesDelDia = tareas.filter((tarea) => {
      return tarea.historial?.some((h) => h.fecha === fechaDia);
    });

    // Combinar ambos tipos de tareas
    const todasLasTareasDelDia = [
      ...tareasSemanaDelDia,
      ...tareasRegularesDelDia,
    ];

    if (todasLasTareasDelDia.length === 0) return 0;

    // Contar completadas en tareas semanales
    const completadasSemana = tareasSemanaDelDia.filter(
      (tarea) => tarea.completada
    ).length;

    // Contar completadas en tareas regulares
    const completadasRegulares = tareasRegularesDelDia.filter((tarea) => {
      return tarea.historial?.some((h) => h.fecha === fechaDia && h.completada);
    }).length;

    const totalCompletadas = completadasSemana + completadasRegulares;
    return (totalCompletadas / todasLasTareasDelDia.length) * 100;
  };

  // Obtener información de fechas importantes para un día
  const obtenerInfoFechaImportante = (dia, anio = anioActual) => {
    const fechaDia = obtenerFechaDiaPorAnio(dia, anio);
    return fechasImportantes.find((fecha) => fecha.fecha === fechaDia);
  };

  // Mapea porcentaje de completado a clase de color verde
  const colorPorPorcentaje = (p) => {
    if (p < 25) return "bg-gradient-to-r from-green-900 to-green-800";
    if (p < 50) return "bg-gradient-to-r from-green-700 to-green-600";
    if (p < 75) return "bg-gradient-to-r from-green-500 to-green-400";
    return "bg-gradient-to-r from-green-400 to-green-300";
  };

  // Obtiene el porcentaje del día desde localStorage (o lo calcula y lo guarda)
  const obtenerPorcentajeDia = (dia, anio) => {
    const fechaDia = obtenerFechaDiaPorAnio(dia, anio);
    if (typeof window === "undefined") return calcularPorcentajeCompletadoPorDia(dia, anio);
    try {
      const datos = JSON.parse(localStorage.getItem("datos-dias-porcentajes") || "[]");
      const existente = datos.find(d => d.fecha === fechaDia);
      if (existente) return existente.porcentaje ?? 0;
      const porcentaje = calcularPorcentajeCompletadoPorDia(dia, anio);
      datos.push({ fecha: fechaDia, porcentaje, dia, mensaje: null });
      localStorage.setItem("datos-dias-porcentajes", JSON.stringify(datos));
      return porcentaje;
    } catch {
      return calcularPorcentajeCompletadoPorDia(dia, anio);
    }
  };

  // Obtener nota mensual que coincide con el día del mes de este día
  const obtenerNotaMensualDelDia = (dia, anio = anioActual) => {
    const fecha = obtenerFechaDiaPorAnio(dia, anio)
    const dayOfMonth = new Date(fecha + "T00:00:00").getDate()
    return tareas.find(t => t.tipo === "nota" && t.repetirMensualmente && t.diaMes === dayOfMonth) || null
  };

  // Verificar si este día cae dentro del rango de antelación de alguna nota
  // (recordatorio puntual O nota mensual recurrente)
  const obtenerAntelacionDeDia = (dia, anio = anioActual) => {
    const fechaDia = obtenerFechaDiaPorAnio(dia, anio);
    const fechaDiaDate = new Date(fechaDia + "T00:00:00");
    const fechaDiaMs = fechaDiaDate.getTime();

    return tareas.find(t => {
      if (t.tipo !== "nota" || !t.diasAntelacion) return false;

      // 1. Antelación sobre fechaFin (recordatorio puntual)
      if (t.fechaFin) {
        const fechaFin = new Date(t.fechaFin + "T00:00:00").getTime();
        const fechaInicio = fechaFin - t.diasAntelacion * 24 * 60 * 60 * 1000;
        if (fechaDiaMs >= fechaInicio && fechaDiaMs < fechaFin) return true;
      }

      // 2. Antelación sobre la próxima ocurrencia mensual (solo días futuros)
      if (t.repetirMensualmente && t.diaMes) {
        const hoy = new Date().toISOString().split("T")[0];
        if (fechaDia < hoy) return false;
        const y = fechaDiaDate.getFullYear();
        const m = fechaDiaDate.getMonth();
        const d = fechaDiaDate.getDate();
        const ocurrencia = d < t.diaMes
          ? new Date(y, m, t.diaMes)
          : new Date(y, m + 1, t.diaMes);
        const diffDias = (ocurrencia.getTime() - fechaDiaMs) / (1000 * 60 * 60 * 24);
        if (diffDias > 0 && diffDias <= t.diasAntelacion) return true;
      }

      return false;
    }) || null;
  };

  const obtenerColorActividad = (dia, anio = anioActual) => {
    const fechaImportante = obtenerInfoFechaImportante(dia, anio);
    if (fechaImportante?.tipo) {
      return { "habito-fin": "bg-purple-500", "nota": "bg-blue-500" }[fechaImportante.tipo] || "bg-yellow-500";
    }

    if (obtenerNotaMensualDelDia(dia, anio)) {
      const hoy = new Date().toISOString().split("T")[0];
      if (obtenerFechaDiaPorAnio(dia, anio) >= hoy) return "bg-violet-500";
    }

    if (typeof window !== "undefined") {
      const fechaPartida = localStorage.getItem("fechaPartidaUsuario");
      if (fechaPartida && obtenerFechaDiaPorAnio(dia, anio) === fechaPartida) {
        return "bg-gradient-to-r from-orange-500 to-amber-500";
      }
    }

    if ((anio === anioActual && dia > diaActualDelAnioValido) || anio === anioSiguiente) return "bg-gray-800";
    return colorPorPorcentaje(obtenerPorcentajeDia(dia, anio));
  };

  const obtenerColorSoloProgreso = (dia, anio = anioActual) => {
    if ((anio === anioActual && dia > diaActualDelAnioValido) || anio === anioSiguiente) return "bg-gray-800";
    return colorPorPorcentaje(obtenerPorcentajeDia(dia, anio));
  };


  // Devuelve { dia: string, mensaje: string } para el tooltip
  const obtenerDatosTooltip = (dia, anio = anioActual) => {
    const fechaImportante = obtenerInfoFechaImportante(dia, anio);
    const date = new Date(anio, 0);
    date.setDate(dia);
    const fecha = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    let mensaje = "";

    if (fechaImportante?.titulo) {
      mensaje = fechaImportante.titulo
        .replace(/^Fin de hábito:\s*/i, "")
        .replace(/^Fin de nota:\s*/i, "");
    }

    const notaMensual = obtenerNotaMensualDelDia(dia, anio);
    if (notaMensual && !mensaje) {
      mensaje = notaMensual.titulo;
    }

    if (typeof window !== "undefined") {
      const fechaPartida = localStorage.getItem("fechaPartidaUsuario");
      if (fechaPartida && fecha === fechaPartida) {
        mensaje = mensaje ? `${mensaje} · Inicio` : "Inicio";
      }
      try {
        const datos = JSON.parse(localStorage.getItem("datos-dias-porcentajes") || "[]");
        const extra = datos.find(d => d.fecha === fecha);
        if (extra?.mensaje) mensaje = mensaje ? `${mensaje} · ${extra.mensaje}` : extra.mensaje;
      } catch {}
    }

    return { dia: `Día ${dia}`, mensaje };
  };



  // Función para renderizar una cuadrícula de año
  const renderizarCuadriculaAnio = (anio, esAnioActual) => {
    return (
      <div className="flex-1">
        <div className="text-xs text-white/50 mb-2 text-center">
          Año {anio}
        </div>
        <div className="grid grid-rows-7 grid-flow-col gap-1">
          {Array.from({ length: 365 }).map((_, index) => {
            const dia = index + 1;
            const esDiaActual = esAnioActual && dia === diaActualDelAnioValido;
            return (
              <div
                key={`${anio}-${index}`}
                style={{ borderRadius: "1px" }}
                className={`w-3 h-3 ${mostrarSoloProgreso ? obtenerColorSoloProgreso(dia, anio) : obtenerColorActividad(dia, anio)} relative cursor-pointer ${obtenerAntelacionDeDia(dia, anio) ? "ring-1 ring-blue-400" : ""}`}
                onMouseEnter={() => {
                  setDiaHover(dia);
                  setAnioHover(anio);
                }}
                onMouseLeave={() => {
                  setDiaHover(null);
                  setAnioHover(null);
                }}
                onClick={() => {
                  if (obtenerNotaMensualDelDia(dia, anio)) {
                    setVistaActiva("notas");
                    return;
                  }
                  const fechaDia = obtenerFechaDiaPorAnio(dia, anio);
                  const diaSemana = new Date(fechaDia)
                    .toLocaleDateString("es-ES", { weekday: "long" })
                    .toLowerCase();
                  if (diasSemana.includes(diaSemana)) {
                    setDiaSemanaSeleccionado(diaSemana);
                    setVistaActiva("semana");
                    setVolverCargarTareasFiltradas(prev => !prev);
                  }
                }}
              >
                {diaHover === dia && anioHover === anio && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-xs text-white rounded whitespace-nowrap z-50 text-center">
                    {(() => {
                      const { dia: label, mensaje } = obtenerDatosTooltip(dia, anio);
                      return (
                        <>
                          <div>{label}</div>
                          {mensaje && <div className="text-white/60 mt-0.5">{mensaje}</div>}
                        </>
                      );
                    })()}
                  </div>
                )}
                {esDiaActual && (
                  <div className="absolute inset-0 border-2 border-white rounded-sm animate-pulse"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-4 shadow-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-base font-medium text-white/80">Actividad</h3>
          <div className="text-xs text-white/50 mt-1">
            {mostrarAnioSiguiente ? (
              <>Año {anioSiguiente}</>
            ) : (
              <>Día {diaActualDelAnioValido}/{diasTotalesValido} del año {anioActual}</>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMostrarSoloProgreso(!mostrarSoloProgreso)}
            className="px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-white/10 hover:bg-white/20 text-white flex items-center gap-2"
            title={mostrarSoloProgreso ? "Mostrar todas las fechas especiales" : "Mostrar solo progreso"}
          >
            {mostrarSoloProgreso ? (
              <>
                <span>Mostrar todo</span>
              </>
            ) : (
              <>
                <span>Solo progreso</span>
              </>
            )}
          </button>
          <button
            onClick={() => setMostrarAnioSiguiente(!mostrarAnioSiguiente)}
            className="px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-white/10 hover:bg-white/20 text-white flex items-center gap-2"
          >
            {mostrarAnioSiguiente ? (
              <>
                <span>Ver {anioActual}</span>
              </>
            ) : (
              <>
                <span>Ver {anioSiguiente}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Degradado izquierdo — solo móvil */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/40 to-transparent z-10 md:hidden rounded-l-lg" />
        {/* Degradado derecho — solo móvil */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-black/40 to-transparent z-10 md:hidden rounded-r-lg" />

        <div
          className="overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.2) transparent" }}
        >
          <div className="flex flex-col lg:flex-row gap-4 min-w-[700px]">
            {!mostrarAnioSiguiente && renderizarCuadriculaAnio(anioActual, true)}
            {mostrarAnioSiguiente && renderizarCuadriculaAnio(anioSiguiente, false)}
          </div>
        </div>{/* fin overflow-x-auto */}
      </div>{/* fin relative */}

      <div className="flex justify-between items-center mt-2 text-xs text-white/50">
        <span>Progreso anual</span>
        <div className="flex items-center gap-1">
          <span>Menos</span>
          <div className="w-3 h-3 rounded-sm bg-gray-800"></div>
          <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-green-900 to-green-800"></div>
          <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-green-700 to-green-600"></div>
          <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-green-500 to-green-400"></div>
          <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-green-400 to-green-300"></div>
          <span>Más</span>
        </div>
      </div>

      {!mostrarSoloProgreso && (
        <div className="hidden md:flex flex-wrap gap-2 mt-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-orange-500 to-amber-500"></div>
            <span className="text-xs text-white/50">Fecha de partida</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
            <span className="text-xs text-white/50">Recordatorio de nota</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-violet-500"></div>
            <span className="text-xs text-white/50">Nota mensual</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default VisualizacionDias;
