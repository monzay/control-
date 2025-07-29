import { createContext, useState, useEffect } from "react";

// Creamos el contexto que vamos a exportar para usar en otros componentes
export const contextoStateX = createContext(null)

export function ProviderStateX({ children }) {
  // Estado para las tareas de la semana
  const [tareasSemana, setTareasSemana] = useState([])

  // Estado para fechas importantes
  const [fechasImportantes, setFechasImportantes] = useState([])

  // Estado para usuarios
  const [usuarios, setUsuarios] = useState([]);

  // Estado para tareas generales / hábitos
  const [tareas, setTareas] = useState([])

  // Estado para estadísticas semanales
  const [dataEstadisticasSemanales, setDataEstadisticasSemanales] = useState([])

  // Devolvemos el proveedor del contexto con todos los estados y sus setters
  return (
    <contextoStateX.Provider
      value={{
        tareasSemana,
        setTareasSemana,
        fechasImportantes,
        setFechasImportantes,
        usuarios,
        setUsuarios,
        tareas,
        setTareas,
        dataEstadisticasSemanales,
        setDataEstadisticasSemanales
      }}
    >
      {children}
    </contextoStateX.Provider>
  )
}
