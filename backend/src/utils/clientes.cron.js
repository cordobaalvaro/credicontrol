const cron = require("node-cron");
const { repasarTiposDeClientes } = require("../services/clientes.services");


const DEFAULT_SCHEDULE = "0 3 * * *";
const SCHEDULE = process.env.CLIENTES_TIPO_CRON || DEFAULT_SCHEDULE;

cron.schedule(SCHEDULE, async () => {
  try {
    console.log(`⏰ Ejecutando repaso de tipos de clientes (cron: ${SCHEDULE})`);
    const resultado = await repasarTiposDeClientes();
    if (resultado) {
      console.log(
        `✅ Tipos de clientes repasados: procesados=${resultado.data?.procesados}, actualizados=${resultado.data?.actualizados}`
      );
    }
  } catch (err) {
    console.error("Error en tarea de repaso de tipos de clientes:", err);
  }
});
