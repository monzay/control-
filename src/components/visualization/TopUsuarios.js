
import { Trophy, Medal } from 'lucide-react'
import { useState,useEffect } from 'react'


function TopUsuarios({ usuarios }) {
   const [isClient,setIsClient] =useState(false)


  useEffect(()=>{
    setIsClient(true)
  },[isClient, usuarios])

  
  // Si no es cliente, no renderizar nada
  if (!isClient) {
    return null;
  }

  // Si no hay usuarios, mostrar mensaje
  if (!usuarios || usuarios.length === 0) {
    return (
      <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-4 shadow-lg mb-4">
        <h3 className="text-sm font-medium mb-3 text-white/70 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-emerald-400" />
          Top Usuarios
        </h3>
        <div className="text-center text-white/50 py-4">No hay usuarios registrados</div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-md bg-black/20 border border-white/10 rounded-xl p-4 shadow-lg mb-4">
      <h3 className="text-sm font-medium mb-3 text-white/70 flex items-center gap-2">
        <Trophy className="h-4 w-4 text-emerald-400" />
        Top Usuarios
      </h3>
      <div>
      </div>
    </div>
  )
}

export default TopUsuarios