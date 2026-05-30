"use client"
import { useState, useEffect, useContext } from "react"
import { contextoStateX } from "@/Context/ProviderStateX"
import RachaModulo from "@/function/RachaModulo"

export function useRacha() {
  const { tareasSemana, tareas } = useContext(contextoStateX)
  const [rachaActual, setRachaActual] = useState(0)
  const [mostrarMensajeRacha, setMostrarMensajeRacha] = useState(false)
  const [mensajeRachaHito, setMensajeRachaHito] = useState(null)

  const onRachaActualizada = (nuevaRacha) => {
    setRachaActual(nuevaRacha)
    const mensajeHito = RachaModulo.verificarMensajeHito(nuevaRacha)
    if (mensajeHito) {
      setMensajeRachaHito(mensajeHito)
      setMostrarMensajeRacha(true)
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      RachaModulo.verificarYActualizarRacha(tareasSemana, tareas)
      onRachaActualizada(RachaModulo.obtenerRachaActual())
    } catch (e) {
      console.error("Error al verificar racha:", e)
    }
  }, [tareasSemana, tareas])

  useEffect(() => {
    if (typeof window === "undefined") return
    setRachaActual(RachaModulo.obtenerRachaActual())
  }, [])

  return { rachaActual, mostrarMensajeRacha, setMostrarMensajeRacha, mensajeRachaHito, onRachaActualizada }
}
