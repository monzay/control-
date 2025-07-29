import funcionesGlobales from "@/function/funcionesGlobales";
import { useEffect } from "react";

function useEjecutarUnaVezPorDia(callback) {
  useEffect(() => {
    // Ejecutar el callback siempre que se monte el componente
    // Esto simula el comportamiento de ejecución diaria
    callback();
  }, []);
}

export default useEjecutarUnaVezPorDia