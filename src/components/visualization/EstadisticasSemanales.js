import { contextoStateX } from "@/Context/ProviderStateX";
import FechaModulo from "@/function/FechaModulo";
import useEjecutarDadaSemana from "@/hooks/useEjecucionCadaSemana";
import { useContext, useEffect, useState } from "react";

function EstadisticasSemanales({ tareasSemana, setTareasSemana, diasSemana }) {
  const [estadisticas, setEstadisticas] = useState();
  const [semanaSeleccionada, setSemanaSeleccionada] = useState(
    FechaModulo.obtenerNumeroSemana()
  );

  function filtrarTareasSemanales() {
    const dataSemanas = JSON.parse(localStorage.getItem(""));
    const semanaSec = dataSemanas.filter(
      (semana) => semana.semana === semanaSeleccionada
    );
    return semanaSec.estadisticas;
  }

  const calcularEstadisticasSemanales = (arrTareasSemana) => {
    // Total de tareas completadas y no completadas
    const totalCompletadas = arrTareasSemana.filter(
      (tarea) => tarea.completada
    ).length;
    const totalNoCompletadas = arrTareasSemana.filter(
      (tarea) => !tarea.completada
    ).length;
    const total = arrTareasSemana.length;

    // Porcentaje de completado cas
    const tasaCompletado =
      total > 0 ? Math.round((totalCompletadas / total) * 100) : 0;

    // Estadísticas por día
    const estadisticasPorDia = diasSemana.map((dia) => {
      const tareasPorDia = arrTareasSemana.filter((tarea) => tarea.dia === dia);
      const completadasPorDia = tareasPorDia.filter(
        (tarea) => tarea.completada
      ).length;
      const totalPorDia = tareasPorDia.length;
      const tasaPorDia =
        totalPorDia > 0
          ? Math.round((completadasPorDia / totalPorDia) * 100)
          : 0;
      return {
        dia,
        contadorCompletadas: completadasPorDia,
        contadorNoCompletadas: totalPorDia - completadasPorDia,
        total: totalPorDia,
        tasaCompletado: tasaPorDia,
      };
    });

    return {
      totalCompletadas,
      totalNoCompletadas,
      total,
      tasaCompletado,
      estadisticasPorDia,
    };
  };

  const cal = () => {
    // Total de tareas completadas y no completadas
    const totalCompletadas = tareasSemana.filter(
      (tarea) => tarea.completada
    ).length;
    const totalNoCompletadas = tareasSemana.filter(
      (tarea) => !tarea.completada
    ).length;
    const total = tareasSemana.length;

    // Porcentaje de completado cas
    const tasaCompletado =
      total > 0 ? Math.round((totalCompletadas / total) * 100) : 0;

    // Estadísticas por día
    const estadisticasPorDia = diasSemana.map((dia) => {
      const tareasPorDia = tareasSemana.filter((tarea) => tarea.dia === dia);
      const completadasPorDia = tareasPorDia.filter(
        (tarea) => tarea.completada
      ).length;
      const totalPorDia = tareasPorDia.length;
      const tasaPorDia =
        totalPorDia > 0
          ? Math.round((completadasPorDia / totalPorDia) * 100)
          : 0;

      return {
        dia,
        contadorCompletadas: completadasPorDia,
        contadorNoCompletadas: totalPorDia - completadasPorDia,
        total: totalPorDia,
        tasaCompletado: tasaPorDia,
      };
    });

    return {
      totalCompletadas,
      totalNoCompletadas,
      total,
      tasaCompletado,
      estadisticasPorDia,
    };
  };

  useEffect(() => {
    setEstadisticas(cal());
  }, [tareasSemana, diasSemana]);

  const reiniciarTareasSemanales = () => {
    const tareaSemanaReiniciadas = tareasSemana.map((t) =>
      typeof t.completada === "boolean" ? { ...t, completada: false } : t
    );

    setTareasSemana(tareaSemanaReiniciadas);
  };

  const guarEstadisticasSemanales = () => {
    const estadisticas = {
      estadisticas:
        calcularEstadisticasSemanales(tareasSemana).estadisticasPorDia,
      semana: localStorage.getItem("ultimaSeman"),
    };

    const estadisticasLocales  =  JSON.parse(localStorage.getItem("estadisticasSemanales"))
    estadisticasLocales.push(estadisticas)
    localStorage.setItem("estadisticasSemanales",JSON.stringify(estadisticasLocales))
  };



  useEjecutarDadaSemana(() => {
    guarEstadisticasSemanales();
    reiniciarTareasSemanales();
  });

  if (!estadisticas) {
    return <div>Cargando estadísticas...</div>;
  }

  const obtenerColorBarra = (tasa) => {
    if (tasa > 75) return "bg-gradient-to-r from-green-400 to-green-300";
    if (tasa > 50) return "bg-gradient-to-r from-green-500 to-green-400";
    if (tasa > 25) return "bg-gradient-to-r from-green-600 to-green-500";
    return "bg-gradient-to-r from-green-700 to-green-600";
  };

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
      </div>
    </div>
  );
}
export default EstadisticasSemanales;
