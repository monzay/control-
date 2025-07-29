import { useContext } from "react";
import { ContextVolverACargarTareasFiltradas } from "@/Context/ProviderVolverACargarTareasFiltradas";

function CardDiaSemana({ setDiaSemanaSeleccionado, diaSemanaSeleccionado, diasSemana }) {
  const {setVolverCargarTareasFiltradas} =   useContext(ContextVolverACargarTareasFiltradas)
  
  return (
    <div className="flex flex-wrap gap-1">
      {diasSemana.map((dia) => {
        // Verificar si es el día actual
        const esHoy =
          dia ===
          new Date()
            .toLocaleDateString("es-ES", { weekday: "long" })
            .toLowerCase();

        return (
          <button
            key={dia}
            onClick={() => {
              setDiaSemanaSeleccionado(dia);
              setVolverCargarTareasFiltradas(prev => !prev)
              
            }}
            className={`px-3 py-1 rounded-lg text-xs relative ${
              diaSemanaSeleccionado === dia
                ? "bg-emerald-600 text-white"
                : "bg-black/20 text-white/60 hover:bg-black/30 hover:text-white/80"
            } ${
              esHoy
                ? "ring-2 ring-emerald-400 ring-offset-1 ring-offset-black"
                : ""
            }`}
          >
            {dia.substring(0, 3)}
            {esHoy && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full"></span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default CardDiaSemana;