"use client"

import { LogIn, Eye, EyeOff } from "lucide-react"
import { CallApi } from "@/hooks/CallApi"
import { useState } from "react"
import { useRouter } from "next/navigation"

// Función para sanitizar entradas y evitar XSS
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

// Validaciones profesionales y exhaustivas
function validarCampos(formulario) {
  const errores = {}

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

  // Validación de caracteres peligrosos (prevención de inyección)
  const campos = ["email", "password"]
  campos.forEach((campo) => {
    if (formulario[campo] && /[<>{}[\];]/.test(formulario[campo])) {
      errores[campo] = "El campo contiene caracteres no permitidos"
    }
  })

  return errores
}

export default function PaginaLogin({ onClose, onSuccess }) {
  const [formulario, setFormulario] = useState({
    email: "",
    password: "",
  })
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)
  const { request, loading, error } = CallApi("http://localhost:4000/auth")
  const router = useRouter()
  const [verPassword, setVerPassword] = useState(false)
  const [mensajeExito, setMensajeExito] = useState("") // Nuevo estado para el mensaje de éxito

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
    
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length === 0) {
      setEnviando(true)
      try {
        const respuesta = await request("/login", {
          method: "POST",
          body: {
            email: formulario.email,
            password: formulario.password,
          },
        })
        // Guardar el token en localStorage si existe
        if (respuesta?.data?.token) {
          localStorage.setItem("accessToken", respuesta.data.token)
          setMensajeExito("¡Inicio de sesión exitoso!") 
            router.push("/")
          setTimeout(() => {
            setMensajeExito("")
            onSuccess && onSuccess()
            onClose()
          }, 1500) // Oculta el mensaje y cierra después de 1.5s
        }
        setEnviando(false)
      } catch (err) {
        setEnviando(false)
      }
    }
  }

  const manejarClickRegistro = (e) => {
    e.preventDefault()
    router.push("/Form/Singup")
  }

  const manejarClickOlvidasteLaContraseña= (e) => {
    e.preventDefault()
    router.push("/Form/SolicitarRestablecimiento")
  }




  const alternarVerPassword = () => {
    setVerPassword((prev) => !prev)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black">
      <div className="relative w-full max-w-4xl mx-4 rounded-2xl shadow-2xl bg-white/0 border border-emerald-800/30 p-0 overflow-hidden flex flex-col md:flex-row">
        {/* Lado de Información */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-emerald-950 p-10">
          <div className="mb-6">
            <LogIn className="h-16 w-16 text-emerald-400 mb-4" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">¡Bienvenido a Control-!</h2>
          <p className="text-emerald-200 text-lg mb-4 text-center max-w-xs">
            Accedé a tu cuenta para gestionar tus proyectos, tareas y mucho más.
            Disfrutá de una experiencia segura y eficiente con nuestra plataforma.
          </p>
          <ul className="text-emerald-300 text-base space-y-2 mt-4">
            <li>✔ Seguridad y privacidad</li>
            <li>✔ Acceso rápido y sencillo</li>
            <li>✔ Soporte dedicado</li>
          </ul>
        </div>
        {/* Lado del Formulario */}
        <div className="flex flex-col items-center w-full md:w-1/2 px-8 py-10 bg-black">
          <div className="flex flex-col items-center mb-8"></div>
          <form onSubmit={manejarEnvio} className="w-full space-y-5" autoComplete="off" spellCheck={false}>
            {mensajeExito && (
              <div className="text-green-400 text-center font-semibold mb-2 animate-pulse">
                {mensajeExito}
              </div>
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
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={verPassword ? "text" : "password"}
                  minLength={8}
                  maxLength={64}
                  value={formulario.password}
                  onChange={manejarCambio}
                  className="w-full bg-black border border-emerald-700 rounded-xl px-4 py-2.5 text-white placeholder-emerald-300/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition pr-12"
                  placeholder="••••••••"
                  required
                  inputMode="text"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={alternarVerPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-200 focus:outline-none"
                  aria-label={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {verPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errores.password && <p className="text-emerald-400 text-xs mt-1">{errores.password}</p>}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-emerald-700 bg-black text-emerald-500 focus:ring-emerald-500"
                  tabIndex={-1}
                  aria-label="Recordarme"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-emerald-200/80 select-none">
                  Recordarme
                </label>
              </div>
              <div  className="text-sm">
                <a href="#" onClick={manejarClickOlvidasteLaContraseña} className="text-emerald-400 hover:text-emerald-200 transition-colors underline underline-offset-2">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
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
                    <LogIn className="h-5 w-5" />
                    <span>Iniciar sesión</span>
                  </>
                )}
              </button>
              {errores.api && <p className="text-emerald-400 text-xs mt-2 text-center">{errores.api}</p>}
              {error && <p className="text-emerald-400 text-xs mt-2 text-center">{error}</p>}
            </div>
          </form>
          <div className="mt-8 text-center">
            <span className="text-emerald-200/80 text-sm">¿No tenés una cuenta?{" "}</span>
            <a
              href="#"
              onClick={manejarClickRegistro}
              className="text-emerald-400 hover:text-emerald-200 underline underline-offset-2 transition-colors text-sm font-medium"
            >
              Registrate
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
