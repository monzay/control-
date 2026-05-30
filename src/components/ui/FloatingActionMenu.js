"use client"
import { useState } from "react"
import { X, Plus, PenTool } from "lucide-react"

export default function FloatingActionMenu({ onNuevaNotaClick }) {
  const [abierto, setAbierto] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="relative group">
        <button
          onClick={() => setAbierto(!abierto)}
          className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg transition-all duration-300"
        >
          {abierto ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </button>

        {abierto && (
          <div className="absolute bottom-16 right-0 backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-4 shadow-lg w-48">
            <button
              onClick={() => { onNuevaNotaClick(); setAbierto(false) }}
              className="w-full text-left px-4 py-3 hover:bg-white/10 flex items-center gap-2"
            >
              <PenTool className="h-4 w-4 text-emerald-400" />
              <span>Nueva Nota</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
