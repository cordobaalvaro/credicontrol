const {
  procesarCobroBD,
  editarRegistroCobroBD,
  eliminarRegistroCobroBD,
  crearRegistroCobroBD,
} = require("../services/admin.services");

const procesarCobro = async (req, res) => {
  try {
    const adminId = req.idUsuario;
    const { prestamoId, monto, fechaPago, tablaId } = req.body;

    if (!prestamoId || !monto) {
      return res.status(400).json({
        msg: "Faltan campos obligatorios: prestamoId, monto",
        data: null,
      });
    }

    const { status, msg, data } = await procesarCobroBD(
      prestamoId,
      monto,
      adminId,
      fechaPago,
      tablaId
    );
    res.status(status).json({ msg, data });
  } catch (error) {
    res.status(500).json({ msg: error.message, data: null });
  }
};



const editarRegistroCobro = async (req, res) => {
  try {
    const { prestamoId, registroId } = req.params;
    const { monto, fecha, fechaPago, horaPago, cuota } = req.body;

    const fechaReal = fecha || fechaPago;

    if (!prestamoId || !registroId) {
      return res.status(400).json({
        msg: "PrestamoId y registroId son requeridos en los parámetros",
        data: null,
      });
    }

    const { status, msg, data } = await editarRegistroCobroBD(
      prestamoId,
      registroId,
      monto,
      fechaReal,
      horaPago,
      cuota
    );

    res.status(status).json({ msg, data });
  } catch (error) {
    res.status(500).json({ msg: error.message, data: null });
  }
};

const eliminarRegistroCobro = async (req, res) => {
  try {
    const { prestamoId, registroId } = req.params;

    if (!prestamoId || !registroId) {
      return res.status(400).json({
        msg: "PrestamoId y registroId son requeridos en los parámetros",
        data: null,
      });
    }

    const { status, msg, data } = await eliminarRegistroCobroBD(
      prestamoId,
      registroId
    );

    res.status(status).json({ msg, data });
  } catch (error) {
    res.status(500).json({ msg: error.message, data: null });
  }
};

const crearRegistroCobro = async (req, res) => {
  try {
    const { prestamoId } = req.params;
    const { monto, fecha, fechaPago, horaPago, cuota } = req.body;

    const fechaReal = fecha || fechaPago;

    if (!prestamoId) {
      return res.status(400).json({
        msg: "PrestamoId es requerido en los parámetros",
        data: null,
      });
    }

    if (!monto) {
      return res.status(400).json({
        msg: "Monto es requerido",
        data: null,
      });
    }

    const { status, msg, data } = await crearRegistroCobroBD(
      prestamoId,
      monto,
      fechaReal,
      horaPago,
      cuota
    );

    res.status(status).json({ msg, data });
  } catch (error) {
    res.status(500).json({ msg: error.message, data: null });
  }
};



module.exports = {
  procesarCobro,
  editarRegistroCobro,
  eliminarRegistroCobro,
  crearRegistroCobro,
};
