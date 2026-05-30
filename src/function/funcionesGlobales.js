const funcionesGlobales = {
  obtenerDiaHoy: () => {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    return `${año}-${mes}-${dia}`;
  },

  ObtenerDiaNumeroDelAño: () => {
    const ahora = new Date();
    const inicioAño = new Date(ahora.getFullYear(), 0, 1);
    inicioAño.setHours(0, 0, 0, 0);
    const fechaActual = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    fechaActual.setHours(0, 0, 0, 0);
    const dia = Math.floor((fechaActual.getTime() - inicioAño.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, Math.min(366, dia));
  },

  obtenerNombreDelDia: () => {
    return new Date().toLocaleDateString("es-ES", { weekday: "long" });
  },
};

export default funcionesGlobales;
