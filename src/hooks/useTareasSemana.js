"use client"
import { useState, useEffect, useCallback, useContext } from "react"
import { contextoStateX } from "@/Context/ProviderStateX"
import { ContextVolverACargarTareasFiltradas } from "@/Context/ProviderVolverACargarTareasFiltradas"
import FechaModulo from "@/function/FechaModulo"

const ORDEN_DIAS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]

export function useTareasSemana() {
  const { tareasSemana, setTareasSemana } = useContext(contextoStateX)
  const { volverCargarTareasFiltradas } = useContext(ContextVolverACargarTareasFiltradas)

  const [editandoTareaSemanal, setEditandoTareaSemanal] = useState(null)
  const [agregandoTareaSemanal, setAgregandoTareaSemanal] = useState(false)
  const [numeroSemanaActual, setNumeroSemanaActual] = useState(FechaModulo.obtenerNumeroSemana())
  const [tareasSemanaFiltradas, setTareasSemanaFiltradas] = useState([])
  const [eliminarAlReiniciar, setEliminarAlReiniciarState] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("semana-eliminar-al-reiniciar") === "true"
  )

  const setEliminarAlReiniciar = (valor) => {
    setEliminarAlReiniciarState(valor)
    localStorage.setItem("semana-eliminar-al-reiniciar", valor.toString())
  }

  // Verificar inicio de nueva semana y reiniciar completadas
  useEffect(() => {
    const verificar = () => {
      try {
        if (FechaModulo.esInicioNuevaSemana()) {
          const fechaInicio = FechaModulo.obtenerFechaInicioSemana()
          const semana = FechaModulo.obtenerNumeroSemana()
          const debeEliminar = localStorage.getItem("semana-eliminar-al-reiniciar") === "true"
          if (debeEliminar) {
            setTareasSemana([])
          } else {
            setTareasSemana(prev =>
              Array.isArray(prev)
                ? prev.map(t => t && typeof t === "object" ? { ...t, completada: false } : t)
                : prev
            )
          }
          localStorage.setItem("ultima-semana-reinicio-fecha", fechaInicio)
          localStorage.setItem("ultima-semana-reinicio", semana.toString())
          setNumeroSemanaActual(semana)
        } else {
          setNumeroSemanaActual(FechaModulo.obtenerNumeroSemana())
        }
      } catch (e) {
        console.error("Error al verificar nueva semana:", e)
      }
    }
    verificar()
    const intervalo = setInterval(verificar, 1000 * 60 * 60)
    return () => clearInterval(intervalo)
  }, [setTareasSemana])

  const obtenerFiltradas = useCallback(() => {
    if (!Array.isArray(tareasSemana)) return []
    return tareasSemana
      .filter(t => t && t.titulo)
      .sort((a, b) => {
        const da = ORDEN_DIAS.indexOf(a.dia), db = ORDEN_DIAS.indexOf(b.dia)
        if (da !== db) return da - db
        if (a.sinHora && !b.sinHora) return 1
        if (!a.sinHora && b.sinHora) return -1
        return (a.horaInicio || "").localeCompare(b.horaInicio || "")
      })
  }, [tareasSemana])

  useEffect(() => {
    setTareasSemanaFiltradas(obtenerFiltradas())
  }, [volverCargarTareasFiltradas, obtenerFiltradas])

  const eliminarTareaSemanal = (id) => {
    setTareasSemana(prev => prev.filter(t => t.id !== id))
    if (editandoTareaSemanal?.id === id) setEditandoTareaSemanal(null)
  }

  const guardarTareaEditadaSemanal = () => {
    if (!editandoTareaSemanal) return
    setTareasSemana(prev => prev.map(t => t.id === editandoTareaSemanal.id ? editandoTareaSemanal : t))
    setEditandoTareaSemanal(null)
  }

  return {
    editandoTareaSemanal,
    setEditandoTareaSemanal,
    agregandoTareaSemanal,
    setAgregandoTareaSemanal,
    numeroSemanaActual,
    tareasSemanaFiltradas,
    eliminarTareaSemanal,
    guardarTareaEditadaSemanal,
    eliminarAlReiniciar,
    setEliminarAlReiniciar,
  }
}
