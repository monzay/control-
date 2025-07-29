"use client"
import { useState, useEffect } from "react"

function MensajeDiasRestantes({ objetivo = "crear una agencia" }) {
  const [show, setShow] = useState(false)
  const [mostrarMensaje, setMostrarMensaje] = useState(true)

  // Calcular días restantes en el año actual
  const calcularDiasRestantesDelAnio = () => {
    const hoy = new Date()
    const finAnio = new Date(hoy.getFullYear(), 11, 31)
    const diferenciaMs = finAnio.getTime() - hoy.getTime()
    const diasRestantes = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24))
    return diasRestantes
  }

  const dias = calcularDiasRestantesDelAnio()

  // Dividir el mensaje para resaltar el objetivo en verde
  const partesMensaje = [
    `Te quedan ${dias} ${dias === 1 ? "día" : "días"} de este año para lograr tu objetivo: `,
    objetivo,
    "",
  ]

  const textoMensaje = partesMensaje.join("")
  const [textoMostrado, setTextoMostrado] = useState("")
  const [escrituraCompleta, setEscrituraCompleta] = useState(false)

  // Mostrar solo una vez al día
  useEffect(() => {
    const hoy = new Date()
    const hoyStr = hoy.toISOString().slice(0, 10)
    const lastShown = localStorage.getItem("mensajeDiasRestantesShown")
    if (lastShown !== hoyStr) {
      setShow(true)
      localStorage.setItem("mensajeDiasRestantesShown", hoyStr)
    }
  }, [])

  // Efecto de máquina de escribir
  useEffect(() => {
    if (!show) return
    let indice = 0
    const velocidadEscritura = 30
    const intervaloEscritura = setInterval(() => {
      if (indice < textoMensaje.length) {
        setTextoMostrado(textoMensaje.substring(0, indice + 1))
        indice++
      } else {
        clearInterval(intervaloEscritura)
        setEscrituraCompleta(true)
      }
    }, velocidadEscritura)
    return () => clearInterval(intervaloEscritura)
  }, [textoMensaje, show])

  if (!show || !mostrarMensaje) return null

  return (
    <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black w-screen h-screen">
      <div className="max-w-md w-full mx-4 text-center space-y-8">
        <p className="text-xl font-medium leading-relaxed text-white min-h-[8rem]">
          {textoMostrado.length <= partesMensaje[0].length && (
            <>
              {textoMostrado}
              <span className="inline-block w-1 h-5 bg-emerald-400 ml-0.5 align-middle"></span>
            </>
          )}

          {textoMostrado.length > partesMensaje[0].length &&
            textoMostrado.length <= partesMensaje[0].length + partesMensaje[1].length && (
              <>
                {partesMensaje[0]}
                <span className="text-emerald-400 font-bold">{textoMostrado.substring(partesMensaje[0].length)}</span>
                <span className="inline-block w-1 h-5 bg-emerald-400 ml-0.5 align-middle"></span>
              </>
            )}

          {textoMostrado.length > partesMensaje[0].length + partesMensaje[1].length && (
            <>
              {partesMensaje[0]}
              <span className="text-emerald-400 font-bold">{partesMensaje[1]}</span>
              {textoMostrado.substring(partesMensaje[0].length + partesMensaje[1].length)}
              <span
                className={`inline-block w-1 h-5 bg-emerald-400 ml-0.5 align-middle ${
                  escrituraCompleta ? "animate-pulse" : ""
                }`}
              ></span>
            </>
          )}
        </p>

        {escrituraCompleta && (
          <button
            onClick={() => setMostrarMensaje(false)}
            className="group relative px-8 py-3.5 bg-emerald-500 text-white font-medium rounded-full transition-all duration-300 
                     overflow-hidden shadow-lg hover:shadow-emerald-500/50 animate-in fade-in duration-300
                     hover:bg-emerald-600 hover:scale-105"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Continuar
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        )}
      </div>
    </div>
  )
}

export default MensajeDiasRestantes 