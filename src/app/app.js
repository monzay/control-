import { useState, useEffect, useContext } from "react";
import Encabezado from "@/components/layout/Encabezado.js";
import { X, Plus, Sparkles, PenTool } from "lucide-react";
import MenuLateral from "@/components/layout/MenuLateral.js";
import TopUsuarios from "@/components/visualization/TopUsuarios.js";
import FechaModulo from "../function/FechaModulo.js";
import CrearHabitoModal from "@/components/modals/CrearHabitoModal.js";
import CrearNotaModal from "@/components/modals/CrearNotaModal";
import TaskCard from "../components/ui/TaskCard";
import VistaSemanal from "@/components/visualization/VistaSemanal";
import Temporizador from "@/components/modals/Temporizador.js";
import VisualizacionDias from "@/components/visualization/VisualizacionDias.js";
import funcionesGlobales from "../function/funcionesGlobales.js";
import { contextoStateX } from "@/Context/ProviderStateX.js";
import ModalEditarTareaSemana from "@/components/modals/ModalEditarTareaSemana.js";
import { ContextVolverACargarTareasFiltradas } from "@/Context/ProviderVolverACargarTareasFiltradas.js";
import EditarTareaModal from "@/components/modals/EditarTareaModal.js";
import Canales from "@/components/canales/canales.js"

import EditarNotaModal from "@/components/modals/EditarNotaModal";
import { useNotas } from "@/Context/NotasContext";
import { NotasProvider } from "@/Context/NotasContext";
import { ObjetivosProvider, useObjetivos } from "@/Context/ObjetivosContext";
import { SemanasProvider, useSemanas } from "@/Context/SemanasContext";
import { HistorialProvider } from "@/Context/HistorialContext";
import { CanalProvider } from "@/Context/CanalContext"; // Importar CanalProvider y useCanal
function App() {
  const [cargando, setCargando] = useState(true);
  const { notas, refrescarNotas, eliminarNota } = useNotas();

  const { objetivos, refrescarObjetivos, eliminarObjetivo, actualizarObjetivo } = useObjetivos();
  const { semanas, refrescarSemanas, actualizarSemana, eliminarSemana } = useSemanas();
  const {refrescarActividades} = useActividad()
  useEffect(() => {
    refrescarNotas();
    refrescarObjetivos(); // <-- Esto hará la petición de objetivos al cargar la web
    refrescarActividades();
    setCargando(false);
  }, []);

  const {
    tareasSemana,
    setTareasSemana,
    fechasImportantes,
    setFechasImportantes,
    usuarios,
    tareas,
    setTareas,
  } = useContext(contextoStateX);
  const diasTotales = 365;
  const diasSemana = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo",
  ];

  const [horaActual, setHoraActual] = useState(new Date());
  const [editandoTarea, setEditandoTarea] = useState(null);
  const [diaActualDelAnio, setDiaActualDelAnio] = useState(0);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [vistaActiva, setVistaActiva] = useState("semana"); // Cambiado a "semana" como vista principal
  const [mostrarTareas, setMostrarTareas] = useState(true);
  const [diaSemanaSeleccionado, setDiaSemanaSeleccionado] = useState(
    funcionesGlobales.obtenerNombreDelDia()
  );
  const [agregandoTareaSemanal, setAgregandoTareaSemanal] = useState(false);
  const [editandoTareaSemanal, setEditandoTareaSemanal] = useState(null);
  const [numeroSemanaActual, setNumeroSemanaActual] = useState(
    FechaModulo.obtenerNumeroSemana()
  );
  const [tareaTemporizador, setTareaTemporizador] = useState(null);
  const [mostrarModalTemporizador, setMostrarModalTemporizador] =
    useState(false);
  const [mostrarMenuCreacion, setMostrarMenuCreacion] = useState(false);
  const [mostrarModalNota, setMostrarModalNota] = useState(false);
  const [mostrarModalHabito, setMostrarModalHabito] = useState(false);
  const [tareaId, setTareaId] = useState(null);
  const [notaEditando, setNotaEditando] = useState(null);
  const [habitoEditando, setHabitoEditando] = useState(null);

  // Actualizar la hora actual cada segundo
  useEffect(() => {
    const temporizador = setInterval(() => {
      setHoraActual(new Date());
    }, 1000);
    return () => clearInterval(temporizador);
  }, []);

  // Calcular el día actual del año
  useEffect(() => {
    setDiaActualDelAnio(funcionesGlobales.ObtenerDiaNumeroDelAño());
  }, []);

  // Verificar si es un nuevo lunes para reiniciar las tareas semanales
  useEffect(() => {
    const verificarNuevaSemana = async () => {
      const semanaActual = FechaModulo.obtenerNumeroSemana();
    };

    // Verificar al cargar y configurar un intervalo diario
    verificarNuevaSemana();
    const verificacionDiaria = setInterval(
      verificarNuevaSemana,
      1000 * 60 * 60 * 24
    ); // Verificar cada 24 horas

    return () => clearInterval(verificacionDiaria);
  }, []);

  
  // Unificar fechas importantes de notas y hábitos
  useEffect(() => {
    const fechasNotas = notas
      .filter(nota => nota.fechaFin)
      .map(nota => ({
        fecha: nota.fechaFin,
        tipo: 'nota',
        titulo: nota.titulo,
        color: 'bg-blue-500',
        cantidadDias: Number(nota.cantidadDias || nota.cantidasDias || 0),
      }));
    const fechasHabitos = objetivos
      .filter(obj => obj.fechaFin)
      .map(obj => ({
        fecha: obj.fechaFin,
        tipo: 'habito-fin',
        titulo: obj.titulo,
        color: 'bg-purple-500',
        cantidadDias: Number(obj.cantidadDias || obj.cantidasDias || 0),
      }));
    setFechasImportantes([...fechasNotas, ...fechasHabitos]);
  }, [notas, objetivos, setFechasImportantes]);

  //---------------------------------------------------------//


  const guardarTareaEditada = (tareaActualizada) => {
    // Actualizar fechas importantes si cambió la fecha de finalización
    if (tareaActualizada.fechaFin !== undefined) {
      // Eliminar fecha importante anterior
      setFechasImportantes((prev) =>
        prev.filter((fecha) => fecha.idTarea !== tareaActualizada.id)
      );

      // Crear nueva fecha importante si hay fecha de finalización
      if (tareaActualizada.fechaFin) {
        const nuevaFecha = {
          id: `tarea-fin-${tareaActualizada.id}`,
          fecha: tareaActualizada.fechaFin,
          titulo: `Fin de ${
            tareaActualizada.tipo === "habito" ? "hábito" : "nota"
          }: ${tareaActualizada.titulo}`,
          tipo: tareaActualizada.tipo === "habito" ? "habito-fin" : "nota",
          color: "bg-emerald-500",
          idTarea: tareaActualizada.id,
        };
        setFechasImportantes((prev) => [...prev, nuevaFecha]);
      }
    }

    // Actualizar la tarea
    setTareas((prev) =>
      prev.map((tarea) =>
        tarea.id === tareaActualizada.id ? tareaActualizada : tarea
      )
    );

    // Actualizar tareas semanales relacionadas usando el contexto
    // Esto se manejará automáticamente cuando se actualice el contexto

    setEditandoTarea(null);
  };

  //---------------------------------------------------------//
  useEffect(()=>{
    function actualizarActividad(dia) {
      const tareas = semanas;
      const tareasDelDia = tareas.filter((tarea) => tarea?.dia === dia);
      const completadas = tareasDelDia.filter(
        (tarea) => tarea.completada === true
      ).length;

      const porcentaje =
        tareasDelDia.length > 0
          ? Math.floor((completadas / tareasDelDia.length) * 100)
          : 0;

      // El porcentaje se calcula pero no se guarda en localStorage
      console.log(`Porcentaje de tareas completadas para ${dia}: ${porcentaje}%`);
    }
    actualizarActividad(diaSemanaSeleccionado)
  },[semanas])

  // Editar tarea semanal
  const guardarTareaEditadaSemanal = async () => {
    if (!editandoTareaSemanal) return;

    try {
      await actualizarSemana(editandoTareaSemanal.id, {
        titulo: editandoTareaSemanal.titulo,
        horaACompletar: editandoTareaSemanal.horaACompletar,
        duracion: editandoTareaSemanal.duracion,
        completada: editandoTareaSemanal.completada,
        dia: editandoTareaSemanal.dia
      });
      setEditandoTareaSemanal(null);
    } catch (error) {
      console.error("Error al actualizar semana:", error);
    }
  };

  // Eliminar tarea semanal
  const eliminarTareaSemanal = async (id) => {
    try {
      await eliminarSemana(id);
      if (editandoTareaSemanal?.id === id) {
        setEditandoTareaSemanal(null);
      }
    } catch (error) {
      console.error("Error al eliminar semana:", error);
    }
  };

  const iniciarTemporizadorTarea = (tarea) => {
    setTareaTemporizador(tarea);
    setMostrarModalTemporizador(true);
  };

  // Obtener tareas semanales filtradas según el día seleccionado
  const obtenerTareasSemanaFiltradas = () => {
    return semanas
      .filter((tarea) => tarea.dia === diaSemanaSeleccionado)
      .sort((a, b) => a.horaACompletar.localeCompare(b.horaACompletar));
  };

  // Calcular el porcentaje de tiempo transcurrido en el año
  const obtenerProgresoAnual = () => {
    return (diaActualDelAnio / diasTotales) * 100;
  };

  const [tareasSemanaFiltradas, setTareasSemanaFiltradas] = useState([]);

  const { volverCargarTareasFiltradas } = useContext(
    ContextVolverACargarTareasFiltradas
  );
  // nucleo para volver  a mostrar las tareas filtradas de cada dia
  useEffect(() => {
    const tareas = obtenerTareasSemanaFiltradas();
    setTareasSemanaFiltradas(tareas);
  }, [volverCargarTareasFiltradas, semanas, diaSemanaSeleccionado]);

  useEffect(() => {
    if (vistaActiva === "notas") {
      refrescarNotas();
    }
    if (vistaActiva === "habitos") {
      refrescarObjetivos();
    }
    if (vistaActiva === "semana") {
      refrescarSemanas();
    }
  }, [vistaActiva]);


  // Modificar el return para incluir los botones de creación y los modales
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Contenido principal (solo visible si no se muestra ningún mensaje) */}
      {!cargando && (
          <div className="p-8">
            {/* Encabezado */}
            <Encabezado
              horaActual={horaActual}
              diaActualDelAnio={diaActualDelAnio}
              diasTotales={diasTotales}
              menuAbierto={menuAbierto}
              setMenuAbierto={setMenuAbierto}
              mostrarTareas={mostrarTareas}
              setMostrarTareas={setMostrarTareas}
            />

            <div className="flex flex-1 relative">
              {/* Menú lateral */}
              <MenuLateral
                menuAbierto={menuAbierto}
                vistaActiva={vistaActiva}
                setVistaActiva={setVistaActiva}
                setMenuAbierto={setMenuAbierto}
              />
              {/* Contenido principal */}
              <main className="flex-1 p-4 md:p-6 pt-2 relative z-10 overflow-x-hidden">
                <>
                  {mostrarTareas && (
                    <div> 
                      {vistaActiva === "semana" ? (
                        // Vista de Mi Semana
                        <VistaSemanal
                          setTareaId={setTareaId}
                          diasSemana={diasSemana}
                          diaSemanaSeleccionado={diaSemanaSeleccionado}
                          setDiaSemanaSeleccionado={setDiaSemanaSeleccionado}
                          tareasSemanaFiltradas={tareasSemanaFiltradas}
                          setEditandoTareaSemanal={setEditandoTareaSemanal}
                          eliminarTareaSemanal={eliminarTareaSemanal}
                          tareasSemana={tareasSemana}
                          setTareasSemana={setTareasSemana}
                          numeroSemanaActual={numeroSemanaActual}
                          iniciarTemporizadorTarea={iniciarTemporizadorTarea}
                          diasTotales={diasTotales}
                          diaActualDelAnio={diaActualDelAnio}
                          agregandoTareaSemanal={agregandoTareaSemanal}
                          setAgregandoTareaSemanal={setAgregandoTareaSemanal}
                          usuarios={usuarios}
                          horaActual={horaActual}
                          fechasImportantes={fechasImportantes}
                          setVistaActiva={setVistaActiva}
                        />
                      ) : (
                        <div className="flex flex-col md:flex-row gap-4">
                          {/* Contenedor principal  cde tareas */}
                          <div className="flex-1 relative h-full">
                            {/* Visualización de días estilo GitHub */}
                            <VisualizacionDias
                              diasTotales={diasTotales}
                              diaActualDelAnio={diaActualDelAnio}
                              tareas={tareas}
                              fechasImportantes={fechasImportantes}
                              tareasSemana={tareasSemana}
                              diasSemana={diasSemana}
                              setDiaSemanaSeleccionado={
                                setDiaSemanaSeleccionado
                              }
                              setVistaActiva={setVistaActiva}
                            />
                            {vistaActiva === "notas"  ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full min-h-[400px] h-full flex-1">
                                {notas.map((nota) => (
                                  <TaskCard
                                    key={nota.id}
                                    tarea={{ ...nota, tipo: "nota" }}
                                    onEdit={() => setNotaEditando(nota)}
                                    onDelete={eliminarNota}
                                    onToggleComplete={null}
                                    className="w-full"
                                  />
                                ))}
                              </div>
                             ) : vistaActiva === "habitos" ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full min-h-[400px] h-full flex-1">
                                {
                                   objetivos.map((habito) => (
                                    <TaskCard
                                      key={habito.id}
                                      tarea={{ ...habito, tipo: "habito" }}
                                      onEdit={() => setHabitoEditando(habito)}
                                      onDelete={eliminarObjetivo}
                                      onToggleComplete={() => {}}
                                      className="w-full"
                                    />
                                  ))
                                }
                              </div>
                             ) : vistaActiva === "canales" ? (
                                <Canales></Canales>
                             ) : null }
                          </div>

                          {/* Barra lateral con reloj y top usuarios */}
                          <div className="w-full md:w-64 flex-shrink-0">
                            <div className="sticky top-20">
                              {/* Reloj minimalista con cuenta regresiva */}
                              <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-4 shadow-lg relative overflow-hidden">
                                <div className="relative z-10">
                                  <div className="text-4xl font-mono font-light text-center mb-2">
                                    {`${(23 - horaActual.getHours())
                                      .toString()
                                      .padStart(2, "0")}:${(
                                      59 - horaActual.getMinutes()
                                    )
                                      .toString()
                                      .padStart(2, "0")}`}
                                  </div>
                                  <div className="text-sm text-white/50 text-center">
                                    Tiempo restante del día
                                  </div>
                                  <div className="text-xs text-white/40 text-center mt-1">
                                    Día {diaActualDelAnio} de {diasTotales}
                                  </div>

                                  {/* Barra de progreso del año */}
                                  <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-green-500 to-green-400"
                                      style={{
                                        width: `${obtenerProgresoAnual()}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </div>

                              {/* Panel de Top Usuarios */}
                              <TopUsuarios usuarios={usuarios} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              </main>
            </div>

            {/* Modales para crear notas y hábitos */}
            {mostrarModalNota && (
              <CrearNotaModal
                onClose={() => setMostrarModalNota(false)}
                onSuccess={() => {
                  refrescarNotas();
                  setMostrarModalNota(false);
                }}
              />
            )}

            {mostrarModalHabito && (
              <CrearHabitoModal
                onClose={() => setMostrarModalHabito(false)}
                onSuccess={(habito) => {
                  setMostrarModalHabito(false);
                }}
              />
            )}

            {/* Modal para editar tarea semanal */}
            {editandoTareaSemanal && (
              <ModalEditarTareaSemana
                diasSemana={diasSemana}
                setEditandoTareaSemanal={setEditandoTareaSemanal}
                editandoTareaSemanal={editandoTareaSemanal}
                guardarTareaEditadaSemanal={guardarTareaEditadaSemanal}
              />
            )}

            {/* Modal para editar tarea */}
            {editandoTarea && (
              <EditarTareaModal
                key={editandoTarea.id} // Añadir una key única para forzar la recreación del componente
                tarea={editandoTarea}
                onClose={() => setEditandoTarea(null)}
                onSave={guardarTareaEditada}
              />
            )}

            {notaEditando && (
              <EditarNotaModal
                nota={notaEditando}
                onClose={() => setNotaEditando(null)}
                onSuccess={(notaActualizada) => {
                  refrescarNotas();
                  setNotaEditando(null);
                }}
              />
            )}

            {habitoEditando && (
              <EditarTareaModal
                tarea={{ ...habitoEditando, tipo: "habito" }}
                onClose={() => setHabitoEditando(null)}
                onSave={async (habitoActualizado) => {
                  await actualizarObjetivo(habitoActualizado.id, habitoActualizado);
                  setHabitoEditando(null);
                }}
              />
            )}

            {/* Botón flotante para crear tareas */}
            <div className="fixed bottom-6 right-6 z-40">
              <div className="relative group">
                <button
                  onClick={() => setMostrarMenuCreacion(!mostrarMenuCreacion)}
                  className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg transition-all duration-300"
                >
                  {mostrarMenuCreacion ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Plus className="h-6 w-6" />
                  )}
                </button>

                {/* Menú desplegable */}
                {mostrarMenuCreacion && (
                  <div className="absolute bottom-16 right-0 backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-4 shadow-lg rounded-lg shadow-lg overflow-hidden border border-white/10 w-48">
                    <button
                      onClick={() => {
                        setMostrarModalHabito(true);
                        setMostrarMenuCreacion(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-white/10 flex items-center gap-2"
                    >
                      <Sparkles className="h-4 w-4 text-emerald-400" />
                      <span>Nuevo Hábito</span>
                    </button>
                    <button
                      onClick={() => {
                        setMostrarModalNota(true);
                        setMostrarMenuCreacion(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-white/10 flex items-center gap-2"
                    >
                      <PenTool className="h-4 w-4 text-emerald-400" />
                      <span>Nueva Nota</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            {mostrarModalTemporizador && (
              <Temporizador
                tareaId={tareaTemporizador}
                setMostrarModalTemporizador={setMostrarModalTemporizador}
              />
            )}
          </div>
        )}
    </div>
  );
}


import { ProviderStateX } from "@/Context/ProviderStateX";
import { ProviderDias } from "@/Context/ProviderDias";
import { ProviderHeaderHotizontal } from "@/Context/ProviderHeaderHotizontal";
import { ProviderVolverCargarTareasFiltradas } from "@/Context/ProviderVolverACargarTareasFiltradas.js";
import { ActividadProvider, useActividad } from "@/Context/ActividadContext";
import ModernFlowChart from "./Secciones/Mapa/page.js";
import { ReactFlowProvider } from "reactflow";


export default function AppWithProviders(props) {
  return (
    <ProviderHeaderHotizontal>
      <ProviderDias>
        <ProviderVolverCargarTareasFiltradas>
          <ProviderStateX>
            <NotasProvider>
              <ObjetivosProvider>
                <SemanasProvider>
                  <HistorialProvider>
                    <ActividadProvider>
                      <CanalProvider>
                         <App {...props} />
                      </CanalProvider>
                    </ActividadProvider>
                  </HistorialProvider>
                </SemanasProvider>
              </ObjetivosProvider>
            </NotasProvider>
          </ProviderStateX>
        </ProviderVolverCargarTareasFiltradas>
      </ProviderDias>
    </ProviderHeaderHotizontal>
  );
}
