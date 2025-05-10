 const funcionTareaMiSemana =  {

     iniciarCronometro : function  (valor) {
        if (!/^(0[0-9]|1[0-2]):[0-5][0-9]$/.test(valor)) {
          console.error("Formato inválido. Usa HH:MM (hasta 12:59)");
          return;
        }
      
        const [horas, minutos] = valor.split(':').map(Number);
        let segundosTotales = (horas * 60 + minutos) * 60;
      
        const intervalo = setInterval(() => {
          if (segundosTotales <= 0) {
            clearInterval(intervalo);
            console.log("00:00:00");
            console.log("¡Tiempo finalizado!");
            return;
          }
      
          segundosTotales--;
      
          const h = String(Math.floor(segundosTotales / 3600)).padStart(2, '0');
          const m = String(Math.floor((segundosTotales % 3600) / 60)).padStart(2, '0');
          const s = String(segundosTotales % 60).padStart(2, '0');
      
          console.log(`${h}:${m}:${s}`);
        }, 1000);
      }
}

export default funcionTareaMiSemana