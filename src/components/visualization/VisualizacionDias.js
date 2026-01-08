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
  const [diaHover, setDiaHover] = useState(null);
  const [anioHover, setAnioHover] = useState(null); // Para saber en qué año está el hover
  const [mostrarAnioSiguiente, setMostrarAnioSiguiente] = useState(false); // Estado para mostrar/ocultar año siguiente
  const [mostrarSoloProgreso, setMostrarSoloProgreso] = useState(false); // Estado para mostrar solo progreso sin fechas especiales
  const { setVolverCargarTareasFiltradas } = useContext(ContextVolverACargarTareasFiltradas);
  const [diaDeLaNot,setDiaDeLaNota] = useState(0)
  
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

  // Obtener color basado en nivel de actividad con tonos de verde
 const obtenerColorActividad = (dia, anio = anioActual) => {
  const fechaImportante = obtenerInfoFechaImportante(dia, anio);
  const fechaDia = obtenerFechaDiaPorAnio(dia, anio);

  // 1. Verificar si es una fecha importante
  if (fechaImportante) {
    const coloresPorTipo = {
      "habito-fin": "bg-purple-500",
      "nota": "bg-blue-500",
    };
    
    return coloresPorTipo[fechaImportante.tipo] || "bg-yellow-500";
  }

  // validad si es  de  tipo nota  y habito  y  si tambien se paso por enciama de una nota par mostrar la cantidad de dias antes de la fecha que el usuario  
  if(fechaImportante && fechaImportante.tipo  && false  ){
    return   "bg-red-500"
      
  }

  // 2. Verificar si es la fecha de partida del usuario (primera visita)
  if (typeof window !== "undefined") {
    const fechaPartida = localStorage.getItem("fechaPartidaUsuario");
    if (fechaPartida && fechaDia === fechaPartida) {
      // Color especial para la fecha de partida (naranja/dorado)
      return "bg-gradient-to-r from-orange-500 to-amber-500";
    }
  }

  // 3. Si el día es futuro (solo para el año actual)
  if (anio === anioActual && dia > diaActualDelAnio) return "bg-gray-800";
  
  // Para el año siguiente, todos los días son futuros
  if (anio === anioSiguiente) return "bg-gray-800";

  // 3. Obtener el porcentaje de completado
  let porcentajeCompletado = 0;

  const obtenerPorcentajeDesdeStorage = () => {
    const datosAlmacenados = localStorage.getItem("datos-dias-porcentajes");
    if (!datosAlmacenados) return null;

    try {
      const datosDias = JSON.parse(datosAlmacenados);
      return datosDias.find(d => d.fecha === fechaDia) || null;
    } catch {
      return null;
    }
  };

  const guardarDatoEnStorage = (nuevoDato) => {
    const datosAlmacenados = localStorage.getItem("datos-dias-porcentajes");
    let datosDias = [];

    if (datosAlmacenados) {
      try {
        datosDias = JSON.parse(datosAlmacenados);
      } catch {
        datosDias = [];
      }
    }

    datosDias.push(nuevoDato);
    localStorage.setItem("datos-dias-porcentajes", JSON.stringify(datosDias));
  };

  if (typeof window !== "undefined") {
    const datoExistente = obtenerPorcentajeDesdeStorage();
    if (datoExistente) {
      porcentajeCompletado = datoExistente.porcentaje;
    } else {
      porcentajeCompletado = calcularPorcentajeCompletadoPorDia(dia, anio);
      guardarDatoEnStorage({ fecha: fechaDia, porcentaje: porcentajeCompletado, dia, mensaje: null });
    }
  } else {
    porcentajeCompletado = calcularPorcentajeCompletadoPorDia(dia, anio); // SSR fallback
  }

  // 4. Devolver el color según el porcentaje
  if (porcentajeCompletado < 25) return "bg-gradient-to-r from-green-900 to-green-800";
  if (porcentajeCompletado < 50) return "bg-gradient-to-r from-green-700 to-green-600";
  if (porcentajeCompletado < 75) return "bg-gradient-to-r from-green-500 to-green-400";
  return "bg-gradient-to-r from-green-400 to-green-300";
};

  // Función que solo muestra el progreso de actividad sin fechas especiales
  const obtenerColorSoloProgreso = (dia, anio = anioActual) => {
    const fechaDia = obtenerFechaDiaPorAnio(dia, anio);

    // 1. Si el día es futuro (solo para el año actual)
    if (anio === anioActual && dia > diaActualDelAnio) return "bg-gray-800";
    
    // Para el año siguiente, todos los días son futuros
    if (anio === anioSiguiente) return "bg-gray-800";

    // 2. Obtener el porcentaje de completado (sin considerar fechas especiales)
    let porcentajeCompletado = 0;

    const obtenerPorcentajeDesdeStorage = () => {
      const datosAlmacenados = localStorage.getItem("datos-dias-porcentajes");
      if (!datosAlmacenados) return null;

      try {
        const datosDias = JSON.parse(datosAlmacenados);
        return datosDias.find(d => d.fecha === fechaDia) || null;
      } catch {
        return null;
      }
    };

    if (typeof window !== "undefined") {
      const datoExistente = obtenerPorcentajeDesdeStorage();
      if (datoExistente) {
        porcentajeCompletado = datoExistente.porcentaje;
      } else {
        porcentajeCompletado = calcularPorcentajeCompletadoPorDia(dia, anio);
      }
    } else {
      porcentajeCompletado = calcularPorcentajeCompletadoPorDia(dia, anio); // SSR fallback
    }

    // 3. Devolver el color según el porcentaje (solo verdes)
    if (porcentajeCompletado < 25) return "bg-gradient-to-r from-green-900 to-green-800";
    if (porcentajeCompletado < 50) return "bg-gradient-to-r from-green-700 to-green-600";
    if (porcentajeCompletado < 75) return "bg-gradient-to-r from-green-500 to-green-400";
    return "bg-gradient-to-r from-green-400 to-green-300";
  };


  // Obtener título para el tooltip
  const obtenerTituloTooltip = (dia, anio = anioActual) => {
    const fechaImportante = obtenerInfoFechaImportante(dia, anio);
    if (fechaImportante) {
      return fechaImportante.titulo;
    }

    function mostrarMensajeTooltip(dayOfYear, year) {
      const date = new Date(year, 0); // enero es el mes 0
      date.setDate(dayOfYear);

      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");

      const fecha = `${yyyy}-${mm}-${dd}`;
      
      // Verificar si es la fecha de partida del usuario
      if (typeof window !== "undefined") {
        const fechaPartida = localStorage.getItem("fechaPartidaUsuario");
        if (fechaPartida && fecha === fechaPartida) {
          return "Fecha de partida";
        }
      }


      const datosAlmacenados = localStorage.getItem("datos-dias-porcentajes");
      if (!datosAlmacenados) return `Día ${dia}`;
      
      try {
        const datos = JSON.parse(datosAlmacenados);
        const dataActividad = datos.find((prev) => prev.fecha === fecha);
        if (dataActividad && dataActividad.mensaje !== null) {
          return `${dataActividad.mensaje}`;
        }
      } catch {
        // Si hay error al parsear, continuar
      }
      return `Día ${dia}`;
    }
    return mostrarMensajeTooltip(dia, anio);
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
            const esDiaActual = esAnioActual && dia === diaActualDelAnio;
            return (
              <div
                key={`${anio}-${index}`}
                style={{ borderRadius: "1px" }}
                className={`w-3 h-3 ${mostrarSoloProgreso ? obtenerColorSoloProgreso(dia, anio) : obtenerColorActividad(dia, anio)} relative cursor-pointer`}
                onMouseEnter={() => {
                  setDiaDeLaNota(dia);
                  setDiaHover(dia);
                  setAnioHover(anio);
                }}
                onMouseLeave={() => {
                  setDiaHover(null);
                  setAnioHover(null);
                }}
                onClick={() => {
                  // Al hacer clic en un día, seleccionar ese día en la semana si corresponde
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
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-xs text-white rounded whitespace-nowrap z-50">
                    {obtenerTituloTooltip(dia, anio)}
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
    <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-4 shadow-lg mb-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-base font-medium text-white/80">Actividad</h3>
          <div className="text-xs text-white/50 mt-1">
            {mostrarAnioSiguiente ? (
              <>Año {anioSiguiente}</>
            ) : (
              <>Día {diaActualDelAnio || funcionesGlobales.ObtenerDiaNumeroDelAño() || 1}/{diasTotales} del año {anioActual}</>
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

      <div className="flex flex-col lg:flex-row gap-4 min-w-[700px]">
        {/* Cuadrícula del año actual - solo se muestra si NO se está mostrando el año siguiente */}
        {!mostrarAnioSiguiente && renderizarCuadriculaAnio(anioActual, true)}
        
        {/* Cuadrícula del año siguiente - solo se muestra si mostrarAnioSiguiente es true */}
        {mostrarAnioSiguiente && renderizarCuadriculaAnio(anioSiguiente, false)}
      </div>

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
        <div className="flex flex-wrap gap-2 mt-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-orange-500 to-amber-500"></div>
            <span className="text-xs text-white/50">Fecha de partida</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-purple-500"></div>
            <span className="text-xs text-white/50">Fin de hábito</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
            <span className="text-xs text-white/50">Recordatorio de nota</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default VisualizacionDias;
