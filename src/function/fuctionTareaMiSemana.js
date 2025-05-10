const  funcionesTareasMiSemana = {
    delete:(id,setTareasSemana,editandoTareaSemanal,setEditandoTareaSemanal) => {
      setTareasSemana(prev => prev .filter((tarea) => tarea.id !== id))
      if (editandoTareaSemanal?.id === id) {
        setEditandoTareaSemanal(null)
      }
    },
    update:  (editandoTareaSemanal,setTareasSemana,setEditandoTareaSemanal) => {
      if (!editandoTareaSemanal) return
      setTareasSemana((prev) =>
        prev.map((tarea) => (tarea.id === editandoTareaSemanal.id ? editandoTareaSemanal : tarea)),
      )
  
      setEditandoTareaSemanal(null)
    }
  ,
    otrasFunciones:{
     iniciarTemporizadorTarea : (tarea,setTareaTemporizador,setMostrarModalTemporizador) => {
      setTareaTemporizador(tarea)
      setMostrarModalTemporizador(true)
    }
    }
  }


export default funcionesTareasMiSemana