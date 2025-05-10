import Chat from "@/components/visualization/Chat";
import { useState, useEffect, useContext } from "react";
import { AnimatePresence } from "framer-motion";
import Encabezado from "@/components/layout/Encabezado.js";
import { X, Plus, Sparkles, PenTool } from "lucide-react";
import MenuLateral from "@/components/layout/MenuLateral.js";
import TopUsuarios from "@/components/visualization/TopUsuarios.js";
import FechaModulo from "../function/FechaModulo.js";
import UsuarioModulo from "../function/UsuarioModulo.js";
import LoginForm from "@/components/forms/LoginForm.js";
import RegisterForm from "@/components/forms/RegisterForm.js";
import CrearHabitoModal from "@/components/modals/CrearHabitoModal.js";
import CrearNotaModal from "@/components/modals/CrearNotaModal";
import AnimacionModulo from "../function/Confeti.js";
import TaskCard from "../components/ui/TaskCard";
import VistaSemanal from "@/components/visualization/VistaSemanal";
import Temporizador from "@/components/modals/Temporizador.js";
import VisualizacionDias from "@/components/visualization/VisualizacionDias.js";
import MensajeTodoLosDias from "@/components/visualization/MensajeTodoLosDias.js";
import MensajeBienvenida from "@/components/visualization/MensajeBienvenida.js";
import funcionesGlobales from "../function/funcionesGlobales.js";
import { contextoStateX } from "@/Context/ProviderStateX.js";
import ModalEditarTareaSemana from "@/components/modals/ModalEditarTareaSemana.js";
import { ContextVolverACargarTareasFiltradas } from "@/Context/ProviderVolverACargarTareasFiltradas.js";
import SeccionObjetivo from "@/components/visualization/Objetivo.js";
import EditarTareaModal from "@/components/modals/EditarTareaModal.js";

function App() {


  const [mostrarBienvenida, setMostrarBienvenida] = useState(false);
  const [mostrarMensajeDiario, setMostrarMensajeDiario] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [tieneObjetivo, setTieneObjetivo] = useState(false);
  const [objetivo, setObjetivo] = useState("");
  const [mostrarFormularioObjetivo, setMostrarFormularioObjetivo] =
    useState(false);

  useEffect(() => {
    // Verificar si es la primera visita del usuario
    const usuarioHaVisitado = localStorage.getItem("usuarioHaVisitado");
    // Verificar si el usuario tiene un objetivo guardado
    const objetivoGuardado = localStorage.getItem("objetivo");

    // Verificar si ya se mostró el mensaje diario hoy
    const ultimoMensajeDiario = localStorage.getItem("ultimoMensajeDiario");
    const fechaActual = new Date().toDateString();

    if (!usuarioHaVisitado) {
      // Primera visita: mostrar mensaje de bienvenida
      setMostrarBienvenida(true);
      // Guardar que el usuario ya ha visitado la web
      localStorage.setItem("usuarioHaVisitado", "true");
    } else if (objetivoGuardado) {
      // El usuario tiene un objetivo guardado
      setTieneObjetivo(true);
      setObjetivo(objetivoGuardado);

      // Mostrar mensaje diario si es la primera visita del día
      if (!ultimoMensajeDiario || ultimoMensajeDiario !== fechaActual) {
        setMostrarMensajeDiario(true);
        // Guardar la fecha actual como último mensaje diario mostrado
        localStorage.setItem("ultimoMensajeDiario", fechaActual);
      }
    }

    setCargando(false);
  }, []);

  // Función para manejar cuando se cierra el mensaje de bienvenida
  const cerrarBienvenida = () => {
    setMostrarBienvenida(false);

    // Si no hay objetivo, mostrar formulario para crear uno
    if (!tieneObjetivo) {
      setMostrarFormularioObjetivo(true);
    }
  };

  // Función para guardar un nuevo objetivo
  const guardarObjetivo = (nuevoObjetivo) => {
    if (nuevoObjetivo.trim()) {
      localStorage.setItem("objetivo", nuevoObjetivo);
      setObjetivo(nuevoObjetivo);
      setTieneObjetivo(true);
      setMostrarFormularioObjetivo(false);

      // Mostrar mensaje diario después de crear el objetivo
      setMostrarMensajeDiario(true);
      localStorage.setItem("ultimoMensajeDiario", new Date().toDateString());
    }
  };

  const {
    tareasSemana,
    setTareasSemana,
    fechasImportantes,
    setFechasImportantes,
    usuarios,
    setUsuarios,
    tareas,
    setTareas,
  } = useContext(contextoStateX);
  const diasTotales = 365;
  const diasSemana = [
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
    "domingo",
  ];
  const [horaActual, setHoraActual] = useState(new Date());
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
  const [editandoTarea, setEditandoTarea] = useState(null);
  const [diaActualDelAnio, setDiaActualDelAnio] = useState(0);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [vistaActiva, setVistaActiva] = useState("semana"); // Cambiado a "semana" como vista principal
  const [mostrarTareas, setMostrarTareas] = useState(true);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [diaSemanaSeleccionado, setDiaSemanaSeleccionado] = useState(
    funcionesGlobales.obtenerNombreDelDia()
  );
  const [agregandoTareaSemanal, setAgregandoTareaSemanal] = useState(false);
  const [editandoTareaSemanal, setEditandoTareaSemanal] = useState(null);
  const [mostrarAnimacionCompletado, setMostrarAnimacionCompletado] =
    useState(false);
  const [numeroSemanaActual, setNumeroSemanaActual] = useState(
    FechaModulo.obtenerNumeroSemana()
  );
  const [tareaTemporizador, setTareaTemporizador] = useState(null);
  const [mostrarModalTemporizador, setMostrarModalTemporizador] =
    useState(false);
  const [usuarioActual, setUsuarioActual] = useState(usuarios[0]); // Usuario actual (primer usuario por defecto)
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [mostrarMenuCreacion, setMostrarMenuCreacion] = useState(false);
  const [chats, setChats] = useState([]); // Inicializar chats como array vacío
  const [mostrarModalNota, setMostrarModalNota] = useState(false);
  const [mostrarModalHabito, setMostrarModalHabito] = useState(false);
  const [tareaId, setTareaId] = useState(null);

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
    const verificarNuevaSemana = () => {
      const semanaActual = FechaModulo.obtenerNumeroSemana();

      // Si es un nuevo lunes, reiniciar las tareas completadas
      if (FechaModulo.esNuevaSemana()) {
        setTareasSemana((prev) =>
          prev.map((tarea) => {
            if (tarea.ultimaSemanReinicio !== semanaActual) {
              return {
                ...tarea,
                completada: false,
                ultimaSemanReinicio: semanaActual,
              };
            }
            return tarea;
          })
        );

        setNumeroSemanaActual(semanaActual);
      }
    };

    // Verificar al cargar y configurar un intervalo diario
    verificarNuevaSemana();
    const verificacionDiaria = setInterval(
      verificarNuevaSemana,
      1000 * 60 * 60 * 24
    ); // Verificar cada 24 horas

    return () => clearInterval(verificacionDiaria);
  }, []);

  // Sincronizar fechas de finalización con fechas importantes
  useEffect(() => {
    // Crear fechas importantes para las fechas de finalización de tareas
    const fechasFinTareas = tareas
      .filter(
        (tarea) =>
          tarea.fechaFin &&
          !fechasImportantes.some(
            (fecha) =>
              fecha.idTarea === tarea.id && fecha.fecha === tarea.fechaFin
          )
      )
      .map((tarea) => ({
        id: `tarea-fin-${tarea.id}`,
        fecha: tarea.fechaFin,
        titulo: `Fin de ${tarea.tipo === "habito" ? "hábito" : "nota"}: ${
          tarea.titulo
        }`,
        tipo: tarea.tipo === "habito" ? "habito-fin" : "nota",
        color: "bg-emerald-500",
        idTarea: tarea.id,
      }));

    if (fechasFinTareas.length > 0) {
      setFechasImportantes((prev) => [...prev, ...fechasFinTareas]);
    }
  }, [tareas]);

  //---------------------------------------------------------//
  // Añadir una nueva tarea
  const agregarTarea = (nuevaTarea) => {
    setTareas([...tareas, nuevaTarea]);

    // Si tiene fecha de finalización, crear una fecha importante
    if (nuevaTarea.fechaFin) {
      const nuevaFecha = {
        id: `tarea-fin-${nuevaTarea.id}`,
        fecha: nuevaTarea.fechaFin,
        titulo: `Fin de ${nuevaTarea.tipo === "habito" ? "hábito" : "nota"}: ${
          nuevaTarea.titulo
        }`,
        tipo: nuevaTarea.tipo === "habito" ? "habito-fin" : "nota",
        color: "bg-emerald-500",
        idTarea: nuevaTarea.id,
      };
      setFechasImportantes([...fechasImportantes, nuevaFecha]);
    }
  };

  // Eliminar una tarea
  const eliminarTarea = (id) => {
    setTareas(tareas.filter((tarea) => tarea.id !== id));
    // Eliminar también las fechas importantes asociadas
    setFechasImportantes(
      fechasImportantes.filter((fecha) => fecha.idTarea !== id)
    );
    // Eliminar tareas semanales asociadas
    setTareasSemana(tareasSemana.filter((tarea) => tarea.idTarea !== id));

    if (tareaSeleccionada?.id === id) {
      setTareaSeleccionada(null);
    }
    if (editandoTarea?.id === id) {
      setEditandoTarea(null);
    }
  };
  // Guardar tarea editada
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

    // Actualizar tareas semanales relacionadas
    setTareasSemana((prev) =>
      prev.map((tareaSemanal) =>
        tareaSemanal.idTarea === tareaActualizada.id
          ? { ...tareaSemanal, titulo: tareaActualizada.titulo }
          : tareaSemanal
      )
    );

    setEditandoTarea(null);
  };

  //---------------------------------------------------------//


  useEffect(()=>{
    function actualizarActividad(dia) {
      const tareas = tareasSemana;
      const tareasDelDia = tareas.filter((tarea) => tarea?.dia === dia);
      const completadas = tareasDelDia.filter(
        (tarea) => tarea.completada === true
      ).length;


      const porcentaje =
        tareasDelDia.length > 0
          ? Math.floor((completadas / tareasDelDia.length) * 100)
          : 0;

      const fechaHoy = new Date().toISOString().split("T")[0];
      const datosGuardados =
        JSON.parse(localStorage.getItem("datos-dias-porcentajes")) || [];

      const indiceExistente = datosGuardados.findIndex(
        (dato) => dato.fecha === fechaHoy
      );

      if (indiceExistente !== -1) {
        datosGuardados[indiceExistente].porcentaje = porcentaje;
      } else {
        datosGuardados.push({ fecha: fechaHoy, porcentaje });
      }

      localStorage.setItem(
        "datos-dias-porcentajes",
        JSON.stringify(datosGuardados)
      );
    }
    actualizarActividad(diaSemanaSeleccionado)
  },[tareasSemana])

  // Iniciar edición de tarea
  const iniciarEditarTarea = (tarea) => {
    setEditandoTarea({ ...tarea });
  };

  // Editar tarea semanal
  const guardarTareaEditadaSemanal = () => {
    if (!editandoTareaSemanal) return;

    setTareasSemana((prev) =>
      prev.map((tarea) =>
        tarea.id === editandoTareaSemanal.id ? editandoTareaSemanal : tarea
      )
    );

    setEditandoTareaSemanal(null);
  };

  // Eliminar tarea semanal
  const eliminarTareaSemanal = (id) => {
    setTareasSemana((prev) => prev.filter((tarea) => tarea.id !== id));
    if (editandoTareaSemanal?.id === id) {
      setEditandoTareaSemanal(null);
    }
  };

  // Iniciar temporizador para una tarea
  const iniciarTemporizadorTarea = (tarea) => {
    setTareaTemporizador(tarea);
    setMostrarModalTemporizador(true);
  };

  // Alternar completado de tarea
  const alternarTarea = (id) => {
    const tareaAlternar = tareas.find((tarea) => tarea.id === id);
    const estabaCompletada = tareaAlternar?.completada;

    // Si la tarea se está marcando como completada, mostrar animación
    if (!estabaCompletada) {
      AnimacionModulo.lanzarConfeti();
      setMostrarAnimacionCompletado(true);
      setTimeout(() => setMostrarAnimacionCompletado(false), 1000);

      // Actualizar reputación del usuario
      if (usuarioActual) {
        UsuarioModulo.actualizarReputacionUsuario(
          usuarioActual.id,
          true,
          usuarios,
          setUsuarios
        );
      }
    } else {
      // No permitir desmarcar tareas completadas
      return;
    }

    setTareas(
      tareas.map((tarea) => {
        if (tarea.id === id) {
          const hoy = new Date().toISOString().split("T")[0];

          if (tarea.tipo === "nota") {
            return { ...tarea, completada: true };
          }

          const completadaHoy = tarea.historial?.some(
            (h) => h.fecha === hoy && h.completada
          );

          // Si ya se completó hoy, no hacer nada (no permitir desmarcar)
          if (completadaHoy) {
            return tarea;
          }

          // La estamos completando por primera vez hoy
          const historialActualizado = [
            { fecha: hoy, completada: true },
            ...(tarea.historial?.filter((h) => h.fecha !== hoy) || []),
          ];

          // Verificar si ayer se completó para mantener la racha
          const ayer = new Date();
          ayer.setDate(ayer.getDate() - 1);
          const ayerStr = ayer.toISOString().split("T")[0];
          const ayerCompletada = tarea.historial?.some(
            (h) => h.fecha === ayerStr && h.completada
          );

          return {
            ...tarea,
            completada: true,
            racha: ayerCompletada ? (tarea.racha || 0) + 1 : 1,
            historial: historialActualizado,
          };
        }
        return tarea;
      })
    );
  };
  // Obtener tareas filtradas según la vista activa
  const obtenerTareasFiltradas = () => {
    switch (vistaActiva) {
      case "habitos":
        return tareas.filter((tarea) => tarea.tipo === "habito");
      case "notas":
        return tareas.filter((tarea) => tarea.tipo === "nota");
      case "calendario":
        if (fechaSeleccionada) {
          return tareas.filter((tarea) => {
            if (tarea.fechaVencimiento === fechaSeleccionada) return true;
            if (tarea.fechaFin === fechaSeleccionada) return true;
            if (tarea.historial?.some((h) => h.fecha === fechaSeleccionada))
              return true;
            return false;
          });
        }
        return [];
      default:
        return tareas;
    }
  };

  // Obtener tareas semanales filtradas según el día seleccionado
  const obtenerTareasSemanaFiltradas = () => {
    return tareasSemana
      .filter((tarea) => tarea.dia === diaSemanaSeleccionado)
      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
  };

  // Calcular el porcentaje de tiempo transcurrido en el año
  const obtenerProgresoAnual = () => {
    return (diaActualDelAnio / diasTotales) * 100;
  };

  const tareasFiltradas = obtenerTareasFiltradas();

  const [tareasSemanaFiltradas, setTareasSemanaFiltradas] = useState([]);

  const { volverCargarTareasFiltradas } = useContext(
    ContextVolverACargarTareasFiltradas
  );

  // nucleo para volver  a mostrar las tareas filtradas de cada dia
  useEffect(() => {
    const tareas = obtenerTareasSemanaFiltradas();
    setTareasSemanaFiltradas(tareas);
  }, [volverCargarTareasFiltradas]);

  // Modificar el return para incluir los botones de creación y los modales
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {mostrarBienvenida && (
        <MensajeBienvenida setMostrarMensajeBienvenida={cerrarBienvenida} />
      )}
      {mostrarFormularioObjetivo && (
        <SeccionObjetivo  guardarObjetivo={guardarObjetivo} />
      )}
      {tieneObjetivo && mostrarMensajeDiario && (
        <MensajeTodoLosDias
          setMostrarMensaje={setMostrarMensajeDiario}
          objetivo={objetivo}
        />
      )}


      {/* Contenido principal (solo visible si no se muestra ningún mensaje) */}
      {!mostrarBienvenida &&
        !mostrarFormularioObjetivo &&
        !mostrarMensajeDiario && (
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
              setMostrarLogin={setMostrarLogin}
              setMostrarRegistro={setMostrarRegistro}
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
                      ) : vistaActiva === "Objetivo" ? (
                        <Chat/>
                      ) : (
                        <div className="flex flex-col md:flex-row gap-4">
                          {/* Contenedor principal  cde tareas */}
                          <div className="flex-1 relative">
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

                            {/* Cuadrícula de tareas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {tareasFiltradas.map((tarea) => (
                                <TaskCard
                                  key={tarea.id}
                                  tarea={tarea}
                                  onEdit={iniciarEditarTarea}
                                  onDelete={eliminarTarea}
                                  onToggleComplete={alternarTarea}
                                />
                              ))}
                            </div>
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
                onSuccess={(nota) => {
                  agregarTarea(nota);
                  setMostrarModalNota(false);
                }}
              />
            )}

            {mostrarModalHabito && (
              <CrearHabitoModal
                onClose={() => setMostrarModalHabito(false)}
                onSuccess={(habito) => {
                  agregarTarea(habito);
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

            {/* Formularios de login y registro */}
            {mostrarLogin && (
              <LoginForm
                onClose={() => setMostrarLogin(false)}
                onSuccess={() => {}}
              />
            )}
            {mostrarRegistro && (
              <RegisterForm
                onClose={() => setMostrarRegistro(false)}
                onSuccess={() => {}}
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




export default App;
