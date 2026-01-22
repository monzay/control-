import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Calendar, CheckCircle2, XCircle } from "lucide-react";

function DashboardEstadisticas() {
  const [estadisticasSemanales, setEstadisticasSemanales] = useState([]);
  const [semanaSeleccionada, setSemanaSeleccionada] = useState(null);

  useEffect(() => {
    // Cargar estadísticas desde localStorage
    const cargarEstadisticas = () => {
      try {
        const datos = localStorage.getItem("estadisticasSemanales");
        if (datos) {
          const estadisticas = JSON.parse(datos);
          // Verificar que sea un array antes de ordenar
          if (Array.isArray(estadisticas)) {
            // Ordenar por semana (más reciente primero)
            const ordenadas = [...estadisticas].sort((a, b) => {
              const semanaA = Number(a?.semana) || 0;
              const semanaB = Number(b?.semana) || 0;
              return semanaB - semanaA;
            });
            setEstadisticasSemanales(ordenadas);
            // Seleccionar la semana más reciente por defecto
            if (ordenadas.length > 0 && !semanaSeleccionada) {
              setSemanaSeleccionada(ordenadas[0].semana);
            }
          } else {
            // Si no es un array, inicializar como array vacío
            setEstadisticasSemanales([]);
          }
        }
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
        setEstadisticasSemanales([]);
      }
    };

    cargarEstadisticas();
  }, []);

  // Calcular estadísticas generales de todas las semanas
  const calcularEstadisticasGenerales = () => {
    if (estadisticasSemanales.length === 0) {
      return {
        totalSemanas: 0,
        promedioCompletado: 0,
        totalTareasCompletadas: 0,
        totalTareasNoCompletadas: 0,
        mejorSemana: null,
        peorSemana: null,
      };
    }

    let totalCompletadas = 0;
    let totalNoCompletadas = 0;
    let sumaPorcentajes = 0;
    let mejorSemana = null;
    let peorSemana = null;
    let mejorPorcentaje = 0;
    let peorPorcentaje = 100;

    estadisticasSemanales.forEach((semana) => {
      if (semana.estadisticas && Array.isArray(semana.estadisticas)) {
        semana.estadisticas.forEach((dia) => {
          totalCompletadas += dia.contadorCompletadas || 0;
          totalNoCompletadas += dia.contadorNoCompletadas || 0;
        });

        // Calcular porcentaje promedio de la semana
        const totalTareasSemana = semana.estadisticas.reduce(
          (sum, dia) => sum + (dia.total || 0),
          0
        );
        const completadasSemana = semana.estadisticas.reduce(
          (sum, dia) => sum + (dia.contadorCompletadas || 0),
          0
        );
        const porcentajeSemana =
          totalTareasSemana > 0
            ? Math.round((completadasSemana / totalTareasSemana) * 100)
            : 0;

        sumaPorcentajes += porcentajeSemana;

        if (porcentajeSemana > mejorPorcentaje) {
          mejorPorcentaje = porcentajeSemana;
          mejorSemana = semana.semana;
        }
        if (porcentajeSemana < peorPorcentaje) {
          peorPorcentaje = porcentajeSemana;
          peorSemana = semana.semana;
        }
      }
    });

    const promedioCompletado =
      estadisticasSemanales.length > 0
        ? Math.round(sumaPorcentajes / estadisticasSemanales.length)
        : 0;

    return {
      totalSemanas: estadisticasSemanales.length,
      promedioCompletado,
      totalTareasCompletadas: totalCompletadas,
      totalTareasNoCompletadas: totalNoCompletadas,
      mejorSemana,
      peorSemana,
    };
  };

  const estadisticasGenerales = calcularEstadisticasGenerales();

  // Obtener estadísticas de la semana seleccionada
  const obtenerEstadisticasSemana = (semana) => {
    const semanaData = estadisticasSemanales.find(
      (s) => s.semana === semana
    );
    if (!semanaData || !semanaData.estadisticas) {
      return null;
    }

    const totalTareas = semanaData.estadisticas.reduce(
      (sum, dia) => sum + (dia.total || 0),
      0
    );
    const totalCompletadas = semanaData.estadisticas.reduce(
      (sum, dia) => sum + (dia.contadorCompletadas || 0),
      0
    );
    const totalNoCompletadas = semanaData.estadisticas.reduce(
      (sum, dia) => sum + (dia.contadorNoCompletadas || 0),
      0
    );
    const porcentajeCompletado =
      totalTareas > 0 ? Math.round((totalCompletadas / totalTareas) * 100) : 0;

    return {
      semana: semanaData.semana,
      totalTareas,
      totalCompletadas,
      totalNoCompletadas,
      porcentajeCompletado,
      estadisticasPorDia: semanaData.estadisticas,
    };
  };

  const estadisticasSemanaSeleccionada = semanaSeleccionada
    ? obtenerEstadisticasSemana(semanaSeleccionada)
    : null;

  const obtenerColorBarra = (tasa) => {
    if (tasa > 75) return "bg-gradient-to-r from-green-400 to-green-300";
    if (tasa > 50) return "bg-gradient-to-r from-green-500 to-green-400";
    if (tasa > 25) return "bg-gradient-to-r from-green-600 to-green-500";
    return "bg-gradient-to-r from-green-700 to-green-600";
  };

  const BarraProgreso = ({ porcentaje }) => (
    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${obtenerColorBarra(porcentaje)}`}
        style={{ width: `${porcentaje}%` }}
      />
    </div>
  );

  if (estadisticasSemanales.length === 0) {
    return (
      <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-8 shadow-lg text-center">
        <BarChart3 className="h-12 w-12 text-white/30 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white/80 mb-2">
          No hay estadísticas disponibles
        </h3>
        <p className="text-sm text-white/50">
          Las estadísticas se generarán automáticamente al finalizar cada semana.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas generales */}
      <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-medium text-white/90 mb-6 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-400" />
          Resumen General
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="backdrop-blur-md bg-black/30 border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-emerald-400">
              {estadisticasGenerales.totalSemanas}
            </div>
            <div className="text-xs text-white/50 mt-1">Semanas registradas</div>
          </div>
          <div className="backdrop-blur-md bg-black/30 border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-emerald-400">
              {estadisticasGenerales.promedioCompletado}%
            </div>
            <div className="text-xs text-white/50 mt-1">Promedio de completado</div>
          </div>
          <div className="backdrop-blur-md bg-black/30 border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">
              {estadisticasGenerales.totalTareasCompletadas}
            </div>
            <div className="text-xs text-white/50 mt-1 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Tareas completadas
            </div>
          </div>
          <div className="backdrop-blur-md bg-black/30 border border-white/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-400">
              {estadisticasGenerales.totalTareasNoCompletadas}
            </div>
            <div className="text-xs text-white/50 mt-1 flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              Tareas no completadas
            </div>
          </div>
        </div>
      </div>

      {/* Selector de semana */}
      <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-medium text-white/90 mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-emerald-400" />
          Seleccionar Semana
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {estadisticasSemanales.map((semana) => {
            const stats = obtenerEstadisticasSemana(semana.semana);
            const porcentaje = stats ? stats.porcentajeCompletado : 0;
            const estaSeleccionada = semanaSeleccionada === semana.semana;

            return (
              <button
                key={semana.semana}
                onClick={() => setSemanaSeleccionada(semana.semana)}
                className={`p-3 rounded-lg border transition-all ${
                  estaSeleccionada
                    ? "bg-emerald-600/20 border-emerald-500 text-white"
                    : "bg-black/30 border-white/10 text-white/60 hover:border-white/20 hover:text-white"
                }`}
              >
                <div className="text-sm font-medium mb-1">Semana {semana.semana}</div>
                <div className="text-xs text-white/50 mb-2">{porcentaje}%</div>
                <BarraProgreso porcentaje={porcentaje} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Detalles de la semana seleccionada */}
      {estadisticasSemanaSeleccionada && (
        <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-medium text-white/90 mb-6">
            Detalles de la Semana {estadisticasSemanaSeleccionada.semana}
          </h3>
          
          {/* Estadísticas generales de la semana */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="backdrop-blur-md bg-black/30 border border-white/10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-emerald-400">
                {estadisticasSemanaSeleccionada.porcentajeCompletado}%
              </div>
              <div className="text-xs text-white/50 mt-1">Tasa de completado</div>
              <BarraProgreso porcentaje={estadisticasSemanaSeleccionada.porcentajeCompletado} />
            </div>
            <div className="backdrop-blur-md bg-black/30 border border-white/10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-400">
                {estadisticasSemanaSeleccionada.totalCompletadas}
              </div>
              <div className="text-xs text-white/50 mt-1 flex items-center justify-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Completadas
              </div>
            </div>
            <div className="backdrop-blur-md bg-black/30 border border-white/10 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-red-400">
                {estadisticasSemanaSeleccionada.totalNoCompletadas}
              </div>
              <div className="text-xs text-white/50 mt-1 flex items-center justify-center gap-1">
                <XCircle className="h-3 w-3" />
                No completadas
              </div>
            </div>
          </div>

          {/* Estadísticas por día */}
          <div>
            <h4 className="text-sm font-medium text-white/70 mb-4">
              Desglose por día
            </h4>
            <div className="space-y-3">
              {estadisticasSemanaSeleccionada.estadisticasPorDia.map((dia) => (
                <div
                  key={dia.dia}
                  className="backdrop-blur-md bg-black/30 border border-white/10 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-white/80 capitalize">
                      {dia.dia}
                    </span>
                    <span className="text-sm text-emerald-400">
                      {dia.tasaCompletado}%
                    </span>
                  </div>
                  <BarraProgreso porcentaje={dia.tasaCompletado} />
                  <div className="flex justify-between items-center mt-2 text-xs text-white/50">
                    <span>Total: {dia.total || 0}</span>
                    <div className="flex gap-4">
                      <span className="text-green-400">
                        ✓ {dia.contadorCompletadas || 0}
                      </span>
                      <span className="text-red-400">
                        ✗ {dia.contadorNoCompletadas || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardEstadisticas;

