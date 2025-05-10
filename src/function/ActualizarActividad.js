
const alternarTareaSemanal = (id,setTareasSemana) => {
  setTareasSemana(prev => {
    const nuevasTareas = prev.map((tarea) => {
      if (tarea.id === id) {
        if (!tarea.completada) {
          const tareaActualizada = {
            ...tarea,
            completada: true,
            contadorCompletadas: tarea.contadorCompletadas + 1,
          };
  
          if (typeof window !== "undefined") {
            const fechaHoy = new Date().toISOString().split("T")[0];
            const diaSemana = tarea.dia;
  
            const tareasSemanaDelDia = prev.filter((t) => t.dia === diaSemana);
            const completadas = tareasSemanaDelDia.filter((t) =>
              t.id === id ? true : t.completada
            ).length;
            const porcentaje =
              (completadas / tareasSemanaDelDia.length) * 100;
  
            let datosDias = [];
            const datosAlmacenados = localStorage.getItem("datos-dias-porcentajes");
  
            if (datosAlmacenados) {
              datosDias = JSON.parse(datosAlmacenados);
              const indice = datosDias.findIndex((d) => d.fecha === fechaHoy);
              if (indice >= 0) {
                datosDias[indice].porcentaje = porcentaje;
              } else {
                datosDias.push({ fecha: fechaHoy, porcentaje });
              }
            } else {
              datosDias = [{ fecha: fechaHoy, porcentaje }];
            }
  
            localStorage.setItem("datos-dias-porcentajes", JSON.stringify(datosDias));
          }
  
          return tareaActualizada;
        }
        return tarea;
      }
      return tarea;
    });
  
    return nuevasTareas; // ¡esto es lo que faltaba!
  });
  
  }

  export default alternarTareaSemanal