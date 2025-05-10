import { createContext, useState, useEffect } from "react";

// Creamos el contexto que vamos a exportar para usar en otros componentes
export const contextoStateX = createContext(null)

// Función auxiliar para obtener datos desde localStorage
function obtenerDesdeLocalStorage(clave, valorPorDefecto) {
  if (typeof window !== "undefined") {
    const guardado = localStorage.getItem(clave)
    if (guardado) {
      try {
        return JSON.parse(guardado)
      } catch (e) {
        console.warn(`Error al parsear ${clave}:`, e)
      }
    }
  }
  return valorPorDefecto
}

// Función auxiliar para guardar datos en localStorage
function guardarEnLocalStorage(clave, valor) {
  if (typeof window !== "undefined") {
    localStorage.setItem(clave, JSON.stringify(valor))
  }
}



export function ProviderStateX({ children }) {


  

  // Estado para las tareas de la semana
  const [tareasSemana, setTareasSemana] = useState(() =>
    obtenerDesdeLocalStorage("tareas-semana", [])
  )

  // Estado para fechas importantes
  const [fechasImportantes, setFechasImportantes] = useState(() =>
    obtenerDesdeLocalStorage("fechas-importantes", [])
  )

  // Estado para usuarios
  const [usuarios, setUsuarios] = useState(() =>
    obtenerDesdeLocalStorage("usuarios", [])
  )

  // Estado para tareas generales / hábitos
  const [tareas, setTareas] = useState(() =>
    obtenerDesdeLocalStorage("habitos-tareas", [])
  )

  // Efecto para guardar automáticamente las tareas de la semana
  useEffect(() => {
    guardarEnLocalStorage("tareas-semana", tareasSemana)
  }, [tareasSemana])

  // Efecto para guardar fechas importantes
  useEffect(() => {
    guardarEnLocalStorage("fechas-importantes", fechasImportantes)
  }, [fechasImportantes])

  // Efecto para guardar usuarios
  useEffect(() => {
    guardarEnLocalStorage("usuarios", usuarios)
  }, [usuarios])

  // Efecto para guardar tareas generales
  useEffect(() => {
    guardarEnLocalStorage("habitos-tareas", tareas)
  }, [tareas])


  const  [dataEstadisticasSemanales,setDataEstadisticasSemanales] = useState([])
   useEffect(()=>{
    if(!localStorage.getItem("estadisticasSemanales")) {
       localStorage.setItem("estadisticasSemanales",JSON.stringify([]))
     }else{
       const dataEstadisticas = JSON.parse(localStorage.getItem("estadisticasSemanales"))
       setDataEstadisticasSemanales(dataEstadisticas)
     }  
   },[])



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
