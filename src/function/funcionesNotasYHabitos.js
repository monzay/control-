const funcionesHabitosYNotas = {
    add :  (nuevaTarea,setTareas,setFechasImportantes) => {
      setTareas([...tareas, nuevaTarea])
      // Si tiene fecha de finalización, crear una fecha importante
      if (nuevaTarea.fechaFin) {
        const nuevaFecha = {
          id: `tarea-fin-${nuevaTarea.id}`,
          fecha: nuevaTarea.fechaFin,
          titulo: `Fin de ${nuevaTarea.tipo === "habito" ? "hábito" : "nota"}: ${nuevaTarea.titulo}`,
          tipo: nuevaTarea.tipo === "habito" ? "habito-fin" : "nota",
          color: "bg-emerald-500",
          idTarea: nuevaTarea.id,
        }
        setFechasImportantes([...fechasImportantes, nuevaFecha])
      }
    },
    delete: (id,setTareas,setFechasImportantes,setTareasSemana,tareaSeleccionada,editandoTarea) => {
      setTareas(tareas.filter((tarea) => tarea.id !== id))
      // Eliminar también las fechas importantes asociadas
      setFechasImportantes(prev =>    prev.filter((fecha) => fecha.idTarea !== id))
      // Eliminar tareas semanales asociadas
      setTareasSemana(prev => prev.filter((tarea) => tarea.idTarea !== id))
  
      if (tareaSeleccionada?.id === id) {
        setTareaSeleccionada(null)
      }
      if (editandoTarea?.id === id) {
        setEditandoTarea(null)
      }
    },
    update:(
      tareaActualizada,
      setFechasImportantes,
      setTareas,
      setTareasSemana,
      setEditandoTarea
    ) => {
      // Actualizar fechas importantes si cambió la fecha de finalización
      if (tareaActualizada.fechaFin !== undefined) {
        // Eliminar fecha importante anterior
        setFechasImportantes((prev) =>
          prev.filter((fecha) => fecha.idTarea !== tareaActualizada.id)
        );
    
        // Crear nueva fecha importante si hay fecha de finalización
        if (tareaActualizada.fechaFin) {
          const nuevaFecha = {
            id: `tarea-fin-${tareaActualizada.id}`,
            fecha: tareaActualizada.fechaFin,
            titulo: `Fin de ${tareaActualizada.tipo === "habito" ? "hábito" : "nota"}: ${tareaActualizada.titulo}`,
            tipo: tareaActualizada.tipo === "habito" ? "habito-fin" : "nota",
            color: "bg-emerald-500",
            idTarea: tareaActualizada.id,
          };
          setFechasImportantes((prev) => [...prev, nuevaFecha]);
        }
      }
    
      // Actualizar la tarea
      setTareas((prev) =>
        prev.map((tarea) =>
          tarea.id === tareaActualizada.id ? tareaActualizada : tarea
        )
      );
    
      // Actualizar tareas semanales relacionadas
      setTareasSemana((prev) =>
        prev.map((tareaSemanal) =>
          tareaSemanal.idTarea === tareaActualizada.id
            ? { ...tareaSemanal, titulo: tareaActualizada.titulo }
            : tareaSemanal
        )
      );
    
      // Salir del modo edición
      setEditandoTarea(null);
    },
    otrasFunciones:{
      iniciarEditarTarea: (tarea,setEditandoTarea) => {
        setEditandoTarea({ ...tarea })
      }
    }
  }
  

export default funcionesHabitosYNotas