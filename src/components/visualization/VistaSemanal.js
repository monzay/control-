import { useState, useEffect, useContext, useLayoutEffect } from "react";
import VisualizacionDias from "./VisualizacionDias.js";
import { CalendarDays, Sparkles } from "lucide-react";
import TopUsuarios from "./TopUsuarios.js";
import EstadisticasSemanales from "./EstadisticasSemanales.js";
import CardDiaSemana from "../ui/CardDiaSemana.js";
import Cronometro from "../ui/Cronometro.js";

import CardModoEdicionLineaMiSemana from "../ui/CardModoEdicionLineaMiSemana.js";
import CardModoVisualizacionMiSemana from "../ui/CardModoVisualizacionMiSemana.js";
import CardFilaAgregarNuevaTareaMiSemana from "../ui/CardFilaAgragarNuevaTareaMiSemana.js";
import BtnMostrarEstadisticasMoviles from "../ui/BtnMostrarEstadisticasMovilies.js";
import CardInfoDeHorasTotalesYRestante from "../ui/CardInfoDeHorasTatalesYRestante.js";
import BtnAgregarMiSemana from "../ui/BtnAgragarMiSemana.js";
import CardModoEdicionMovilMiSemana from "../ui/CardModoEdicionMovilMiSemana.js";
import CardModoVisualizacionMovilMiSemana from "../ui/CardModoVisualizacionMovilMiSemana.js";
import { ContextVolverACargarTareasFiltradas } from "@/Context/ProviderVolverACargarTareasFiltradas.js";
import { formatearYValidarHora } from "@/function/FormatearYValidarHora.js";
import { useSemanas } from "@/Context/SemanasContext";
import { useHistorial } from "@/Context/HistorialContext.js";

function VistaSemanal({
  diasSemana,
  diaSemanaSeleccionado,
  setDiaSemanaSeleccionado,
  tareasSemanaFiltradas,
  eliminarTareaSemanal,
  tareasSemana,
  setTareasSemana,
  numeroSemanaActual,
  iniciarTemporizadorTarea,
  diasTotales,
  diaActualDelAnio,
  agregandoTareaSemanal,
  setAgregandoTareaSemanal,
  horaActual,
  fechasImportantes,
  setVistaActiva,
  setTareaId,
}) {
  const [mostrarEstadisticas, setMostrarEstadisticas] = useState(false);
  const [nuevaTareaSemanal, setNuevaTareaSemanal] = useState({
    titulo: "",
    dia: diaSemanaSeleccionado,
    horaInicio: "09:00",
    duracion: "01:00",
  });

  const { crearHistorial } = useHistorial();

  const completarTarea = async (tareaId) => {
    try {
      await crearHistorial(tareaId);
      setTareasSemana(prev => prev.map(t => 
        t.id === tareaId ? { ...t, completada: true } : t
      ));
    } catch (error) {
      console.error("Error al completar la tarea:", error);
    }
  };


  const diaActual = new Date()
    .toLocaleDateString("es-ES", { weekday: "long" })
    .toLowerCase();
  // const desactivar = diaSemanaSeleccionado !== diaActual; // Eliminar esta línea

  const { setVolverCargarTareasFiltradas } = useContext(
    ContextVolverACargarTareasFiltradas
  );
  const { crearSemana, actualizarSemana, clonarDia } = useSemanas();
  const [editandoEnLinea, setEditandoEnLinea] = useState(null);

  const calcularHorasTotales = () => {
    // Función para convertir tiempo de formato HH:mm a horas
    const convertirADuracionEnHoras = (duracion) => {
      const [horas, minutos] = duracion.split(":").map(Number);
      return horas + minutos / 60;
    };

    // Sumar las horas de todas las tareas
    const totalHoras = tareasSemanaFiltradas.reduce((total, tarea) => {
      return total + convertirADuracionEnHoras(tarea.duracion);
    }, 0);

    // Convertir el total de horas a string con el formato adecuado
    const horasEnteras = Math.floor(totalHoras);
    const minutos = Math.round((totalHoras - horasEnteras) * 60);
    return `${horasEnteras.toString().padStart(2, "0")}:${minutos
      .toString()
      .padStart(2, "0")}`;
  };

  // Calcular las horas restantes del día (24 - suma de horas)
  const calcularHorasRestantes = () => {
    const horasTotales = calcularHorasTotales(); // retorna string "HH:MM"

    if (horasTotales === "00:00") return "24:00";

    const [horasStr, minutosStr] = horasTotales.split(":");
    const horas = parseInt(horasStr, 10);
    const minutos = parseInt(minutosStr, 10);

    // Calculamos los minutos totales usados
    const minutosUsados = horas * 60 + minutos;
    const minutosRestantes = 1440 - minutosUsados; // 1440 min = 24 horas

    const horasLibres = Math.floor(minutosRestantes / 60);
    const minutosLibres = minutosRestantes % 60;

    // Formateo bonito con padding
    const hStr = String(horasLibres).padStart(2, "0");
    const mStr = String(minutosLibres).padStart(2, "0");

    return `${hStr}:${mStr}`;
  };

  // Obtener progreso anual
  const obtenerProgresoAnual = () => {
    return (diaActualDelAnio / diasTotales) * 100;
  };

  // Función para agregar nueva tarea semanal
  const agregarTareaSemanal = async () => {
    if (nuevaTareaSemanal.titulo.trim() === "") return;
    try {

      console.log(nuevaTareaSemanal)
      // Crear la actividad semanal usando el contexto
      await crearSemana({
        titulo: nuevaTareaSemanal.titulo,
        horaACompletar: nuevaTareaSemanal.horaInicio,
        duracion: nuevaTareaSemanal.duracion,
        dia: diaSemanaSeleccionado
      });

      // Limpiar el formulario
      setNuevaTareaSemanal({
        titulo: "",
        dia: diaSemanaSeleccionado,
        horaInicio: "00:00",
        duracion: "01:00",
      });

      // Cerrar el formulario
      setAgregandoTareaSemanal(false);
    } catch (error) {
      console.error("Error al crear actividad semanal:", error);
    }
  };
  // Función para guardar tarea editada en línea

  const guardarTareaEditadaEnLinea = async () => {
    if (!editandoEnLinea) return;

    try {
      await actualizarSemana(editandoEnLinea.id, {
        titulo: editandoEnLinea.titulo,
        horaACompletar: editandoEnLinea.horaACompletar,
        duracion: editandoEnLinea.duracion,
     
      });
      setEditandoEnLinea(null);
    } catch (error) {
      console.error("Error al actualizar semana:", error);
    }
  };

  // Función para iniciar edición en línea
  const iniciarEdicionEnLinea = (tarea) => {
    setEditandoEnLinea({ ...tarea });
  };

  // Añadir este useEffect al principio del componente VistaSemanal
  useEffect(() => {
    // Obtener el día actual de la semana
    const hoy = new Date();
    const diaSemanaActual = hoy
      .toLocaleDateString("es-ES", { weekday: "long" })
      .toLowerCase();

    // Verificar si el día actual está en la lista de días de la semana
    if (diasSemana.includes(diaSemanaActual)) {
      setDiaSemanaSeleccionado(diaSemanaActual);
    }
  }, []);

  function sumarHorasSemana(tareas) {
    // Suma todas las duraciones en formato HH:mm y retorna total en minutos
    return tareas.reduce((total, tarea) => {
      if (!tarea.duracion) return total;
      const [h, m] = tarea.duracion.split(":").map(Number);
      return total + h * 60 + m;
    }, 0);
  }

  function formatearMinutosAHoras(minutos) {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Contenido principal */}
      <div className="flex-1">
        {/* Visualización de días estilo GitHub */}
        <VisualizacionDias
          diasTotales={diasTotales}
          diaActualDelAnio={diaActualDelAnio}
          tareas={tareasSemana}
          fechasImportantes={fechasImportantes}
          tareasSemana={tareasSemana}
          diasSemana={diasSemana}
          setDiaSemanaSeleccionado={setDiaSemanaSeleccionado}
          setVistaActiva={setVistaActiva}
        />

        <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-4 shadow-lg mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
            <h2 className="text-lg font-medium flex items-center gap-2 text-white/90">
              <CalendarDays className="h-4 w-4 text-emerald-400" />
              Mi Semana{" "}
              <span className="text-xs text-white/50 ml-2">
                Semana #{numeroSemanaActual}
              </span>
            </h2>

            {/* Reemplazar el código de los botones de días de la semana con este: */}
            <CardDiaSemana
              setDiaSemanaSeleccionado={setDiaSemanaSeleccionado}
              diaSemanaSeleccionado={diaSemanaSeleccionado}
              diasSemana={diasSemana}
            />
          </div>

          {/* Botón para mostrar/ocultar estadísticas en móviles */}
          <BtnMostrarEstadisticasMoviles
            mostrarEstadisticas={mostrarEstadisticas}
            setMostrarEstadisticas={setMostrarEstadisticas}
          />

          {/* Estadísticas para móviles (condicional) */}
          {mostrarEstadisticas && (
            <div className="md:hidden mb-6">
              <EstadisticasSemanales
                tareasSemana={tareasSemana}
                diasSemana={diasSemana}
              />
            </div>
          )}

          <div className="flex flex-col gap-6">
            {/* Tabla de tareas semanales adaptada para móviles */}
            <div className="overflow-x-auto">
              {/* Versión para escritorio */}
              <div className="hidden md:block min-w-[700px]">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="py-2 px-3 text-left text-xs font-medium text-white/50">
                        Tarea
                      </th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-white/50">
                        Hora
                      </th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-white/50">
                        Duración
                      </th>
                      <th className="py-2 px-3 text-center text-xs font-medium text-white/50">
                        Estado
                      </th>
                      <th className="py-2 px-3 text-center text-xs font-medium text-white/50">
                        ✓
                      </th>
                      <th className="py-2 px-3 text-center text-xs font-medium text-white/50">
                        ✗
                      </th>
                      <th className="py-2 px-3 text-right text-xs font-medium text-white/50">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tareasSemanaFiltradas.length > 0 ? (
                      tareasSemanaFiltradas.map((tarea) => (
                        <tr
                          key={tarea.id}
                          className="border-b border-white/5 hover:bg-white/5"
                        >
                          {editandoEnLinea &&
                          editandoEnLinea.id === tarea.id ? (
                            <CardModoEdicionLineaMiSemana
                              editandoEnLinea={editandoEnLinea}
                              setEditandoEnLinea={setEditandoEnLinea}
                              tarea={tarea}
                              guardarTareaEditadaEnLinea={
                                guardarTareaEditadaEnLinea
                              }
                            />
                          ) : (
                            // Modo visualización
                            <CardModoVisualizacionMiSemana
                              setTareaId={setTareaId}
                              tarea={tarea}
                              desactivar={false} // Siempre permitir acciones
                              iniciarTemporizadorTarea={
                                iniciarTemporizadorTarea
                              }
                              iniciarEdicionEnLinea={iniciarEdicionEnLinea}
                              eliminarTareaSemanal={eliminarTareaSemanal}
                              setDiaSemanaSeleccionado={
                                setDiaSemanaSeleccionado
                              }
                              completarTarea={completarTarea}
                            />
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-8 text-center text-white/40 text-sm"
                        >
                          No hay tareas planificadas para este día.
                        </td>
                      </tr>
                    )}

                    {/* Fila para agregar nueva tarea */}
                    {agregandoTareaSemanal && (
                      <CardFilaAgregarNuevaTareaMiSemana
                        nuevaTareaSemanal={nuevaTareaSemanal}
                        setNuevaTareaSemanal={setNuevaTareaSemanal}
                        setAgregandoTareaSemanal={setAgregandoTareaSemanal}
                        diaSemanaSeleccionado={diaSemanaSeleccionado}
                        desactivar={false} // Siempre permitir crear tarea
                      />
                    )}
                  </tbody>
                </table>
              </div>

              {/* Versión para móviles */}
              <div className="md:hidden">
                {tareasSemanaFiltradas.length > 0 ? (
                  <div className="space-y-3">
                    {tareasSemanaFiltradas.map((tarea) => (
                      <div
                        key={tarea.id}
                        className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-4 shadow-lg bg-black/30 p-3"
                      >
                        {editandoEnLinea && editandoEnLinea.id === tarea.id ? (
                          // Modo edición en línea para móviles
                          <CardModoEdicionMovilMiSemana
                            setEditandoEnLinea={setEditandoEnLinea}
                            editandoEnLinea={editandoEnLinea}
                            guardarTareaEditadaEnLinea={guardarTareaEditadaEnLinea}
                          />
                        ) : (
                          // Modo visualización para móviles
                          <CardModoVisualizacionMovilMiSemana
                            tarea={tarea}
                            desactivar={false} // Siempre permitir acciones
                            iniciarTemporizadorTarea={iniciarTemporizadorTarea}
                            iniciarEdicionEnLinea={iniciarEdicionEnLinea}
                            eliminarTareaSemanal={eliminarTareaSemanal}
                            completarTarea={completarTarea}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-white/40 text-sm">
                    No hay tareas planificadas para este día.
                  </div>
                )}

                {/* Formulario móvil para agregar tarea */}
                {agregandoTareaSemanal && (
                  <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-4 shadow-lg bg-black/30 p-3 mt-3">
                    <h4 className="text-sm font-medium mb-2">Nueva tarea</h4>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={nuevaTareaSemanal.titulo}
                        onChange={(e) =>
                          setNuevaTareaSemanal({
                            ...nuevaTareaSemanal,
                            titulo: e.target.value,
                          })
                        }
                        placeholder="Título de la tarea"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-white/50 mb-1 block">
                            Hora
                          </label>
                          <input
                            type="time"
                            value={nuevaTareaSemanal.horaInicio}
                            onChange={(e) =>
                              setNuevaTareaSemanal({
                                ...nuevaTareaSemanal,
                                horaInicio: e.target.value,
                              })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-white/50 mb-1 block">
                            Duración
                          </label>
                          <input
                              type="text"
                             placeholder="00:00"
                             value={nuevaTareaSemanal.duracion}
                            onChange={(e) =>
                              setNuevaTareaSemanal({
                                ...nuevaTareaSemanal,
                                duracion:formatearYValidarHora(e.target.value)
                              })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => setAgregandoTareaSemanal(false)}
                          className="px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-white/10 hover:bg-white/20 text-white text-xs"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={agregarTareaSemanal}
                          className="px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                          disabled={!nuevaTareaSemanal.titulo.trim()}
                        >

                          Guardar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Información de horas totales y restantes (diseño moderno) */}
        <CardInfoDeHorasTotalesYRestante
          calcularHorasTotales={calcularHorasTotales}
          calcularHorasRestantes={calcularHorasRestantes}
        />
        {/* Botón para planificar nueva tarea (al final a la derecha) */}
        <BtnAgregarMiSemana
          setAgregandoTareaSemanal={setAgregandoTareaSemanal}
          agregandoTareaSemanal={agregandoTareaSemanal}
          diasSemana={diasSemana}
          onClonarDia={async (diaOrigen, diaDestino) => {
            await clonarDia(diaOrigen, diaDestino);
            // alert eliminado
          }}
        />
      </div>

      {/* Panel lateral con reloj y top usuarios */}
      <div className="w-full lg:w-64 flex-shrink-0 space-y-4">
        {/* Reloj minimalista con cuenta regresiva */}
        <Cronometro
          horaActual={horaActual}
          diaActualDelAnio={diaActualDelAnio}
          diasTotales={diasTotales}
          obtenerProgresoAnual={obtenerProgresoAnual}
        />

        {/* Panel de Top Usuarios */}
        <TopUsuarios />

        {/* Panel de estadísticas */}
        <div className="hidden md:block">
          <EstadisticasSemanales
          setTareasSemana={setTareasSemana}
            tareasSemana={tareasSemana}
            diasSemana={diasSemana}
          />
        </div>
      </div>
      <div className="hidden md:block w-full mt-10">
        {/* Resumen semanal de productividad */}
        {(() => {
          const minutosPlanificados = sumarHorasSemana(tareasSemana);
          const tiempoTotalSemana = 7 * 24 * 60; // 168h en minutos
          const porcentaje = (minutosPlanificados / tiempoTotalSemana) * 100;
          return (
            <div className="rounded-2xl bg-gradient-to-r from-emerald-700 to-green-400 p-8 shadow-2xl flex flex-col items-center border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="text-white drop-shadow-lg" size={32} />
                <span className="font-bold text-white text-2xl tracking-wide drop-shadow-lg">Productividad semanal</span>
              </div>
              <div className="text-5xl font-mono text-white font-extrabold drop-shadow-lg">{formatearMinutosAHoras(minutosPlanificados)} <span className="text-2xl font-normal">/ 168:00</span></div>
              <div className="text-white/90 mt-2 text-lg">Horas planificadas esta semana</div>
              <div className="w-full bg-white/20 rounded-full h-4 mt-6 mb-2 overflow-hidden">
                <div
                  className="bg-white h-4 rounded-full transition-all duration-500"
                  style={{ width: `${porcentaje > 100 ? 100 : porcentaje}%` }}
                />
              </div>
              <div className="text-white/80 mt-2 text-xl font-semibold">{porcentaje.toFixed(1)}% de productividad</div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

export default VistaSemanal;
