import { useEffect, useState, useRef } from "react";

function Temporizador({ tareaId ,setMostrarModalTemporizador}) {
    
  const [segundosRestantes, setSegundosRestantes] = useState(0);
  const [activo, setActivo] = useState(false);
  const intervaloRef = useRef(null);

  // Convierte "HH:MM" a segundos
  const convertirAHHMMaSegundos = (valor) => {
    const esValido = /^(0[0-9]|1[0-2]):[0-5][0-9]$/.test(valor);
    if (!esValido) {
      console.error("Formato inválido. Usa HH:MM (hasta 12:59)");
      return 0;
    }
    const [horas, minutos] = valor.split(":").map(Number);
    return (horas * 60 + minutos) * 60;
  };

  const inicializarTemporizador = () => {
    const duracion = convertirAHHMMaSegundos(tareaId.duracion);
    setSegundosRestantes(duracion);
    setActivo(false);
    limpiarIntervalo();
  };

  const limpiarIntervalo = () => {
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }
  };

  useEffect(() => {
    inicializarTemporizador();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tareaId.duracion]);

  useEffect(() => {
    if (activo && segundosRestantes > 0) {
      intervaloRef.current = setInterval(() => {
        setSegundosRestantes((prev) => prev - 1);
      }, 1000);
    } else {
      limpiarIntervalo();
    }

    return limpiarIntervalo;
  }, [activo]);

  useEffect(() => {
    if (segundosRestantes <= 0 && activo) {
      setActivo(false);
      console.log("¡Tiempo finalizado!");
    }
  }, [segundosRestantes, activo]);

  const formatearTiempo = (seg) => {
    const h = String(Math.floor(seg / 3600)).padStart(2, "0");
    const m = String(Math.floor((seg % 3600) / 60)).padStart(2, "0");
    const s = String(seg % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="absolute z-[1000] inset-0 flex flex-col items-center justify-center text-center bg-black/70 text-white">
     <button onClick={()=> setMostrarModalTemporizador(false)}>salir</button>
      <h1 className="text-5xl font-mono mb-4">{formatearTiempo(segundosRestantes)}</h1>
      <div className="flex gap-4">
        <button onClick={() => setActivo(true)} className="bg-green-600 px-4 py-2 rounded">
          ▶️ Play
        </button>
        <button onClick={() => setActivo(false)} className="bg-yellow-500 px-4 py-2 rounded">
          ⏸️ Pause
        </button>
        <button onClick={inicializarTemporizador} className="bg-red-600 px-4 py-2 rounded">
          🔄 Reset
        </button>
      </div>
    </div>
  );
}

export default Temporizador;
