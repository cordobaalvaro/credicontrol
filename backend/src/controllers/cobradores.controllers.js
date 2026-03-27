const {
  obtenerMisZonasBD,
} = require("../services/cobradores.services");

const obtenerMisZonas = async (req, res) => {
  try {
    const cobradorId = req.idUsuario;

    if (!cobradorId) {
      return res.status(400).json({
        msg: "ID del cobrador es requerido",
        data: null,
      });
    }

    const { status, msg, data } = await obtenerMisZonasBD(cobradorId);
    res.status(status).json({ msg, data });
  } catch (error) {
    res.status(500).json({ msg: error.message, data: null });
  }
};



module.exports = {
  obtenerMisZonas,
};
