import { useEffect, useState, useRef } from "react";
import { X, Play, Pause, RotateCcw } from "lucide-react";

function Temporizador({ tareaId, setMostrarModalTemporizador }) {
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
      // Aquí podrías mostrar una notificación visual
    }
  }, [segundosRestantes, activo]);

  const formatearTiempo = (seg) => {
    const h = String(Math.floor(seg / 3600)).padStart(2, "0");
    const m = String(Math.floor((seg % 3600) / 60)).padStart(2, "0");
    const s = String(seg % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // Para el progreso circular
  const duracionTotal = convertirAHHMMaSegundos(tareaId.duracion);
  const progreso = duracionTotal > 0 ? (1 - segundosRestantes / duracionTotal) : 0;
  const radio = 70;
  const circunferencia = 2 * Math.PI * radio;
  const offset = circunferencia * (1 - progreso);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative  px-10 py-10 max-w-sm w-full flex flex-col items-center glassmorphism transition-all duration-300 animate-fade-in-up">
        {/* Botón cerrar */}
        <button
          onClick={() => setMostrarModalTemporizador(false)}
          className="absolute top-4 right-4 text-white/70 hover:text-emerald-400 transition-colors p-2 rounded-full focus:outline-none bg-black/30 backdrop-blur-md"
          title="Cerrar"
        >
          <X className="w-6 h-6" />
        </button>
        {/* Progreso circular y tiempo */}
        <div className="relative flex items-center justify-center mb-4">
          <svg width={160} height={160} className="block">
            <circle
              cx={80}
              cy={80}
              r={radio}
              fill="none"
              stroke="#2226"
              strokeWidth={10}
            />
            <circle
              cx={80}
              cy={80}
              r={radio}
              fill="none"
              stroke="#34d399"
              strokeWidth={10}
              strokeDasharray={circunferencia}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s cubic-bezier(.4,2,.6,1)' }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-5xl md:text-6xl font-mono  ">
            {formatearTiempo(segundosRestantes)}
          </span>
        </div>
        <div className="flex gap-4 mt-2">
          <button
            onClick={() => setActivo(true)}
            className="bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-600 hover:to-emerald-500 text-white px-6 py-2.5 rounded-full shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 font-semibold text-base"
            disabled={activo || segundosRestantes === 0}
            title="Iniciar"
          >
            <Play className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActivo(false)}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white px-6 py-2.5 rounded-full shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 font-semibold text-base"
            disabled={!activo}
            title="Pausar"
          >
            <Pause className="w-5 h-5" />
          </button>
          <button
            onClick={inicializarTemporizador}
            className="bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white px-6 py-2.5 rounded-full shadow-lg transition-all flex items-center gap-2 font-semibold text-base"
            title="Reiniciar"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
      <style jsx>{`
 
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(.4,2,.6,1);
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.7s cubic-bezier(.4,2,.6,1);
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2.5s infinite;
        }
      `}</style>
    </div>
  );
}

export default Temporizador;
