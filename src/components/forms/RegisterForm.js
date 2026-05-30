import { useState } from "react"
import { X, UserPlus } from "lucide-react"

function RegisterForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // Limpiar error al cambiar el valor
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validar nombre
    if (!formData.name) {
      newErrors.name = "El nombre es obligatorio"
    }

    // Validar email
    if (!formData.email) {
      newErrors.email = "El email es obligatorio"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El formato del email no es válido"
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria"
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Debes confirmar la contraseña"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)

      // Simulación de registro exitoso
      setTimeout(() => {
        setIsSubmitting(false)
        onSuccess && onSuccess()
        onClose()
      }, 1000)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/90">
      <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-4 shadow-lg w-full max-w-md mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">Crear cuenta</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nombre
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Tu nombre"
            />
            {errors.name && <p className="text-emerald-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="tu@email.com"
            />
            {errors.email && <p className="text-emerald-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-emerald-400 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="text-emerald-400 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 rounded border-white/30 bg-white/5 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-white/70">
              Acepto los{" "}
              <a href="#" className="text-emerald-400 hover:text-emerald-300">
                términos y condiciones
              </a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-1.5 rounded-lg transition-colors duration-200 text-sm bg-emerald-600 hover:bg-emerald-700 text-white py-2 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full"></span>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Crear cuenta</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterForm