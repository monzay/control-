"use client"

import { useState, useEffect, useContext, useMemo } from "react"
import { contextoStateX } from "@/Context/ProviderStateX"
import Chat from "@/components/visualization/Chat"
import Encabezado from "@/components/layout/Encabezado"
import MenuLateral from "@/components/layout/MenuLateral"
import TopUsuarios from "@/components/visualization/TopUsuarios"
import TaskCard from "@/components/ui/TaskCard"
import VistaSemanal from "@/components/visualization/VistaSemanal"
import VisualizacionDias from "@/components/visualization/VisualizacionDias"
import MensajeTodoLosDias from "@/components/visualization/MensajeTodoLosDias"
import MensajeBienvenida from "@/components/visualization/MensajeBienvenida"
import MensajeRacha from "@/components/visualization/MensajeRacha"
import SeccionObjetivo from "@/components/visualization/Objetivo"
import CrearNotaModal from "@/components/modals/CrearNotaModal"
import EditarTareaModal from "@/components/modals/EditarTareaModal"
import ModalEditarTareaSemana from "@/components/modals/ModalEditarTareaSemana"
import Temporizador from "@/components/modals/Temporizador"
import LoginForm from "@/components/forms/LoginForm"
import RegisterForm from "@/components/forms/RegisterForm"
import FloatingActionMenu from "@/components/ui/FloatingActionMenu"
import funcionesGlobales from "@/function/funcionesGlobales"
import { useTareas } from "@/hooks/useTareas"
import { useRacha } from "@/hooks/useRacha"
import { useTareasSemana } from "@/hooks/useTareasSemana"
import { useNotificacionesEmail } from "@/hooks/useNotificacionesEmail"

const DIAS_SEMANA = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
const DIAS_TOTALES = 365

function App() {
  const {
    tareas,
    tareasSemana, setTareasSemana,
    fechasImportantes, setFechasImportantes,
    usuarios,
  } = useContext(contextoStateX)

  const [isClient, setIsClient] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [mostrarBienvenida, setMostrarBienvenida] = useState(false)
  const [mostrarMensajeDiario, setMostrarMensajeDiario] = useState(false)
  const [tieneObjetivo, setTieneObjetivo] = useState(false)
  const [objetivo, setObjetivo] = useState("")
  const [mostrarFormularioObjetivo, setMostrarFormularioObjetivo] = useState(false)
  const [horaActual, setHoraActual] = useState(new Date())
  const [diaActualDelAnio, setDiaActualDelAnio] = useState(0)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [vistaActiva, setVistaActiva] = useState("semana")
  const [filtroActivo, setFiltroActivo] = useState(null)
  const [mostrarTareas, setMostrarTareas] = useState(true)
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null)
  const [diaSemanaSeleccionado, setDiaSemanaSeleccionado] = useState(funcionesGlobales.obtenerNombreDelDia())
  const [mostrarAnimacionCompletado, setMostrarAnimacionCompletado] = useState(false)
  const [filtroNotas, setFiltroNotas] = useState("todas")
  const [modoFocus, setModoFocus] = useState(false)
  const [mostrarLogin, setMostrarLogin] = useState(false)
  const [mostrarRegistro, setMostrarRegistro] = useState(false)
  const [mostrarModalNota, setMostrarModalNota] = useState(false)
  const [tareaId, setTareaId] = useState(null)
  const [mostrarModalTemporizador, setMostrarModalTemporizador] = useState(false)
  const [tareaTemporizador, setTareaTemporizador] = useState(null)

  const { rachaActual, mostrarMensajeRacha, setMostrarMensajeRacha, mensajeRachaHito, onRachaActualizada } = useRacha()

  const emailUsuario = typeof window !== "undefined" ? localStorage.getItem("email-usuario") || "" : ""
  useNotificacionesEmail({ tareas, email: emailUsuario })
  const { editandoTarea, setEditandoTarea, agregarTarea, eliminarTarea, guardarTareaEditada, iniciarEditarTarea, alternarTarea } = useTareas({ setMostrarAnimacionCompletado, onRachaActualizada })
  const {
    editandoTareaSemanal, setEditandoTareaSemanal,
    agregandoTareaSemanal, setAgregandoTareaSemanal,
    numeroSemanaActual,
    tareasSemanaFiltradas,
    eliminarTareaSemanal,
    guardarTareaEditadaSemanal,
    eliminarAlReiniciar,
    setEliminarAlReiniciar,
  } = useTareasSemana()

  // Inicialización del cliente: primera visita y objetivo
  useEffect(() => {
    setIsClient(true)
    const usuarioHaVisitado = localStorage.getItem("usuarioHaVisitado")
    const objetivoGuardado = localStorage.getItem("objetivo")
    const ultimoMensajeDiario = localStorage.getItem("ultimoMensajeDiario")
    const fechaActual = new Date().toDateString()

    if (!usuarioHaVisitado) {
      setMostrarBienvenida(true)
      localStorage.setItem("usuarioHaVisitado", "true")
      localStorage.setItem("fechaPartidaUsuario", funcionesGlobales.obtenerDiaHoy())
    }

    if (objetivoGuardado) {
      setTieneObjetivo(true)
      setObjetivo(objetivoGuardado)
      if (!ultimoMensajeDiario || ultimoMensajeDiario !== fechaActual) {
        setMostrarMensajeDiario(true)
        localStorage.setItem("ultimoMensajeDiario", fechaActual)
      }
    }
    setCargando(false)
  }, [])

  // Reloj
  useEffect(() => {
    const intervalo = setInterval(() => setHoraActual(new Date()), 1000)
    return () => clearInterval(intervalo)
  }, [])

  // Día del año
  useEffect(() => {
    const dia = funcionesGlobales.ObtenerDiaNumeroDelAño()
    setDiaActualDelAnio(
      dia >= 1 ? dia : Math.max(1, Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 1)) / 86400000) + 1)
    )
  }, [])

  // Sincronizar fechas de finalización de tareas con fechasImportantes
  useEffect(() => {
    const fechasNuevas = tareas
      .filter(t => t?.fechaFin && t.tipo && !fechasImportantes.some(f => f.idTarea === t.id && f.fecha === t.fechaFin))
      .map(t => ({
        id: `tarea-fin-${t.id}`,
        fecha: t.fechaFin,
        titulo: `Fin de ${t.tipo === "habito" ? "hábito" : "nota"}: ${t.titulo}`,
        tipo: t.tipo === "habito" ? "habito-fin" : "nota",
        color: "bg-emerald-500",
        idTarea: t.id,
      }))
    if (fechasNuevas.length > 0) setFechasImportantes(prev => [...prev, ...fechasNuevas])
  }, [tareas, fechasImportantes, setFechasImportantes])

  // Guardar porcentaje de actividad del día seleccionado
  useEffect(() => {
    const tareasDelDia = tareasSemana.filter(t => t?.dia === diaSemanaSeleccionado)
    const completadas = tareasDelDia.filter(t => t.completada).length
    const porcentaje = tareasDelDia.length > 0 ? Math.floor((completadas / tareasDelDia.length) * 100) : 0
    const fecha = funcionesGlobales.obtenerDiaHoy()
    const datos = JSON.parse(localStorage.getItem("datos-dias-porcentajes") || "[]")
    const idx = datos.findIndex(d => d.fecha === fecha)
    if (idx !== -1) datos[idx].porcentaje = porcentaje
    else datos.push({ fecha, porcentaje })
    localStorage.setItem("datos-dias-porcentajes", JSON.stringify(datos))
  }, [tareasSemana, diaSemanaSeleccionado])

  const guardarObjetivo = (nuevoObjetivo) => {
    if (!nuevoObjetivo.trim()) return
    localStorage.setItem("objetivo", nuevoObjetivo)
    setObjetivo(nuevoObjetivo)
    setTieneObjetivo(true)
    setMostrarFormularioObjetivo(false)
    setMostrarMensajeDiario(true)
    localStorage.setItem("ultimoMensajeDiario", new Date().toDateString())
  }

  const iniciarTemporizadorTarea = (tarea) => {
    setTareaTemporizador(tarea)
    setMostrarModalTemporizador(true)
  }

  const tareasFiltradas = useMemo(() => {
    if (!Array.isArray(tareas)) return []
    const validas = tareas.filter(t => t && typeof t === "object" && t.id && t.titulo && t.tipo)
    switch (vistaActiva) {
      case "notas": {
        const notas = validas.filter(t => t.tipo === "nota")
        const ordenarPorFecha = (arr) =>
          [...arr].sort((a, b) => {
            if (!a.fechaFin && !b.fechaFin) return 0
            if (!a.fechaFin) return 1
            if (!b.fechaFin) return -1
            return new Date(a.fechaFin) - new Date(b.fechaFin)
          })
        if (filtroNotas === "con-fecha") return ordenarPorFecha(notas.filter(t => t.fechaFin))
        if (filtroNotas === "sin-fecha") return notas.filter(t => !t.fechaFin)
        return ordenarPorFecha(notas)
      }
      case "calendario":
        return fechaSeleccionada
          ? validas.filter(t =>
              t.fechaVencimiento === fechaSeleccionada ||
              t.fechaFin === fechaSeleccionada ||
              t.historial?.some(h => h.fecha === fechaSeleccionada)
            )
          : []
      default:
        return validas
    }
  }, [tareas, vistaActiva, fechaSeleccionada, filtroNotas])

  if (!isClient || cargando) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-4" />
          <p className="text-white/60">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {mostrarBienvenida && (
        <MensajeBienvenida setMostrarMensajeBienvenida={() => setMostrarBienvenida(false)} />
      )}
      {mostrarFormularioObjetivo && (
        <SeccionObjetivo guardarObjetivo={guardarObjetivo} />
      )}
      {tieneObjetivo && mostrarMensajeDiario && (
        <MensajeTodoLosDias setMostrarMensaje={setMostrarMensajeDiario} objetivo={objetivo} />
      )}
      {mostrarMensajeRacha && mensajeRachaHito && (
        <MensajeRacha setMostrarMensaje={setMostrarMensajeRacha} mensajeHito={mensajeRachaHito} />
      )}

      {!mostrarBienvenida && !mostrarFormularioObjetivo && !mostrarMensajeDiario && !mostrarMensajeRacha && (
        <div className="p-8">
          <Encabezado
            horaActual={horaActual}
            diaActualDelAnio={diaActualDelAnio}
            diasTotales={DIAS_TOTALES}
            menuAbierto={menuAbierto}
            setMenuAbierto={setMenuAbierto}
            mostrarTareas={mostrarTareas}
            setMostrarTareas={setMostrarTareas}
            setMostrarLogin={setMostrarLogin}
            setMostrarRegistro={setMostrarRegistro}
            rachaActual={rachaActual}
            modoFocus={modoFocus}
            setModoFocus={setModoFocus}
          />

          <div className="flex flex-1 relative">
            {modoFocus ? (
              <div className="hidden md:block w-60 flex-shrink-0" />
            ) : (
              <MenuLateral
                menuAbierto={menuAbierto}
                vistaActiva={vistaActiva}
                setVistaActiva={setVistaActiva}
                setMenuAbierto={setMenuAbierto}
                filtroActivo={filtroActivo}
                setFiltroActivo={setFiltroActivo}
              />
            )}

            <main className="flex-1 p-4 md:p-6 pt-2 relative z-10 overflow-x-hidden">
              {mostrarTareas && (
                <div>
                  {vistaActiva === "semana" ? (
                    <VistaSemanal
                      setTareaId={setTareaId}
                      diasSemana={DIAS_SEMANA}
                      diaSemanaSeleccionado={diaSemanaSeleccionado}
                      setDiaSemanaSeleccionado={setDiaSemanaSeleccionado}
                      tareasSemanaFiltradas={tareasSemanaFiltradas}
                      setEditandoTareaSemanal={setEditandoTareaSemanal}
                      eliminarTareaSemanal={eliminarTareaSemanal}
                      tareasSemana={tareasSemana}
                      setTareasSemana={setTareasSemana}
                      numeroSemanaActual={numeroSemanaActual}
                      iniciarTemporizadorTarea={iniciarTemporizadorTarea}
                      diasTotales={DIAS_TOTALES}
                      diaActualDelAnio={diaActualDelAnio}
                      agregandoTareaSemanal={agregandoTareaSemanal}
                      setAgregandoTareaSemanal={setAgregandoTareaSemanal}
                      usuarios={usuarios}
                      horaActual={horaActual}
                      fechasImportantes={fechasImportantes}
                      setVistaActiva={setVistaActiva}
                      filtroActivo={filtroActivo}
                      tareas={tareas}
                      eliminarTarea={eliminarTarea}
                      iniciarEditarTarea={iniciarEditarTarea}
                      alternarTarea={alternarTarea}
                      eliminarAlReiniciar={eliminarAlReiniciar}
                      setEliminarAlReiniciar={setEliminarAlReiniciar}
                      modoFocus={modoFocus}
                    />
                  ) : vistaActiva === "Objetivo" ? (
                    <Chat />
                  ) : (
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 relative">
                        <VisualizacionDias
                          diasTotales={DIAS_TOTALES}
                          diaActualDelAnio={diaActualDelAnio}
                          tareas={tareas}
                          fechasImportantes={fechasImportantes}
                          tareasSemana={tareasSemana}
                          diasSemana={DIAS_SEMANA}
                          setDiaSemanaSeleccionado={setDiaSemanaSeleccionado}
                          setVistaActiva={setVistaActiva}
                        />
                        {vistaActiva === "notas" && (
                          <div className="flex gap-2 mb-4">
                            {[
                              { valor: "todas",     label: "Todas" },
                              { valor: "con-fecha", label: "Con fecha" },
                              { valor: "sin-fecha", label: "Sin fecha" },
                            ].map(({ valor, label }) => (
                              <button
                                key={valor}
                                onClick={() => setFiltroNotas(valor)}
                                className={`px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 ${
                                  filtroNotas === valor
                                    ? "bg-emerald-600 text-white"
                                    : "bg-white/5 hover:bg-white/10 text-white/60"
                                }`}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {tareasFiltradas.map(tarea => (
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
                      {modoFocus ? (
                        <div className="hidden md:block w-64 flex-shrink-0" />
                      ) : (
                        <div className="w-full md:w-64 flex-shrink-0">
                          <div className="sticky top-20">
                            <TopUsuarios usuarios={usuarios} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>

          {mostrarModalNota && (
            <CrearNotaModal
              onClose={() => setMostrarModalNota(false)}
              onSuccess={(nota) => { agregarTarea(nota); setMostrarModalNota(false) }}
            />
          )}
          {editandoTareaSemanal && (
            <ModalEditarTareaSemana
              diasSemana={DIAS_SEMANA}
              setEditandoTareaSemanal={setEditandoTareaSemanal}
              editandoTareaSemanal={editandoTareaSemanal}
              guardarTareaEditadaSemanal={guardarTareaEditadaSemanal}
            />
          )}
          {editandoTarea && (
            <EditarTareaModal
              key={editandoTarea.id}
              tarea={editandoTarea}
              onClose={() => setEditandoTarea(null)}
              onSave={guardarTareaEditada}
            />
          )}
          {mostrarLogin && (
            <LoginForm onClose={() => setMostrarLogin(false)} onSuccess={() => {}} />
          )}
          {mostrarRegistro && (
            <RegisterForm onClose={() => setMostrarRegistro(false)} onSuccess={() => {}} />
          )}
          {mostrarModalTemporizador && (
            <Temporizador
              tareaId={tareaTemporizador}
              setMostrarModalTemporizador={setMostrarModalTemporizador}
            />
          )}
          <FloatingActionMenu onNuevaNotaClick={() => setMostrarModalNota(true)} />
        </div>
      )}
    </div>
  )
}

export default App
