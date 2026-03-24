const cron = require("node-cron");
const { actualizarPrestamos } = require("../services/prestamos.services");


const DEFAULT_SCHEDULE = "0 0 * * *"; 
const SCHEDULE = process.env.PRESTAMOS_CRON || DEFAULT_SCHEDULE;

cron.schedule(SCHEDULE, async () => {
  try {
    await actualizarPrestamos();
  } catch (err) {
    console.error("Error en tarea de actualización de préstamos:", err);
  }
});
