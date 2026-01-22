import { useState, useEffect, useContext } from "react";
import VisualizacionDias from "./VisualizacionDias.js";
import { Play, Edit, Trash2, Check, PenTool, X } from "lucide-react";

import { CalendarDays } from "lucide-react";
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
import ModalClonarTareas from "../modals/ModalClonarTareas.js";
import TaskCard from "../ui/TaskCard.js";



function VistaSemanal({
  diasSemana,
  diaSemanaSeleccionado,
  setDiaSemanaSeleccionado,
  tareasSemanaFiltradas,
  setEditandoTareaSemanal,
  eliminarTareaSemanal,
  tareasSemana,
  setTareasSemana,
  numeroSemanaActual,
  iniciarTemporizadorTarea,
  diasTotales,
  diaActualDelAnio,
  agregandoTareaSemanal,
  setAgregandoTareaSemanal,
  usuarios,
  horaActual,
  fechasImportantes,
  setVistaActiva,
  setTareaId,
  filtroActivo,
  tareas = [],
  eliminarTarea,
  iniciarEditarTarea,
  alternarTarea,
}) {
  const [mostrarEstadisticas, setMostrarEstadisticas] = useState(false);
  const [mostrarModalClonar, setMostrarModalClonar] = useState(false);
  const [nuevaTareaSemanal, setNuevaTareaSemanal] = useState({
    titulo: "",
    dia: diaSemanaSeleccionado,
    horaInicio: "09:00",
    duracion: "01:00",
    sinHora: false,
  });

  const { setVolverCargarTareasFiltradas } = useContext(
    ContextVolverACargarTareasFiltradas
  );

  const [editandoEnLinea, setEditandoEnLinea] = useState(null);

  const calcularHorasTotales = () => {
    // Función para convertir tiempo de formato HH:mm a horas
    const convertirADuracionEnHoras = (duracion) => {
      if (!duracion) return 0; // Si no hay duración, retornar 0
      const [horas, minutos] = duracion.split(":").map(Number);
      return horas + minutos / 60;
    };

    // Filtrar tareas del día seleccionado
    const tareasDelDia = tareasSemanaFiltradas.filter(
      (tarea) => tarea.dia === diaSemanaSeleccionado
    );

    // Sumar las horas de todas las tareas del día (excluir tareas sin hora y duración)
    const totalHoras = tareasDelDia.reduce((total, tarea) => {
      // Ignorar tareas sin hora específica, sin duración o sin horaInicio
      if (tarea.sinHora || !tarea.duracion || !tarea.horaInicio) return total;
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
  const agregarTareaSemanal = () => {
    if (nuevaTareaSemanal.titulo.trim() === "") return;

    const tareaSemanal = {
      id: `w${Date.now()}`,
      titulo: nuevaTareaSemanal.titulo,
      dia: nuevaTareaSemanal.dia,
      horaInicio: nuevaTareaSemanal.sinHora ? null : nuevaTareaSemanal.horaInicio,
      duracion: nuevaTareaSemanal.sinHora ? null : nuevaTareaSemanal.duracion,
      sinHora: nuevaTareaSemanal.sinHora,
      completada: false,
      contadorCompletadas: 0,
      contadorNoCompletadas: 0,
      ultimaSemanReinicio: numeroSemanaActual,
    };

    // Añadir la nueva tarea y ordenar por hora de inicio (tareas sin hora al final)
    const tareasActualizadas = [...tareasSemana, tareaSemanal].sort((a, b) => {
      if (a.dia !== b.dia) return 0; // Solo ordenar dentro del mismo día
      if (a.sinHora && !b.sinHora) return 1; // Tareas sin hora al final
      if (!a.sinHora && b.sinHora) return -1;
      if (a.sinHora && b.sinHora) return 0; // Mantener orden entre tareas sin hora
      return (a.horaInicio || "").localeCompare(b.horaInicio || "");
    });

    setTareasSemana(tareasActualizadas);
    setAgregandoTareaSemanal(false);
    setVolverCargarTareasFiltradas((prev) => !prev);

    setNuevaTareaSemanal({
      titulo: "",
      dia: diaSemanaSeleccionado,
      horaInicio: "09:00",
      duracion: "01:00",
      sinHora: false,
    });
  };

  // Función para clonar todas las tareas de un día a otro
  // ALGORITMO DE CLONACIÓN:
  // 1. Filtra todas las tareas del día origen
  // 2. Para cada tarea, crea una copia con nuevos valores para campos específicos
  // 3. Asigna un nuevo ID único, cambia el día al destino y resetea campos de estado
  // 4. Los contadores se inicializan en 0 y completada en false
  const clonarTareasDia = (diaDestino) => {
    if (!diaSemanaSeleccionado || !diaDestino) return;

    // Obtener todas las tareas del día origen
    const tareasDelDiaOrigen = tareasSemana.filter(
      (tarea) => tarea.dia === diaSemanaSeleccionado
    );

    if (tareasDelDiaOrigen.length === 0) {
      // No hay tareas para clonar
      return;
    }

    // Clonar las tareas con nuevos IDs y cambiar el día
    // IMPORTANTE: Inicializar contadores en 0 y completada en false
    const tareasClonadas = tareasDelDiaOrigen.map((tarea) => {
      // Destructuring para separar los campos que NO queremos clonar con sus valores originales
      const {
        id,                    // No clonar el ID (generamos uno nuevo)
        dia,                   // No clonar el día (lo cambiamos)
        completada,            // No clonar completada (siempre false)
        contadorCompletadas,   // No clonar el valor (inicializar en 0)
        contadorNoCompletadas, // No clonar el valor (inicializar en 0)
        ultimaSemanReinicio,   // No clonar (se inicializará si es necesario)
        ...restoTarea          // Copiar todos los demás campos (titulo, horaInicio, duracion, etc.)
      } = tarea;

      // Crear la tarea clonada con contadores inicializados en 0
      return {
        ...restoTarea,         // Todos los campos excepto los excluidos (titulo, horaInicio, duracion, etc.)
        id: `w${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Nuevo ID único
        dia: diaDestino,       // Nuevo día
        completada: false,     // Las tareas clonadas siempre empiezan como no completadas
        contadorCompletadas: 0,    // Inicializar contador en 0
        contadorNoCompletadas: 0,  // Inicializar contador en 0
      };
    });

    // Añadir las tareas clonadas a las tareas existentes y ordenar
    const tareasActualizadas = [...tareasSemana, ...tareasClonadas].sort((a, b) => {
      if (a.dia !== b.dia) return 0; // Solo ordenar dentro del mismo día
      if (a.sinHora && !b.sinHora) return 1; // Tareas sin hora al final
      if (!a.sinHora && b.sinHora) return -1;
      if (a.sinHora && b.sinHora) return 0; // Mantener orden entre tareas sin hora
      return (a.horaInicio || "").localeCompare(b.horaInicio || "");
    });

    setTareasSemana(tareasActualizadas);
    setVolverCargarTareasFiltradas((prev) => !prev);
    
    // Cambiar al día destino después de clonar
    setDiaSemanaSeleccionado(diaDestino);
  };
  // Función para guardar tarea editada en línea

  const guardarTareaEditadaEnLinea = () => {
    if (!editandoEnLinea) return;
    
    // Asegurar que si sinHora es true, horaInicio y duracion sean null
    const tareaActualizada = {
      ...editandoEnLinea,
      horaInicio: editandoEnLinea.sinHora ? null : editandoEnLinea.horaInicio,
      duracion: editandoEnLinea.sinHora ? null : editandoEnLinea.duracion,
    };
    
    setTareasSemana((prev) =>
      prev.map((tarea) =>
        tarea.id === editandoEnLinea.id ? tareaActualizada : tarea
      )
    );
    setVolverCargarTareasFiltradas(prev => !prev )
    setEditandoEnLinea(null);
  };

  // Función para iniciar edición en línea
  const iniciarEdicionEnLinea = (tarea) => {
    setEditandoEnLinea({ ...tarea });
  };

  // Añadir este useEffect al principio del componente VistaSemanal
  // Solo se ejecuta una vez al montar el componente para establecer el día actual inicial
  // No se ejecuta cuando el usuario selecciona manualmente un día
  useEffect(() => {
    // Solo establecer el día actual si no hay un día ya seleccionado
    // o si el día seleccionado no está en la lista de días de la semana
    if (!diaSemanaSeleccionado || !diasSemana.includes(diaSemanaSeleccionado)) {
      // Obtener el día actual de la semana
      const hoy = new Date();
      const diaSemanaActual = hoy
        .toLocaleDateString("es-ES", { weekday: "long" })
        .toLowerCase();

      // Verificar si el día actual está en la lista de días de la semana
      if (diasSemana.includes(diaSemanaActual)) {
        setDiaSemanaSeleccionado(diaSemanaActual);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar

  // Actualizar el día en nuevaTareaSemanal cuando cambie el día seleccionado
  // Esto asegura que cuando el usuario selecciona un día y crea una tarea, 
  // la tarea se crea para el día seleccionado, no para el día de hoy
  useEffect(() => {
    if (diaSemanaSeleccionado) {
      // Si no se está agregando una tarea, actualizar el día inmediatamente
      // Si se está agregando una tarea, actualizar el día para que la nueva tarea
      // se cree para el día seleccionado
      setNuevaTareaSemanal(prev => ({
        ...prev,
        dia: diaSemanaSeleccionado
      }));
    }
  }, [diaSemanaSeleccionado]);

  // Filtrar tareas según el filtro activo
  // Convertir "notas" -> "nota"
  const tipoFiltro = filtroActivo === "notas" ? "nota" : null;
  const tareasFiltradas = tipoFiltro && Array.isArray(tareas)
    ? tareas.filter(tarea => {
        // Validar que la tarea tenga las propiedades necesarias
        return tarea && 
               typeof tarea === 'object' && 
               tarea.tipo === tipoFiltro &&
               tarea.id &&
               tarea.titulo;
      })
    : [];

// estado  que filtra  las tareas por dia de la semanan en  base a los eventos click
    const [tareasFiltradasDia, setTareasFiltradasDia] = useState([]);
    
  useEffect(()=>{
    const  tareasFiltradasDia = tareasSemanaFiltradas.filter(tarea => tarea.dia === diaSemanaSeleccionado)
    setTareasFiltradasDia(tareasFiltradasDia)
  },[diaSemanaSeleccionado,tareasSemanaFiltradas]);



 useEffect(()=>{
  console.log(filtroActivo)
 },[filtroActivo]);

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

        {/* Mostrar notas si hay filtro activo - fuera de Mi Semana */}
        {filtroActivo === "notas" && (
          <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-4 shadow-lg mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
              <h2 className="text-lg font-medium flex items-center gap-2 text-white/90">
                <PenTool className="h-5 w-5 text-emerald-400" />
                Notas
                <span className="text-xs text-white/50 ml-2">
                  ({tareasFiltradas.length})
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tareasFiltradas.length > 0 ? (
                tareasFiltradas.map((tarea) => (
                  <TaskCard
                    key={tarea.id}
                    tarea={tarea}
                    onEdit={iniciarEditarTarea}
                    onDelete={eliminarTarea}
                    onToggleComplete={alternarTarea}
                  />
                ))
              ) : (
                <div className="col-span-3 py-8 text-center text-white/40 text-sm">
                  No hay notas disponibles.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sección Mi Semana - solo se muestra si no hay filtro activo */}
        {!filtroActivo && (
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
                    {tareasFiltradasDia.length > 0 ? (
                      tareasFiltradasDia.map((tarea) => (
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
                              iniciarTemporizadorTarea={
                                iniciarTemporizadorTarea
                              }
                              iniciarEdicionEnLinea={iniciarEdicionEnLinea}
                              eliminarTareaSemanal={eliminarTareaSemanal}
                              setDiaSemanaSeleccionado={
                                setDiaSemanaSeleccionado
                              }
                            />
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={8}
                          className="py-8 text-center text-white/40 text-sm"
                        >
                          No hay tareas planificadas para esta semana.
                        </td>
                      </tr>
                    )}

                    {/* Fila para agregar nueva tarea */}
                    {agregandoTareaSemanal && (
                      <CardFilaAgregarNuevaTareaMiSemana
                        nuevaTareaSemanal={nuevaTareaSemanal}
                        setNuevaTareaSemanal={setNuevaTareaSemanal}
                        agregarTareaSemanal={agregarTareaSemanal}
                        setAgregandoTareaSemanal={setAgregandoTareaSemanal}
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
                            iniciarTemporizadorTarea={iniciarTemporizadorTarea}
                            iniciarEdicionEnLinea={iniciarEdicionEnLinea}
                            eliminarTareaSemanal={eliminarTareaSemanal}
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
                  <div className="backdrop-blur-md bg-gradient-to-br from-black/40 to-black/20 border border-emerald-500/20 rounded-xl p-5 shadow-xl mt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-base font-semibold text-white">Nueva Tarea Semanal</h4>
                      <button
                        onClick={() => setAgregandoTareaSemanal(false)}
                        className="text-white/50 hover:text-white transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-white/80 mb-2">
                          Título de la tarea
                        </label>
                        <input
                          type="text"
                          value={nuevaTareaSemanal.titulo}
                          onChange={(e) =>
                            setNuevaTareaSemanal({
                              ...nuevaTareaSemanal,
                              titulo: e.target.value,
                            })
                          }
                          placeholder="Ej: Ejercicio matutino"
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-white placeholder-white/40 transition-all"
                        />
                      </div>
                      
                      <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="sinHora"
                            checked={nuevaTareaSemanal.sinHora}
                            onChange={(e) =>
                              setNuevaTareaSemanal({
                                ...nuevaTareaSemanal,
                                sinHora: e.target.checked,
                              })
                            }
                            className="w-5 h-5 rounded border-white/30 bg-white/10 text-emerald-500 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                          />
                          <label htmlFor="sinHora" className="text-sm text-white/90 cursor-pointer flex-1">
                            Sin hora específica
                            <span className="block text-xs text-white/60 mt-0.5">
                              Completa esta tarea cuando sea necesario
                            </span>
                          </label>
                        </div>
                      </div>
                      
                      {!nuevaTareaSemanal.sinHora && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-white/80 mb-2">
                              Hora de inicio
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
                              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-white transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-white/80 mb-2">
                              Duración
                            </label>
                            <input
                              type="text"
                              placeholder="01:30"
                              value={nuevaTareaSemanal.duracion}
                              onChange={(e) =>
                                setNuevaTareaSemanal({
                                  ...nuevaTareaSemanal,
                                  duracion:formatearYValidarHora(e.target.value)
                                })
                              }
                              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm text-white placeholder-white/40 transition-all"
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          onClick={() => setAgregandoTareaSemanal(false)}
                          className="px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={agregarTareaSemanal}
                          className="px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!nuevaTareaSemanal.titulo.trim()}
                        >
                          Crear Tarea
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Información de horas totales y restantes (diseño moderno) - solo se muestra si no hay filtro */}
        {!filtroActivo && (
          <>
            <CardInfoDeHorasTotalesYRestante
              calcularHorasTotales={calcularHorasTotales}
              calcularHorasRestantes={calcularHorasRestantes}
            />
            {/* Botón para planificar nueva tarea (al final a la derecha) */}
            <BtnAgregarMiSemana
              setAgregandoTareaSemanal={setAgregandoTareaSemanal}
              agregandoTareaSemanal={agregandoTareaSemanal}
              onClonarClick={() => setMostrarModalClonar(true)}
            />
          </>
        )}
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
        <TopUsuarios usuarios={usuarios} />

        {/* Panel de estadísticas */}
        <div className="hidden md:block">
          <EstadisticasSemanales
          setTareasSemana={setTareasSemana}
            tareasSemana={tareasSemana}
            diasSemana={diasSemana}
          />
        </div>
      </div>

      {/* Modal para clonar tareas */}
      {mostrarModalClonar && (
        <ModalClonarTareas
          onClose={() => setMostrarModalClonar(false)}
          onConfirm={clonarTareasDia}
          diaOrigen={diaSemanaSeleccionado}
          diasSemana={diasSemana}
        />
      )}
    </div>
  );
}

export default VistaSemanal;
