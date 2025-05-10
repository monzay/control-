import { useContext, useEffect, useState } from "react";
import FechaModulo from "@/function/FechaModulo.js";
import { ContextoDias } from "@/Context/ProviderDias";
import funcionesGlobales from "@/function/funcionesGlobales";
import { data } from "autoprefixer";
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
  const [diaHover, setDiaHover] = useState(null);

  // Calcular porcentaje de tareas completadas por día
  const calcularPorcentajeCompletadoPorDia = (dia) => {
    const fechaDia = FechaModulo.obtenerFechaDia(dia);

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
    console.log((totalCompletadas / todasLasTareasDelDia.length) * 100);
    return (totalCompletadas / todasLasTareasDelDia.length) * 100;
  };

  // Obtener información de fechas importantes para un día
  const obtenerInfoFechaImportante = (dia) => {
    const fechaDia = FechaModulo.obtenerFechaDia(dia);
    return fechasImportantes.find((fecha) => fecha.fecha === fechaDia);
  };

  // Obtener color basado en nivel de actividad con tonos de verde
  const obtenerColorActividad = (dia) => {
    // Verificar si es una fecha importante
    const fechaImportante = obtenerInfoFechaImportante(dia);

    if (fechaImportante) {
      if (fechaImportante.tipo === "habito-fin") return "bg-purple-500"; // Color para fin de hábito
      if (fechaImportante.tipo === "nota") return "bg-blue-500"; // Color para recordatorio de nota
      return "bg-yellow-500"; // Color para otras fechas importantes
    }

    // Si el día es futuro (después del día actual), devolver gris opaco
    if (dia > diaActualDelAnio) {
      return "bg-gray-800";
    }

    // Obtener el porcentaje de tareas completadas para este día desde localStorage o calcularlo
    const fechaDia = FechaModulo.obtenerFechaDia(dia);
    let porcentajeCompletado = 0;

    // Intentar obtener del localStorage primero
    if (typeof window !== "undefined") {
      // Obtener el array de datos de días desde localStorage
      const datosAlmacenados = localStorage.getItem("datos-dias-porcentajes");
      let datosDias = [];

      if (datosAlmacenados) {
        datosDias = JSON.parse(datosAlmacenados);
        // Buscar el día en el array
        const datoDia = datosDias.find((d) => d.fecha === fechaDia);
        if (datoDia) {
          porcentajeCompletado = datoDia.porcentaje;
        } else {
          // Si no existe en el array, calcularlo
          porcentajeCompletado = calcularPorcentajeCompletadoPorDia(dia);

          // Añadir al array y guardar en localStorage
          datosDias.push({
            fecha: fechaDia,
            porcentaje: porcentajeCompletado,
            dia,
            mensaje:null
          });
          localStorage.setItem(
            "datos-dias-porcentajes",
            JSON.stringify(datosDias)
          );
        }
      } else {
        // Si no existe el array en localStorage, crearlo
        porcentajeCompletado = calcularPorcentajeCompletadoPorDia(dia);
        datosDias = [
          { fecha: fechaDia, porcentaje: porcentajeCompletado, dia },
        ];
        localStorage.setItem(
          "datos-dias-porcentajes",
          JSON.stringify(datosDias)
        );
      }
    } else {
      // Fallback para SSR
      porcentajeCompletado = calcularPorcentajeCompletadoPorDia(dia);
    }

    // Para días pasados o el día actual, usar el porcentaje de completado con tonos de verde
    if (porcentajeCompletado < 25) {
      return "bg-gradient-to-r from-green-900 to-green-800"; // Verde muy oscuro
    } else if (porcentajeCompletado < 50) {
      return "bg-gradient-to-r from-green-700 to-green-600"; // Verde oscuro
    } else if (porcentajeCompletado < 75) {
      return "bg-gradient-to-r from-green-500 to-green-400"; // Verde medio
    } else {
      return "bg-gradient-to-r from-green-400 to-green-300"; // Verde claro
    }
  };

  // Obtener título para el tooltip
  const obtenerTituloTooltip = (dia) => {
    const fechaImportante = obtenerInfoFechaImportante(dia);
    if (fechaImportante) {
      return fechaImportante.titulo;
    }

    function mostrarMensajeTooltip(dayOfYear, year = 2025) {
        const date = new Date(year, 0); // enero es el mes 0
        date.setDate(dayOfYear);
      
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
      
        const fecha = `${yyyy}-${mm}-${dd}`;
    const datosAlmacenados = JSON.parse(localStorage.getItem("datos-dias-porcentajes"))
     const  dataActividad  =  datosAlmacenados.find(prev => prev.fecha === fecha )
       if(dataActividad.mensaje !== null){
           console.log("mensaje")
           return `${dataActividad.mensaje}`
       }else{
         return `Día ${dia}`
       }
      }
  return       `Día ${dia}` 

  };


  const { todosLosDias } = useContext(ContextoDias); // return (objeto)ç

 

 
  return (
    <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-4 shadow-lg mb-6 overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-base font-medium text-white/80">Actividad</h3>
          <div className="text-xs text-white/50 mt-1">
            Día {diaActualDelAnio}/{diasTotales} del año {anioActual}
          </div>
        </div>
      </div>

      <div className="flex min-w-[700px]">
        {/* Cuadrícula principal */}
        <div className="flex-1">
          {/* Cuadrícula de actividad */}
          <div className="grid grid-rows-7 grid-flow-col gap-1">
            {todosLosDias.dias.map((_, index) => {
              const dia = index + 1;
              return (
                <div
                  key={index}
                  style={{ borderRadius: "1px" }}
                  className={`w-3 h-3  ${obtenerColorActividad(
                    dia
                  )} relative cursor-pointer`}
                  onMouseEnter={() => setDiaHover(dia)}
                  onMouseLeave={() => setDiaHover(null)}
                  onClick={() => {
                    // Al hacer clic en un día, seleccionar ese día en la semana si corresponde
                    const fechaDia = FechaModulo.obtenerFechaDia(dia);
                    const diaSemana = new Date(fechaDia)
                      .toLocaleDateString("es-ES", { weekday: "long" })
                      .toLowerCase();
                    if (diasSemana.includes(diaSemana)) {
                      setDiaSemanaSeleccionado(diaSemana);
                      setVistaActiva("semana");
                    }
                  }}
                >
                  {diaHover === dia && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-xs text-white rounded whitespace-nowrap z-50">
                      {obtenerTituloTooltip(dia)}
                    </div>
                  )}
                  {dia === diaActualDelAnio && (
                    <div className="absolute inset-0 border-2 border-white rounded-sm animate-pulse"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
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

      <div className="flex flex-wrap gap-2 mt-3">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-purple-500"></div>
          <span className="text-xs text-white/50">Fin de hábito</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
          <span className="text-xs text-white/50">Recordatorio de nota</span>
        </div>
      </div>
    </div>
  );
}

export default VisualizacionDias;
