import { Check, Play, Edit, Trash2 } from "lucide-react";

import AnimacionModulo from "@/function/Confeti";
import {  useContext, useState } from "react";
import alternarTareaSemanal from "@/function/ActualizarActividad";
import { contextoStateX } from "@/Context/ProviderStateX";
import { ContextVolverACargarTareasFiltradas } from "@/Context/ProviderVolverACargarTareasFiltradas";
import funcionesGlobales from "@/function/funcionesGlobales";
import { ContextoDias } from "@/Context/ProviderDias";
function CardModoVisualizacionMiSemana({
  tarea,
  iniciarTemporizadorTarea,
  iniciarEdicionEnLinea,
  eliminarTareaSemanal,
  setTareaId,
  
}) {
  const {setTareasSemana,tareasSemana, tareas} = useContext(contextoStateX)
  const {setVolverCargarTareasFiltradas} = useContext(ContextVolverACargarTareasFiltradas)
  const [diaActual, setDiaActual] = useState(funcionesGlobales.obtenerNombreDelDia);
 

  

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
      <td className="py-3 px-3 text-sm">{tarea.titulo}</td>
      <td className="py-3 px-3 text-sm text-white/70">
        {tarea.sinHora ? "-" : tarea.horaInicio}
      </td>
      <td className="py-3 px-3 text-sm text-white/70">
        {tarea.sinHora ? "-" : tarea.duracion}
      </td>
      <td className="py-3 px-3 text-center">
        <button
          onClick={ejecutarFuncionBtnTareaCompletada}
          className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors mx-auto ${
            tarea.completada
              ? "bg-emerald-600 text-white"
              : "border border-white/20 hover:bg-white/10"
          }`}
          disabled={tarea.completada}
        >
          {tarea.completada && <Check className="h-3 w-3" />}
        </button>
      </td>
      <td className="py-3 px-3 text-center">
      </td>
      <td className="py-3 px-3 text-center">
      </td>
      <td className="py-3 px-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => {
              iniciarEdicionEnLinea(tarea)
            }}
            className="text-white/30 hover:text-emerald-400 p-1 rounded-full transition-colors"
          >
            <Edit className="h-3 w-3" />
          </button>
          <button
            onClick={() => {
              setVolverCargarTareasFiltradas(prev =>  !prev)
              eliminarTareaSemanal(tarea.id)
              setTareaId(tarea.id)
              
            }}
            className="text-white/30 hover:text-emerald-400 p-1 rounded-full transition-colors"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </td>
    </>
  );
}

export default CardModoVisualizacionMiSemana;
