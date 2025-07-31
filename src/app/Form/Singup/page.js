"use client"

import { UserPlus } from "lucide-react"
import { CallApi } from "@/hooks/CallApi"
import { useState } from "react"
import { useRouter } from "next/navigation"

function sanitizarInput(valor) {
  if (typeof valor !== "string") return ""
  return valor
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim()
}

function validarCampos(formulario) {
  const errores = {}
  // Validación de nombre
  if (!formulario.nombre || typeof formulario.nombre !== "string" || !formulario.nombre.trim()) {
    errores.nombre = "El nombre es obligatorio"
  } else if (formulario.nombre.length < 2) {
    errores.nombre = "El nombre debe tener al menos 2 caracteres"
  } else if (formulario.nombre.length > 50) {
    errores.nombre = "El nombre no puede superar los 50 caracteres"
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/.test(formulario.nombre)) {
    errores.nombre = "El nombre contiene caracteres no válidos"
  }
  // Validación de email
  if (!formulario.email || typeof formulario.email !== "string" || !formulario.email.trim()) {
    errores.email = "El correo electrónico es obligatorio"
  } else if (formulario.email.length > 100) {
    errores.email = "El correo electrónico no puede superar los 100 caracteres"
  } else if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(formulario.email)
  ) {
    errores.email = "El formato del correo electrónico no es válido"
  }
  // Validación de contraseña
  if (!formulario.password || typeof formulario.password !== "string") {
    errores.password = "La contraseña es obligatoria"
  } else if (formulario.password.length < 8) {
    errores.password = "La contraseña debe tener al menos 8 caracteres"
  } else if (formulario.password.length > 64) {
    errores.password = "La contraseña no puede superar los 64 caracteres"
  } else if (
    !/(?=.*[a-z])/.test(formulario.password) ||
    !/(?=.*[A-Z])/.test(formulario.password) ||
    !/(?=.*\d)/.test(formulario.password) ||
    !/(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?`~])/.test(formulario.password)
  ) {
    errores.password =
      "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial"
  }
  const campos = ["nombre", "email", "password"]
  campos.forEach((campo) => {
    if (formulario[campo] && /[<>{}[\];]/.test(formulario[campo])) {
      errores[campo] = "El campo contiene caracteres no permitidos"
    }
  })
  return errores
}

export default function PaginaRegistro({ onClose, onSuccess }) {
  const [formulario, setFormulario] = useState({
    nombre: "",
    email: "",
    password: "",
  })
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)
  const { request, loading, error } = CallApi("http://localhost:4000/auth")
  const router = useRouter()

  const manejarCambio = (e) => {
    const { name, value } = e.target
    setFormulario((prev) => ({
      ...prev,
      [name]: sanitizarInput(value),
    }))
    if (errores[name]) {
      setErrores((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()
    const nuevosErrores = validarCampos(formulario)
    console.log(formulario)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length === 0) {
      setEnviando(true)
      try {
        await request("/signup", {
          method: "POST",
          body: {
            nombre: formulario.nombre,
            email: formulario.email,
            password: formulario.password,
            zonaHoraria : Intl.DateTimeFormat().resolvedOptions().timeZone 
          },
        })
        setEnviando(false)
        onSuccess && onSuccess()
        onClose && onClose()
        router.push("/Form/Login")
      } catch (err) {
        setEnviando(false)
        setErrores((prev) => ({
          ...prev,
          api: error || "Error al registrarse"
        }))
      }
    }
  }

  const manejarClickLogin = (e) => {
    e.preventDefault()
    router.push("/Form/Login")
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black">
      <div className="relative w-full max-w-4xl mx-4 rounded-2xl shadow-2xl bg-white/0 border border-emerald-800/30 p-0 overflow-hidden flex flex-col md:flex-row">
        {/* Lado de Información */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-emerald-950 p-10">
          <div className="mb-6">
            <UserPlus className="h-16 w-16 text-emerald-400 mb-4" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">¡Crea tu cuenta en Control-!</h2>
          <p className="text-emerald-200 text-lg mb-4 text-center max-w-xs">
            Registrate para gestionar tus proyectos, tareas y mucho más. Disfrutá de una experiencia segura y eficiente con nuestra plataforma.
          </p>
          <ul className="text-emerald-300 text-base space-y-2 mt-4">
            <li>✔ Seguridad y privacidad</li>
            <li>✔ Registro rápido y sencillo</li>
            <li>✔ Soporte dedicado</li>
          </ul>
        </div>
        {/* Lado del Formulario */}
        <div className="flex flex-col items-center w-full md:w-1/2 px-8 py-10 bg-black">
          <div className="flex flex-col items-center mb-8"></div>
          <form onSubmit={manejarEnvio} className="w-full space-y-5" autoComplete="off" spellCheck={false}>
            <div>
              <label htmlFor="nombre" className="block text-sm font-semibold text-emerald-200 mb-1">
                Nombre completo
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                autoComplete="off"
                value={formulario.nombre}
                onChange={manejarCambio}
                maxLength={50}
                className="w-full bg-black border border-emerald-700 rounded-xl px-4 py-2.5 text-white placeholder-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                placeholder="Tu nombre completo"
                required
                inputMode="text"
              />
              {errores.nombre && <p className="text-emerald-400 text-xs mt-1">{errores.nombre}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-emerald-200 mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="off"
                value={formulario.email}
                onChange={manejarCambio}
                maxLength={100}
                className="w-full bg-black border border-emerald-700 rounded-xl px-4 py-2.5 text-white placeholder-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                placeholder="tu@email.com"
                required
                inputMode="email"
              />
              {errores.email && <p className="text-emerald-400 text-xs mt-1">{errores.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-emerald-200 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                minLength={8}
                maxLength={64}
                value={formulario.password}
                onChange={manejarCambio}
                className="w-full bg-black border border-emerald-700 rounded-xl px-4 py-2.5 text-white placeholder-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                placeholder="••••••••"
                required
                inputMode="text"
              />
              {errores.password && <p className="text-emerald-400 text-xs mt-1">{errores.password}</p>}
            </div>
            <div>
              <button
                type="submit"
                disabled={enviando || loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {enviando || loading ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full"></span>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    <span>Crear cuenta</span>
                  </>
                )}
              </button>
              {errores.api && <p className="text-emerald-400 text-xs mt-2 text-center">{errores.api}</p>}
              {error && <p className="text-emerald-400 text-xs mt-2 text-center">{error}</p>}
            </div>
          </form>
          <div className="mt-8 text-center">
            <span className="text-emerald-200/80 text-sm">¿Ya tenés una cuenta? </span>
            <a
              href="#"
              onClick={manejarClickLogin}
              className="text-emerald-400 hover:text-emerald-200 underline underline-offset-2 transition-colors text-sm font-medium"
            >
              Iniciar sesión
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}