import FechaModulo from "@/function/FechaModulo"
import { useEffect } from "react"

function useEjecutarDadaSemana(callback) {
    useEffect(()=>{
        try {
            
            const semanActual = FechaModulo.obtenerNumeroSemana()
            const semanGuardada = localStorage.getItem("ultimaSeman")
    
            if(!localStorage.getItem("ultimaSeman")){
                localStorage.setItem("ultimaSeman",semanActual)
            }
            if(semanActual !== semanGuardada ){
               callback()
               localStorage.setItem(semanActual)
              }
              
        } catch (error) {
            console.log(error)
        }
    },[])
  }


  export default  useEjecutarDadaSemana