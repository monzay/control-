"use client"

import { useState } from "react"
import { LogIn } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SolicitarRestablecimiento() {
  const [email, setEmail] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [error, setError] = useState("")
  const [enviando, setEnviando] = useState(false)
  const router = useRouter()

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setMensaje("")
    setError("")
    if (!email || !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
      setError("Por favor, ingresa un correo electrónico válido.")
      return
    }
    setEnviando(true)
    try {
      const res = await fetch("http://localhost:4000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setMensaje("Si el correo existe, recibirás instrucciones para restablecer tu contraseña.")
        setEmail("")
      } else {
        setError(data?.message || "Ocurrió un error. Intenta nuevamente.")
      }
    } catch (err) {
      setError("Error de conexión. Intenta más tarde.")
    }
    setEnviando(false)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black">
      <div className="relative w-full max-w-md mx-4 rounded-2xl shadow-2xl bg-white/0 border border-emerald-800/30 p-0 overflow-hidden flex flex-col">
        <div className="flex flex-col items-center w-full px-8 py-10 bg-black">
          <div className="mb-6 flex flex-col items-center">
            <LogIn className="h-12 w-12 text-emerald-400 mb-2" />
            <h2 className="text-2xl font-bold text-white mb-2">Restablecer contraseña</h2>
            <p className="text-emerald-200 text-center text-base mb-2 max-w-xs">
              Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
            </p>
          </div>
          <form onSubmit={manejarEnvio} className="w-full space-y-5" autoComplete="off" spellCheck={false}>
            {mensaje && (
              <div className="text-green-400 text-center font-semibold mb-2 animate-pulse">{mensaje}</div>
            )}
            {error && (
              <div className="text-emerald-400 text-center font-semibold mb-2">{error}</div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-emerald-200 mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="off"
                value={email}
                onChange={e => setEmail(e.target.value)}
                maxLength={100}
                className="w-full bg-black border border-emerald-700 rounded-xl px-4 py-2.5 text-white placeholder-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                placeholder="tu@email.com"
                required
                inputMode="email"
              />
            </div>
            <button
              type="submit"
              disabled={enviando}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {enviando ? (
                <>
                  <span className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full"></span>
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Solicitar restablecimiento</span>
                </>
              )}
            </button>
          </form>
          <div className="mt-8 text-center">
            <a
              href="#"
              onClick={e => { e.preventDefault(); router.push("/Form/Login") }}
              className="text-emerald-400 hover:text-emerald-200 underline underline-offset-2 transition-colors text-sm font-medium"
            >
              Volver al inicio de sesión
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}