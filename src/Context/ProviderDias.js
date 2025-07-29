import { createContext, useState } from "react";

export  const ContextoDias = createContext();

export function ProviderDias  ({ children }) {
    
    const [todosLosDias,setTodosLosDias] =  useState({
        dias:Array.from({length:365}),
        estadoRenderizar:false,
      })


  return (
    <ContextoDias.Provider value={{
        todosLosDias,
        setTodosLosDias
    }}>
      {children}
    </ContextoDias.Provider>
  );
}