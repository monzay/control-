import { createContext, useState } from "react";


export const ContextVolverACargarTareasFiltradas = createContext();

export function ProviderVolverCargarTareasFiltradas ({ children }) {
  const [volverCargarTareasFiltradas, setVolverCargarTareasFiltradas] =
    useState(false);


  return (
    <ContextVolverACargarTareasFiltradas.Provider
      value={{ volverCargarTareasFiltradas, setVolverCargarTareasFiltradas }}
    >
      {children}
    </ContextVolverACargarTareasFiltradas.Provider>
  );
}
