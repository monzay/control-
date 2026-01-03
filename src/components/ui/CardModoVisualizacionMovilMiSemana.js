import { Play, Edit, Trash2, Check } from "lucide-react";
import AnimacionModulo from "@/function/Confeti";
import FechaModulo from "@/function/FechaModulo";
import { useContext,useState } from "react";
import { ContextVolverACargarTareasFiltradas } from "@/Context/ProviderVolverACargarTareasFiltradas";
import funcionesGlobales from "@/function/funcionesGlobales";
import { contextoStateX } from "@/Context/ProviderStateX";
import alternarTareaSemanal from "@/function/ActualizarActividad";

function CardModoVisualizacionMovilMiSemana ({
    tarea,
    iniciarTemporizadorTarea,
    iniciarEdicionEnLinea,
    eliminarTareaSemanal
}){

  const [diaActual, setDiaActual] = useState(funcionesGlobales.obtenerNombreDelDia());
  const {setVolverCargarTareasFiltradas} = useContext(ContextVolverACargarTareasFiltradas)
  const {setTareasSemana,tareasSemana, tareas} = useContext(contextoStateX)


  function ejecutarFuncionBtnTareaCompletada(){
    if(diaActual ===  tarea.dia){
      if (!tarea.completada) {
        AnimacionModulo.lanzarConfeti();
        alternarTareaSemanal(tarea.id,setTareasSemana, tareas || [])
        setVolverCargarTareasFiltradas(prev =>  !prev)
      }
    }else  alert(" ya paso el dia ")
  }

   
    return (
        <>
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-sm font-medium">
            {tarea.titulo}
          </h4>
          <button
            onClick={ejecutarFuncionBtnTareaCompletada}
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
              tarea.completada
                ? "bg-emerald-600 text-white"
                : "border border-white/20 hover:bg-white/10"
            }`}
            disabled={tarea.completada}
          >
            {tarea.completada && (
              <Check className="h-3 w-3" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1 text-xs text-white/70 mb-2">
          {!tarea.sinHora && (
            <>
              <div>
                <span className="text-white/50">Hora: </span>
                {tarea.horaInicio}
              </div>
              <div>
                <span className="text-white/50">
                  Duración:{" "}
                </span>
                {FechaModulo.formatearDuracion(tarea.duracion)}
              </div>
            </>
          )}
          <div>
            <span className="text-white/50">
              Completadas:{" "}
            </span>
            <span className="text-emerald-400">
              {tarea.contadorCompletadas}
            </span>
          </div>
          <div>
            <span className="text-white/50">
              Fallidas:{" "}
            </span>
            <span className="text-emerald-400">
              {tarea.contadorNoCompletadas}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => iniciarTemporizadorTarea(tarea)}
            className="text-white/50 hover:text-emerald-400 p-1 rounded-full transition-colors"
            title="Iniciar tarea"
          >
            <Play className="h-4 w-4" />
          </button>
          <button
            onClick={() => iniciarEdicionEnLinea(tarea)}
            className="text-white/50 hover:text-emerald-400 p-1 rounded-full transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() =>{
              setVolverCargarTareasFiltradas(prev =>  !prev)
              eliminarTareaSemanal(tarea.id)
            }}
            className="text-white/50 hover:text-emerald-400 p-1 rounded-full transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </>
    )
}

export default CardModoVisualizacionMovilMiSemana 