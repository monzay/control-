
"use client"
import { createContext } from 'react'

export  const ContextTareaId  = createContext()

export function ProviderTareaId ({ children }) {
  const [tareaId,setTareaId] =  useState(null)
  return (
    <ContextTareaId.Provider value={{tareaId,setTareaId }}>
      {children}
    </ContextTareaId.Provider>
  )
}

