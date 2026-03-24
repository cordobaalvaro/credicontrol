const {
  crearClienteBD,
  obtenerClientesBD,
  obtenerClientePorIdBD,
  obtenerClientePorDNIBD,
  actualizarClienteBD,
  eliminarClienteBD,
  marcarClienteInactivoBD,
  marcarClienteActivoBD,
  repasarTiposDeClientes,
  obtenerClientesPorTipoBD,
  obtenerRazonTipoClienteBD,
  obtenerResumenClienteBD,
} = require("../services/clientes.services");

const crearCliente = async (req, res) => {
  try {
    const { status, msg, data } = await crearClienteBD(req.body);
    res.status(status).json({ msg, data });
  } catch (error) {
    res.status(500).json({ msg: error.message, data: null });
  }
};

const recalcularTiposClientes = async (req, res) => {
  try {
    const { status, msg, data } = await repasarTiposDeClientes();
    res.status(status).json({ msg, data });
  } catch (error) {
    res.status(500).json({ msg: error.message, data: null });
  }
};

const obtenerClientesPorTipo = async (req, res) => {
  try {
    const { tipo } = req.query;
    const { status, msg, data } = await obtenerClientesPorTipoBD(tipo);
    res.status(status).json({ msg, data });
  } catch (error) {
    res.status(500).json({ msg: error.message, data: null });
  }
};

const obtenerRazonTipoCliente = async (req, res) => {
  try {
    const { status, msg, data } = await obtenerRazonTipoClienteBD(req.params.id);
    res.status(status).json({ msg, data });
  } catch (error) {
    res.status(500).json({ msg: error.message, data: null });
  }
};

const marcarClienteInactivo = async (req, res) => {
  try {
    const { status, msg, data } = await marcarClienteInactivoBD(req.params.id);
    res.status(status).json({ msg, data });
  } catch (error) {
    res.status(500).json({ msg: error.message, data: null });
  }
};

const marcarClienteActivo = async (req, res) => {
  try {
    const { status, msg, data } = await marcarClienteActivoBD(req.params.id);
    res.status(status).json({ msg, data });
  } catch (error) {
    res.status(500).json({ msg: error.message, data: null });
  }
};

const obtenerClientes = async (req, res) => {
  try {
    const filtros = { ...req.query };
    const { status, msg, data } = await obtenerClientesBD(filtros);
    res.status(status).json({ msg, data });
  } catch (error) {
    res.status(500).json({ msg: error.message, data: null });
  }
};

const obtenerClientePorId = async (req, res) => {
  try {
    const { status, msg, data } = await obtenerClientePorIdBD(req.params.id);
    res.status(status).json({ msg, data });
  } catch (error) {
    res.status(500).json({ msg: error.message, data: null });
  }
};

const obtenerClientePorDNI = async (req, res) => {
  try {
    const { status, msg, data } = await obtenerClientePorDNIBD(req.params.dni);
    res.status(status).json({ msg, data });
  } catch (error) {
    res.status(500).json({ msg: error.message, data: null });
  }
};

const actualizarCliente = async (req, res) => {
  try {
    const { status, msg, data } = await actualizarClienteBD(
      req.params.id,
      req.body
    );
    res.status(status).json({ msg, data });
  } catch (error) {
    res.status(500).json({ msg: error.message, data: null });
  }
};

const eliminarCliente = async (req, res) => {
  try {
    const { status, msg, data } = await eliminarClienteBD(req.params.id);
    res.status(status).json({ msg, data });
  } catch (error) {
    res.status(500).json({ msg: error.message, data: null });
  }
};

const obtenerResumenCliente = async (req, res) => {
  try {
    const { status, msg, data } = await obtenerResumenClienteBD(req.params.id);
    res.status(status).json({ msg, data });
  } catch (error) {
    res.status(500).json({ msg: error.message, data: null });
  }
};

module.exports = {
  crearCliente,
  obtenerClientes,
  obtenerClientePorId,
  obtenerClientePorDNI,
  actualizarCliente,
  eliminarCliente,
  marcarClienteInactivo,
  marcarClienteActivo,
  recalcularTiposClientes,
  obtenerClientesPorTipo,
  obtenerRazonTipoCliente,
  obtenerResumenCliente,
};
