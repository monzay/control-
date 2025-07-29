import FechaModulo from "@/function/FechaModulo"
import { useEffect } from "react"

function useEjecutarDadaSemana(callback) {
    useEffect(()=>{
        try {
            const semanActual = FechaModulo.obtenerNumeroSemana()
            
            // Ejecutar el callback siempre que se monte el componente
            // Esto simula el comportamiento de cambio de semana
            callback()
              
        } catch (error) {
            console.log(error)
        }
    },[])
}

export default useEjecutarDadaSemana