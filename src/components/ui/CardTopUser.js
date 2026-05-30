// aun no lo estamos utilizando hasta que se conectado con un servidor web 

import { Medal } from 'lucide-react';
import Image from 'next/image';
{usuarios.slice(0, 3).map((usuario, index) => (
    <div key={usuario.id} className="flex items-center gap-3">
      <div className="relative">
        <Image
          src={usuario.avatar || "/placeholder.svg?height=40&width=40"}
          alt={usuario.nombre}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover border-2 border-white/10"
        />
        <div
          className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold
          ${index === 0 ? "bg-emerald-500" : index === 1 ? "bg-emerald-500" : "bg-emerald-500"}`}
        >
          {index + 1}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <p className="text-sm font-medium truncate">{usuario.nombre}</p>
          {IconoModulo.obtenerIconoReputacion(usuario.reputacion)}
        </div>
        <p className="text-xs text-white/50 flex items-center gap-1">
          <Medal className="h-3 w-3 text-emerald-400" />
          {usuario.puntos} pts
        </p>
        {index === 0 && usuario.mensaje && (
          <p className="text-xs italic text-emerald-300 mt-1 border-l-2 border-emerald-500 pl-2">
            {usuario.mensaje}
          </p>
        )}
      </div>
    </div>
  ))} 