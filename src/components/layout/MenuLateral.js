import { motion, AnimatePresence } from "framer-motion"
import NavegacionInterna from "../visualization/NavegacionInterna.js"
function MenuLateral({ menuAbierto, vistaActiva, setVistaActiva, setMenuAbierto, filtroActivo, setFiltroActivo }) {
  return (
    <>
      {/* Versión móvil (con animación) */}
      <AnimatePresence>
        {menuAbierto && (
          <div
            className="fixed inset-y-0 left-0 w-60 z-20 pt-16 bg-black/30 backdrop-filter backdrop-blur-md border-r border-white/5 flex flex-col md:hidden"
          >
            <NavegacionInterna
              vistaActiva={vistaActiva}
              setVistaActiva={(vista) => {
                setVistaActiva(vista)
                setMenuAbierto(false)
              }}
              filtroActivo={filtroActivo}
              setFiltroActivo={setFiltroActivo}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Versión desktop (siempre visible) */}
      <aside className="hidden md:flex w-60 z-20 pt-16 bg-black/30 backdrop-filter backdrop-blur-md border-r border-white/5 flex-col">
        <NavegacionInterna 
          vistaActiva={vistaActiva} 
          setVistaActiva={setVistaActiva}
          filtroActivo={filtroActivo}
          setFiltroActivo={setFiltroActivo}
        />
      </aside>

      {/* Overlay para cerrar el menú en móviles */}
      {menuAbierto && (
        <div className="fixed inset-0 bg-black/50 z-10 md:hidden" onClick={() => setMenuAbierto(false)} />
      )}
    </>
  )
}

export default MenuLateral
