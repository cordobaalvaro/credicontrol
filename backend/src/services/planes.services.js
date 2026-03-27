const Plan = require("../models/planes.model");

async function crearPlan({ tabla, data }) {
  return await Plan.create({ tabla, data });
}

async function listarPlanes({ tabla, page = 1, limit = 50 }) {
  const query = tabla ? { tabla } : {};
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Plan.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Plan.countDocuments(query),
  ]);
  return { items, total, page, pages: Math.ceil(total / limit) };
}

async function obtenerPlan(id) {
  return await Plan.findById(id);
}

async function actualizarPlan(id, { data, tabla }) {
  return await Plan.findByIdAndUpdate(
    id,
    {
      ...(tabla !== undefined ? { tabla } : {}),
      ...(data !== undefined ? { data } : {}),
    },
    { new: true }
  );
}

async function eliminarPlan(id) {
  return await Plan.findByIdAndDelete(id);
}

async function generarPlanes() {
  try {
    const planesPorFrecuencia = {
      "tabla-semanal": {
        title: "ACTIVA SEMANAL",
        montos: [20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000],
        planes: [
          {
            nombre: "Plan 1",
            filas: [
              { semanas: 5, monto: 6000 },
              { semanas: 5, monto: 9000 },
              { semanas: 5, monto: 12000 },
              { semanas: 5, monto: 15000 },
              { semanas: 5, monto: 18000 },
              { semanas: 5, monto: 21000 },
              { semanas: 5, monto: 24000 },
              { semanas: 5, monto: 27000 },
              { semanas: 5, monto: 30000 },
            ],
          },
          {
            nombre: "Plan 2",
            filas: [
              { semanas: 5, monto: 5500 },
              { semanas: 5, monto: 8000 },
              { semanas: 5, monto: 11000 },
              { semanas: 5, monto: 13500 },
              { semanas: 5, monto: 16000 },
              { semanas: 5, monto: 19000 },
              { semanas: 5, monto: 21500 },
              { semanas: 5, monto: 24000 },
              { semanas: 5, monto: 27000 },
            ],
          },
          {
            nombre: "Plan 3",
            filas: [
              { semanas: 5, monto: 4300 },
              { semanas: 5, monto: 6500 },
              { semanas: 5, monto: 9000 },
              { semanas: 5, monto: 11000 },
              { semanas: 5, monto: 13000 },
              { semanas: 5, monto: 15500 },
              { semanas: 5, monto: 17500 },
              { semanas: 5, monto: 19500 },
              { semanas: 5, monto: 21500 },
            ],
          },
          {
            nombre: "Plan 4",
            filas: [
              { semanas: 5, monto: 3700 },
              { semanas: 5, monto: 5500 },
              { semanas: 5, monto: 7500 },
              { semanas: 5, monto: 9500 },
              { semanas: 5, monto: 11000 },
              { semanas: 5, monto: 13000 },
              { semanas: 5, monto: 15000 },
              { semanas: 5, monto: 16600 },
              { semanas: 5, monto: 18500 },
            ],
          },
        ],
      },
      "tabla-quincenal": {
        title: "ACTIVA QUINCENAL",
        montos: [20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000],
        planes: [
          {
            nombre: "Plan 1",
            filas: [
              { semanas: 5, monto: 6000 },
              { semanas: 5, monto: 9000 },
              { semanas: 5, monto: 12000 },
              { semanas: 5, monto: 15000 },
              { semanas: 5, monto: 18000 },
              { semanas: 5, monto: 21000 },
              { semanas: 5, monto: 24000 },
              { semanas: 5, monto: 27000 },
              { semanas: 5, monto: 30000 },
            ],
          },
          {
            nombre: "Plan 2",
            filas: [
              { semanas: 5, monto: 5500 },
              { semanas: 5, monto: 8000 },
              { semanas: 5, monto: 11000 },
              { semanas: 5, monto: 13500 },
              { semanas: 5, monto: 16000 },
              { semanas: 5, monto: 19000 },
              { semanas: 5, monto: 21500 },
              { semanas: 5, monto: 24000 },
              { semanas: 5, monto: 27000 },
            ],
          },
          {
            nombre: "Plan 3",
            filas: [
              { semanas: 5, monto: 4300 },
              { semanas: 5, monto: 6500 },
              { semanas: 5, monto: 9000 },
              { semanas: 5, monto: 11000 },
              { semanas: 5, monto: 13000 },
              { semanas: 5, monto: 15500 },
              { semanas: 5, monto: 17500 },
              { semanas: 5, monto: 19500 },
              { semanas: 5, monto: 21500 },
            ],
          },
          {
            nombre: "Plan 4",
            filas: [
              { semanas: 5, monto: 3700 },
              { semanas: 5, monto: 5500 },
              { semanas: 5, monto: 7500 },
              { semanas: 5, monto: 9500 },
              { semanas: 5, monto: 11000 },
              { semanas: 5, monto: 13000 },
              { semanas: 5, monto: 15000 },
              { semanas: 5, monto: 16600 },
              { semanas: 5, monto: 18500 },
            ],
          },
        ],
      },
      "tabla-mensual": {
        title: "ACTIVA MENSUAL",
        montos: [20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000],
        planes: [
          {
            nombre: "Plan 1",
            filas: [
              { semanas: 5, monto: 6000 },
              { semanas: 5, monto: 9000 },
              { semanas: 5, monto: 12000 },
              { semanas: 5, monto: 15000 },
              { semanas: 5, monto: 18000 },
              { semanas: 5, monto: 21000 },
              { semanas: 5, monto: 24000 },
              { semanas: 5, monto: 27000 },
              { semanas: 5, monto: 30000 },
            ],
          },
          {
            nombre: "Plan 2",
            filas: [
              { semanas: 5, monto: 5500 },
              { semanas: 5, monto: 8000 },
              { semanas: 5, monto: 11000 },
              { semanas: 5, monto: 13500 },
              { semanas: 5, monto: 16000 },
              { semanas: 5, monto: 19000 },
              { semanas: 5, monto: 21500 },
              { semanas: 5, monto: 24000 },
              { semanas: 5, monto: 27000 },
            ],
          },
          {
            nombre: "Plan 3",
            filas: [
              { semanas: 5, monto: 4300 },
              { semanas: 5, monto: 6500 },
              { semanas: 5, monto: 9000 },
              { semanas: 5, monto: 11000 },
              { semanas: 5, monto: 13000 },
              { semanas: 5, monto: 15500 },
              { semanas: 5, monto: 17500 },
              { semanas: 5, monto: 19500 },
              { semanas: 5, monto: 21500 },
            ],
          },
          {
            nombre: "Plan 4",
            filas: [
              { semanas: 5, monto: 3700 },
              { semanas: 5, monto: 5500 },
              { semanas: 5, monto: 7500 },
              { semanas: 5, monto: 9500 },
              { semanas: 5, monto: 11000 },
              { semanas: 5, monto: 13000 },
              { semanas: 5, monto: 15000 },
              { semanas: 5, monto: 16600 },
              { semanas: 5, monto: 18500 },
            ],
          },
        ],
      },
    };

    const resultados = [];

    for (const [tabla, datos] of Object.entries(planesPorFrecuencia)) {
      const existente = await Plan.findOne({ tabla });

      if (!existente) {
        const nuevo = await Plan.create({ tabla, data: datos });
        resultados.push({
          tabla,
          accion: "creada",
          id: nuevo._id,
          message: `Tabla ${tabla} creada exitosamente`,
        });
      } else {
        resultados.push({
          tabla,
          accion: "existente",
          id: existente._id,
          message: `Tabla ${tabla} ya existe`,
        });
      }
    }

    return {
      status: 200,
      message: "Proceso de generación de planes completado",
      resultados,
    };
  } catch (error) {
    console.error("Error en generarPlanes:", error);
    return {
      status: 500,
      message: "Error al generar planes",
      error: error.message,
    };
  }
}

module.exports = {
  crearPlan,
  listarPlanes,
  obtenerPlan,
  actualizarPlan,
  eliminarPlan,
  generarPlanes,
};
