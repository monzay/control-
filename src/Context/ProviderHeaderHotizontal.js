"use client"
import {  createContext, useState } from "react";
export const ContextoHeaderHorizontal = createContext();

export function ProviderHeaderHotizontal({ children }) {
  const [diaActualDelAnio, setDiaActualDelAnio] = useState(0);
  const [menuAbierto, setMenuAbierto] = useState();
  const [mostrarTareas, setMostrarTareas] = useState(true);

  return (
    <ContextoHeaderHorizontal.Provider
      value={{
        diaActualDelAnio,
        setDiaActualDelAnio,
        menuAbierto,
        setMenuAbierto,
        mostrarTareas,
        setMostrarTareas,
      }}
    >
      {children}
    </ContextoHeaderHorizontal.Provider>
  );
}
