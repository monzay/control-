"use client"
import { useState, useContext } from "react"
import { contextoStateX } from "@/Context/ProviderStateX"
import AnimacionModulo from "@/function/Confeti"
import UsuarioModulo from "@/function/UsuarioModulo"
import RachaModulo from "@/function/RachaModulo"
import funcionesGlobales from "@/function/funcionesGlobales"

const crearFechaImportante = (tarea) => ({
  id: `tarea-fin-${tarea.id}`,
  fecha: tarea.fechaFin,
  titulo: `Fin de ${tarea.tipo === "habito" ? "hábito" : "nota"}: ${tarea.titulo}`,
  tipo: tarea.tipo === "habito" ? "habito-fin" : "nota",
  color: "bg-emerald-500",
  idTarea: tarea.id,
})

export function useTareas({ setMostrarAnimacionCompletado, onRachaActualizada }) {
  const {
    tareas, setTareas,
    tareasSemana, setTareasSemana,
    fechasImportantes, setFechasImportantes,
    usuarios, setUsuarios,
  } = useContext(contextoStateX)

  const [editandoTarea, setEditandoTarea] = useState(null)

  const agregarTarea = (nuevaTarea) => {
    setTareas(prev => [...prev, nuevaTarea])
    if (nuevaTarea.fechaFin && nuevaTarea.tipo) {
      setFechasImportantes(prev => [...prev, crearFechaImportante(nuevaTarea)])
    }
  }

  const eliminarTarea = (id) => {
    setTareas(prev => prev.filter(t => t.id !== id))
    setFechasImportantes(prev => prev.filter(f => f.idTarea !== id))
    setTareasSemana(prev => prev.filter(t => t.idTarea !== id))
    if (editandoTarea?.id === id) setEditandoTarea(null)
  }

  const guardarTareaEditada = (tareaActualizada) => {
    if (tareaActualizada.fechaFin !== undefined && tareaActualizada.tipo) {
      setFechasImportantes(prev => prev.filter(f => f.idTarea !== tareaActualizada.id))
      if (tareaActualizada.fechaFin) {
        setFechasImportantes(prev => [...prev, crearFechaImportante(tareaActualizada)])
      }
    }
    setTareas(prev => prev.map(t => t.id === tareaActualizada.id ? tareaActualizada : t))
    setTareasSemana(prev => prev.map(ts =>
      ts.idTarea === tareaActualizada.id ? { ...ts, titulo: tareaActualizada.titulo } : ts
    ))
    setEditandoTarea(null)
  }

  const iniciarEditarTarea = (tarea) => setEditandoTarea({ ...tarea })

  const alternarTarea = (id) => {
    const tarea = tareas.find(t => t.id === id)
    if (!tarea || tarea.completada) return

    AnimacionModulo.lanzarConfeti()
    setMostrarAnimacionCompletado(true)
    setTimeout(() => setMostrarAnimacionCompletado(false), 1000)

    const usuarioActual = usuarios[0]
    if (usuarioActual) {
      UsuarioModulo.actualizarReputacionUsuario(usuarioActual.id, true, usuarios, setUsuarios)
    }

    const actualizarRacha = () => {
      RachaModulo.actualizarRachaPorCompletado(tareasSemana, tareas)
      onRachaActualizada(RachaModulo.obtenerRachaActual())
    }

    setTareas(prev => prev.map(t => {
      if (t.id !== id) return t
      const hoy = funcionesGlobales.obtenerDiaHoy()

      if (t.tipo === "nota") {
        actualizarRacha()
        return { ...t, completada: true }
      }

      if (t.historial?.some(h => h.fecha === hoy && h.completada)) return t

      const ayer = new Date()
      ayer.setDate(ayer.getDate() - 1)
      const ayerStr = ayer.toISOString().split("T")[0]
      const ayerCompletada = t.historial?.some(h => h.fecha === ayerStr && h.completada)

      setTimeout(actualizarRacha, 0)

      return {
        ...t,
        completada: true,
        racha: ayerCompletada ? (t.racha || 0) + 1 : 1,
        historial: [
          { fecha: hoy, completada: true },
          ...(t.historial?.filter(h => h.fecha !== hoy) || []),
        ],
      }
    }))
  }

  return { editandoTarea, setEditandoTarea, agregarTarea, eliminarTarea, guardarTareaEditada, iniciarEditarTarea, alternarTarea }
}
