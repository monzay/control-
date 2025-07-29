import {  useEffect, useState } from "react";
import { useHistorial } from "@/Context/HistorialContext.js";

// Devuelve clase de color según porcentaje
const obtenerColorBarra = (porcentaje) => {
  if (porcentaje >= 80) return "bg-emerald-500";
  if (porcentaje >= 50) return "bg-yellow-500";
  return "bg-red-500";
};

function EstadisticasSemanales({ tareasSemana }) {
  const [estadisticas, setEstadisticas] = useState();
  const { obtenerPorcentajePorDiaSemana } = useHistorial();


  useEffect(() => {
    const obtenerEstadisticas = async () => {
      try {
        const data = await obtenerPorcentajePorDiaSemana();
        console.log(data)
        if (data && data.porcentajePorDia) {
          const datosDia = data.porcentajePorDia.map((d) => ({
            dia: d.dia,
            tasaCompletado: Number(d.porcentaje.toFixed(2)),
          }));

          const total = data.porcentajePorDia.reduce((acc, d) => acc + d.total, 0);
          const totalCompletadas = data.porcentajePorDia.reduce(
            (acc, d) => acc + d.completadas,
            0
          );
          const totalNoCompletadas = total - totalCompletadas;
          const tasaCompletado = total > 0 ? Number(((totalCompletadas / total) * 100).toFixed(2)) : 0;

          setEstadisticas({
            tasaCompletado,
            total,
            totalCompletadas,
            totalNoCompletadas,
            estadisticasPorDia: datosDia,
          });
        }
      } catch (err) {
        console.error("Error al obtener estadísticas semanales", err);
      }
    };

    obtenerEstadisticas();
  }, [obtenerPorcentajePorDiaSemana, tareasSemana]);


  if (!estadisticas) {
    return <div>Cargando estadísticas...</div>;
  }

  const BarraProgreso = ({ porcentaje }) => (
    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${obtenerColorBarra(porcentaje)}`}
        style={{ width: `${porcentaje}%` }}
      />
    </div>
  );

  const EstadisticaGeneral = ({ tasa, total, completadas, noCompletadas }) => (
    <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-4 shadow-lg text-center">
      <div className="text-2xl font-bold text-green-400">{tasa}%</div>
      <div className="text-xs text-white/50 mb-2">Tasa de completado</div>
      <BarraProgreso porcentaje={tasa} />
      <div className="mt-2 text-xs text-white/40 flex justify-between">
        <span>Total: {total}</span>
        <span className="text-green-400">✓ {completadas}</span>
        <span className="text-green-400">✗ {noCompletadas}</span>
      </div>
    </div>
  );

  const EstadisticaPorDia = ({ datos }) => (
    <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-4 shadow-lg">
      <h4 className="text-xs font-medium mb-3 text-white/60">
        Completado por día
      </h4>
      <div className="space-y-2">
        {datos.map(({ dia, tasaCompletado }) => (
          <div key={dia} className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs capitalize text-white/60">
                {dia.substring(0, 3)}
              </span>
              <span className="text-xs text-white/80">{tasaCompletado}%</span>
            </div>
            <BarraProgreso porcentaje={tasaCompletado} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-4 shadow-lg h-full">
      <h3 className="text-base font-medium mb-4 text-white/80">Estadísticas</h3>
      <div className="space-y-4">
        <EstadisticaGeneral
          tasa={estadisticas.tasaCompletado}
          total={estadisticas.total}
          completadas={estadisticas.totalCompletadas}
          noCompletadas={estadisticas.totalNoCompletadas}
        />
        <EstadisticaPorDia datos={estadisticas.estadisticasPorDia} />
        {/* Lista de tareas semanales con icono de completada */}
        <div className="mt-6">
          <h4 className="text-xs font-medium mb-2 text-white/60">Tareas de la semana</h4>
          <ul className="divide-y divide-white/10">
            {tareasSemana && tareasSemana.length > 0 ? (
              tareasSemana.map((tarea) => (
                <li key={tarea.id} className="flex items-center justify-between py-2">
                  <span className="text-sm text-white/80 flex items-center gap-2">
                    {tarea.titulo}
                    {tarea.completada && (
                      <span className="text-emerald-400 ml-2" title="Completada">✓</span>
                    )}
                  </span>
                  <span className="text-xs text-white/50">{tarea.duracion}</span>
                </li>
              ))
            ) : (
              <li className="text-white/40 text-sm py-2">No hay tareas semanales.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
export default EstadisticasSemanales;
