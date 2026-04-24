const cron = require("node-cron");
const { actualizarPrestamos } = require("../services/prestamos.services");

const DEFAULT_SCHEDULE = "0 0 * * *";
const SCHEDULE = process.env.PRESTAMOS_CRON || DEFAULT_SCHEDULE;

/**
 * Función que encapsula la lógica de actualización para poder ser llamada
 * tanto por el cron como manualmente o al iniciar el servidor.
 */
const ejecutarActualizacionPrestamos = async () => {
  console.log("🔄 Iniciando tarea de actualización de préstamos...");
  try {
    const inicio = Date.now();
    await actualizarPrestamos();
    const duracion = (Date.now() - inicio) / 1000;
    console.log(`✅ Tarea de actualización de préstamos completada (${duracion}s)`);
  } catch (err) {
    console.error("❌ Error en tarea de actualización de préstamos:", err);
  }
};

// Programar la tarea cron
cron.schedule(SCHEDULE, ejecutarActualizacionPrestamos);

// Ejecutar inmediatamente al arrancar el backend
ejecutarActualizacionPrestamos();

module.exports = { ejecutarActualizacionPrestamos };
