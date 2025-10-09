import funcionesGlobales from "@/function/funcionesGlobales";
import { useEffect } from "react";


function useEjecutarUnaVezPorDia(callback) {
  useEffect(() => {
    const hoy = funcionesGlobales.obtenerDiaHoy()
    const ultimaEjecucion = localStorage.getItem("ultimaSesion");

    if (ultimaEjecucion !== hoy) {
      localStorage.setItem("ultimaSesion", hoy );
      callback();
    }
  }, [callback]);
}

export default  useEjecutarUnaVezPorDia