const UsuarioModulo = {
    calcularReputacion: (usuario) => {
      // Calcular reputación basada en tareas completadas vs no completadas
      const tareasTotal = usuario.tareasCompletadas + usuario.tareasPerdidas
      if (tareasTotal === 0) return 50 // Reputación neutral por defecto
  
      return Math.round((usuario.tareasCompletadas / tareasTotal) * 100)
    },
  
    actualizarReputacionUsuario: (idUsuario, completada, usuarios, setUsuarios) => {
      if (!usuarios || usuarios.length === 0 || !idUsuario) return
  
      setUsuarios(
        usuarios.map((usuario) => {
          if (usuario.id === idUsuario) {
            const usuarioActualizado = {
              ...usuario,
              tareasCompletadas: completada ? usuario.tareasCompletadas + 1 : usuario.tareasCompletadas,
              tareasPerdidas: !completada ? usuario.tareasPerdidas + 1 : usuario.tareasPerdidas,
            }
  
            // Recalcular reputación
            const reputacion = UsuarioModulo.calcularReputacion(usuarioActualizado)
            return {
              ...usuarioActualizado,
              reputacion,
            }
          }
          return usuario
        }),
      )
    },
  }


  export default UsuarioModulo