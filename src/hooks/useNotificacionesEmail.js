"use client"
import { useEffect } from "react"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
const CLAVE_ULTIMA_VERIFICACION = "ultima-verificacion-email"

export function useNotificacionesEmail({ tareas, email }) {
  useEffect(() => {
    if (typeof window === "undefined" || !email || !Array.isArray(tareas)) return

    // Solo verificar una vez por día
    const hoy = new Date().toISOString().split("T")[0]
    const ultimaVerificacion = localStorage.getItem(CLAVE_ULTIMA_VERIFICACION)
    if (ultimaVerificacion === hoy) return

    const notasConAntelacion = tareas.filter(
      t => t.tipo === "nota" && t.diasAntelacion && (t.fechaFin || t.repetirMensualmente)
    )
    if (notasConAntelacion.length === 0) return

    fetch(`${BACKEND_URL}/api/verificar-antelacion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notas: notasConAntelacion, email }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.enviados > 0) {
          console.log(`[notificaciones] ${data.enviados} correo(s) enviado(s)`)
        }
        localStorage.setItem(CLAVE_ULTIMA_VERIFICACION, hoy)
      })
      .catch(err => console.warn("[notificaciones] Backend no disponible:", err.message))
  }, [tareas, email])
}
