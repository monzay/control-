import FechaModulo from "@/function/FechaModulo"
import { useEffect } from "react"

function useEjecutarDadaSemana(callback) {

    useEffect(()=>{
        try {
            const semanActual = FechaModulo.obtenerNumeroSemana()  // return  ej: 12
            const semanGuardada = Number(localStorage.getItem("ultimaSeman")) // return  12
    
            // vemos si exite el espacion  en el localStorage 
            if(!localStorage.getItem("ultimaSeman")){
                // creamos el espacio si no exite 
                localStorage.setItem("ultimaSeman",semanActual)
            }
            
            // vemos  si la seman es diferente  
            if(semanActual !== semanGuardada  ){
                // ejecutamos  la funcion  en caso de que sea diferente
               callback()
               //  actulizamos  a la nueva semana
               localStorage.setItem("ultimaSeman",semanActual)
              }
              
        } catch (error) {
            console.log(error)
        }
    },[])
  }


  export default  useEjecutarDadaSemana