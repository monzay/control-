import confetti from 'canvas-confetti'


const funcionesGlobales = {
  
  obtenerDiaHoy: () => {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0"); // +1 porque enero es 0
    const dia = String(hoy.getDate()).padStart(2, "0");
    return `${año}-${mes}-${dia}`;
  },
  ObtenerDiaNumeroDelAño: () => {
    const ahora = new Date();
    const año = ahora.getFullYear();
    // Obtener el 1 de enero del año actual a las 00:00:00
    const inicioAño = new Date(año, 0, 1);
    inicioAño.setHours(0, 0, 0, 0);
    
    // Ajustar la fecha actual a las 00:00:00 para un cálculo preciso
    const fechaActual = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    fechaActual.setHours(0, 0, 0, 0);
    
    // Calcular la diferencia en milisegundos
    const diff = fechaActual.getTime() - inicioAño.getTime();
    
    // Convertir a días (agregar 1 porque el 1 de enero es el día 1, no 0)
    const unDia = 1000 * 60 * 60 * 24;
    const dia = Math.floor(diff / unDia) + 1;
    
    // Asegurar que el valor sea válido (entre 1 y 366)
    return Math.max(1, Math.min(366, dia));
  },
  // aun no estan siendo usadas
  iniciarCronometro: function (valor) {
    if (!/^(0[0-9]|1[0-2]):[0-5][0-9]$/.test(valor)) {
      console.error("Formato inválido. Usa HH:MM (hasta 12:59)");
      return;
    }

    const [horas, minutos] = valor.split(":").map(Number);
    let segundosTotales = (horas * 60 + minutos) * 60;

    const intervalo = setInterval(() => {
      if (segundosTotales <= 0) {
        clearInterval(intervalo);
        console.log("00:00:00");
        console.log("¡Tiempo finalizado!");
        return;
      }

      segundosTotales--;

      const h = String(Math.floor(segundosTotales / 3600)).padStart(2, "0");
      const m = String(Math.floor((segundosTotales % 3600) / 60)).padStart(
        2,
        "0"
      );
      const s = String(segundosTotales % 60).padStart(2, "0");

      console.log(`${h}:${m}:${s}`);
    }, 1000);
  },
  AnimacionModulo : ()=>  {
    lanzarConfeti: () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10B981", "#10B981", "#10B981"],
      })
    }
  },
  formatearYValidarHora: (valor) =>  {
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
  },
   obtenerNombreDelDia : () => {
    const hoy = new Date();
    const opciones = { weekday: 'long' };
    return hoy.toLocaleDateString('es-ES', opciones); // devuelve por ejemplo "jueves"
  },
};


export default funcionesGlobales;
