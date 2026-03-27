const service = require("../services/planes.services");

exports.crearPlan = async (req, res) => {
  try {
    const { tabla, data } = req.body;
    if (!tabla || data === undefined) {
      return res.status(400).json({ message: "'tabla' y 'data' son requeridos" });
    }
    const doc = await service.crearPlan({ tabla, data });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: "Error creando plan", error: err.message });
  }
};

exports.listarPlanes = async (req, res) => {
  try {
    const { tabla, page, limit } = req.query;
    const result = await service.listarPlanes({
      tabla,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error listando planes", error: err.message });
  }
};

exports.obtenerPlan = async (req, res) => {
  try {
    const doc = await service.obtenerPlan(req.params.id);
    if (!doc) return res.status(404).json({ message: "No encontrado" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: "Error obteniendo plan", error: err.message });
  }
};

exports.actualizarPlan = async (req, res) => {
  try {
    const { tabla, data } = req.body;
    const doc = await service.actualizarPlan(req.params.id, { tabla, data });
    if (!doc) return res.status(404).json({ message: "No encontrado" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: "Error actualizando plan", error: err.message });
  }
};

exports.eliminarPlan = async (req, res) => {
  try {
    const doc = await service.eliminarPlan(req.params.id);
    if (!doc) return res.status(404).json({ message: "No encontrado" });
    res.json({ message: "Eliminado", id: doc._id });
  } catch (err) {
    res.status(500).json({ message: "Error eliminando plan", error: err.message });
  }
};

exports.generarPlanes = async (req, res) => {
  try {
    const resultado = await service.generarPlanes();
    res.status(resultado.status).json(resultado);
  } catch (err) {
    res.status(500).json({ message: "Error generando planes", error: err.message });
  }
};
