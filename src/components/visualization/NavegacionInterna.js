import {
  CalendarDays,
  Home,
  Sparkles,
  PenTool,
  MessageCircle,
  Settings,
} from "lucide-react"

const vistas = [
  { id: "semana", label: "Mi Semana", icon: CalendarDays },
  { id: "todas", label: "Todas las tareas", icon: Home },
  { id: "habitos", label: "Hábitos", icon: Sparkles },
  { id: "notas", label: "Notas", icon: PenTool },
  { id: "chats", label: "Chats", icon: MessageCircle },
  { id: "Objetivo", label: "Objetivo", icon: MessageCircle },
]

function NavegacionInterna({ vistaActiva, setVistaActiva }) {
  // Función para definir las clases dinámicamente
  const getClaseBoton = (vista) =>
    `w-full flex items-center gap-2 p-2 rounded-lg text-sm ${
      vistaActiva === vista
        ? "bg-emerald-600 text-white"
        : "text-white/60 hover:text-white hover:bg-white/5"
    }`

  return (
    <nav className="flex-1 p-4">
      <div className="mb-6">
        <h2 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3 pl-2">
          Vistas
        </h2>
        <ul className="space-y-1">
          {vistas.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
                onClick={() => setVistaActiva(id)}
                className={getClaseBoton(id)}
              >
                <Icon className="h-4 w-4 text-emerald-400" />
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-4 border-t border-white/5">
        <button className="w-full flex items-center gap-2 p-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5">
          <Settings className="h-4 w-4" />
          <span>Configuración</span>
        </button>
      </div>
    </nav>
  )
}

export default NavegacionInterna
