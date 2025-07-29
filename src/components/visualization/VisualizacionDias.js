import {  useState } from "react";
import FechaModulo from "@/function/FechaModulo.js";
import { useActividad } from "@/Context/ActividadContext";


// Busca información de una fecha importante para un día dado
function obtenerInfoFechaImportante(dia, fechasImportantes) {
  const fechaDia = FechaModulo.obtenerFechaDia(dia);
  return fechasImportantes.find((fecha) => fecha.fecha === fechaDia);
}

// Determina el color de fondo de un día según actividad y fechas importantes
function obtenerColorActividad({
  dia,
  fechasImportantes,
  actividades,
  diasTotales,
  diaActualDelAnio,
}) {
  const fechaImportante = obtenerInfoFechaImportante(dia, fechasImportantes);

  // Si es una fecha importante, retorna el color correspondiente
  if (fechaImportante) {
    const coloresPorTipo = {
      "habito-fin": "bg-purple-500",
      nota: "bg-blue-500",
    };
    return coloresPorTipo[fechaImportante.tipo] || "bg-yellow-500";
  }

  // Si no, calcula el color según el porcentaje de actividad
  const actividadDelDia = actividades.find((act) => act.dia === dia);
  const porcentajeCompletado = actividadDelDia
    ? actividadDelDia.porcentaje
    : 0;

  return FechaModulo.obtenerColorProgresoAnual(
    dia,
    diasTotales,
    diaActualDelAnio,
    porcentajeCompletado
  );
}


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
  // Año actual
  const anioActual = new Date().getFullYear();
  const [diaHover, setDiaHover] = useState(null);
  const [rangoRojo, setRangoRojo] = useState([]);
  const [diaDeLaNot, setDiaDeLaNota] = useState(0);
  const { actividades } = useActividad();

  // Renderiza la cuadrícula de días del año
  function renderCuadriculaDias() {
    return (
      <div className="grid grid-rows-7 grid-flow-col gap-1">
        {Array.from({ length: 365 }).map((_, index) => {
          const dia = index + 1;
          const esRojo = rangoRojo.includes(dia);
           
          return (
            <div
              key={index}
              style={{ borderRadius: "1px" }}
              className={`w-3 h-3 ${esRojo ? "bg-red-500" : obtenerColorActividad({
                dia,
                fechasImportantes,
                actividades,
                diasTotales,
                diaActualDelAnio,
              })} relative cursor-pointer`}
              onMouseEnter={() => {
                setDiaDeLaNota(dia);
                setDiaHover(dia);
                // Si es una fecha importante con cantidadDias/cantidasDias, calcular el rango rojo
                const fechaImportante = obtenerInfoFechaImportante(dia, fechasImportantes);
                const cantidad = fechaImportante?.cantidadDias || fechaImportante?.cantidasDias;
                if (fechaImportante && cantidad && !isNaN(Number(cantidad))) {
                  const cant = Number(cantidad);
                  const rango = [];
                  for (let i = 0; i < cant; i++) {
                    if (dia - i > 0) rango.push(dia - i);
                  }
                  setRangoRojo(rango);
                } else {
                  setRangoRojo([]);
                }
              }}
              onMouseLeave={() => {
                setDiaHover(null);
                setRangoRojo([]);
              }}
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
              {/* Tooltip al pasar el mouse */}
              {diaHover === dia && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-xs text-white rounded whitespace-nowrap z-50 text-center min-w-[90px]">
                  <div className="font-bold">Día {dia}</div>
                  {(() => {
                    const fechaImportante = obtenerInfoFechaImportante(dia, fechasImportantes);
                    if (fechaImportante) {
                      return <div className="mt-1">{fechaImportante.titulo}</div>;
                    }
                    return null;
                  })()}
                </div>
              )}
              {/* Borde animado para el día actual */}
              {dia === diaActualDelAnio && (
                <div className="absolute inset-0 border-2 border-white rounded-sm animate-pulse"></div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Renderiza la leyenda de colores de progreso anual
  function renderLeyendaProgreso() {
    return (
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
    );
  }

  // Renderiza la leyenda de colores para fechas importantes
  function renderLeyendaFechasImportantes() {
    return (
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
    );
  }

  // Render principal del componente
  return (
    <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-4 shadow-lg mb-6 overflow-x-auto">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-base font-medium text-white/80">Actividad</h3>
          <div className="text-xs text-white/50 mt-1">
            Día {diaActualDelAnio}/{diasTotales} del año {anioActual}
          </div>
        </div>
      </div>

      {/* Cuadrícula de días */}
      <div className="flex min-w-[700px]">
        <div className="flex-1">
          {renderCuadriculaDias()}
        </div>
      </div>

      {/* Leyenda de progreso anual */}
      {renderLeyendaProgreso()}

      {/* Leyenda de fechas importantes */}
      {renderLeyendaFechasImportantes()}
    </div>
  );
}

export default VisualizacionDias;
