
export function formatearYValidarHora(valor) {
    const soloNumeros = valor.replace(/\D/g, '');
  
    if (soloNumeros.length < 3) {
      return soloNumeros;
    }
  
    const hora = soloNumeros.slice(0, 2);
    const minutos = soloNumeros.slice(2, 4);
  
    const horaNum = parseInt(hora, 10);
    const minNum = parseInt(minutos, 10);
  
    // Validar hora entre 00 y 12, y minutos entre 00 y 59
    if (
      (horaNum < 0 || horaNum > 12) ||
      (minutos.length === 2 && (minNum < 0 || minNum > 59))
    ) {
    }
  
    return `${hora}${minutos.length ? ':' + minutos : ''}`;
  }
  