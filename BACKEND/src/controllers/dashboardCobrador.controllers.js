const {
  obtenerInfoCobrador,
  obtenerMetricasDia,
  obtenerResumenSemanal,
  obtenerProximosACobrar,
  obtenerMisZonas,
  obtenerInfoClientesPrestamos,
  obtenerDashboardCobrador,
  obtenerPrestamosActivos,
  obtenerPrestamosVencidos
} = require("../services/dashboardCobrador.services");


const getInfoCobrador = async (req, res) => {
  try {
    const cobradorId = req.idUsuario;
    
    if (!cobradorId) {
      return res.status(400).json({
        status: 400,
        msg: "ID del cobrador no encontrado en el token",
        data: null
      });
    }

    const resultado = await obtenerInfoCobrador(cobradorId);
    return res.status(resultado.status).json(resultado);
  } catch (error) {
    console.error("Error en controller getInfoCobrador:", error);
    return res.status(500).json({
      status: 500,
      msg: "Error interno del servidor al obtener información del cobrador",
      data: null
    });
  }
};


const getMetricasDia = async (req, res) => {
  try {
    const cobradorId = req.idUsuario;
    
    if (!cobradorId) {
      return res.status(400).json({
        status: 400,
        msg: "ID del cobrador no encontrado en el token",
        data: null
      });
    }

    const resultado = await obtenerMetricasDia(cobradorId);
    return res.status(resultado.status).json(resultado);
  } catch (error) {
    console.error("Error en controller getMetricasDia:", error);
    return res.status(500).json({
      status: 500,
      msg: "Error interno del servidor al obtener métricas del día",
      data: null
    });
  }
};


const getResumenSemanal = async (req, res) => {
  try {
    const cobradorId = req.idUsuario;
    
    if (!cobradorId) {
      return res.status(400).json({
        status: 400,
        msg: "ID del cobrador no encontrado en el token",
        data: null
      });
    }

    const resultado = await obtenerResumenSemanal(cobradorId);
    return res.status(resultado.status).json(resultado);
  } catch (error) {
    console.error("Error en controller getResumenSemanal:", error);
    return res.status(500).json({
      status: 500,
      msg: "Error interno del servidor al obtener resumen semanal",
      data: null
    });
  }
};


const getProximosACobrar = async (req, res) => {
  try {
    const cobradorId = req.idUsuario;
    
    if (!cobradorId) {
      return res.status(400).json({
        status: 400,
        msg: "ID del cobrador no encontrado en el token",
        data: []
      });
    }

    const resultado = await obtenerProximosACobrar(cobradorId);
    return res.status(resultado.status).json(resultado);
  } catch (error) {
    console.error("Error en controller getProximosACobrar:", error);
    return res.status(500).json({
      status: 500,
      msg: "Error interno del servidor al obtener próximos a cobrar",
      data: []
    });
  }
};



const getDashboardCobrador = async (req, res) => {
  try {
    const cobradorId = req.idUsuario;
    
    if (!cobradorId) {
      return res.status(400).json({
        status: 400,
        msg: "ID del cobrador no encontrado en el token",
        data: null
      });
    }

    const resultado = await obtenerDashboardCobrador(cobradorId);
    return res.status(resultado.status).json(resultado);
  } catch (error) {
    console.error("Error en controller getDashboardCobrador:", error);
    return res.status(500).json({
      status: 500,
      msg: "Error interno del servidor al obtener dashboard del cobrador",
      data: null
    });
  }
};


const getMisZonas = async (req, res) => {
  try {
    const cobradorId = req.idUsuario;
    
    if (!cobradorId) {
      return res.status(400).json({
        status: 400,
        msg: "ID del cobrador no encontrado en el token",
        data: null
      });
    }

    const resultado = await obtenerMisZonas(cobradorId);
    return res.status(resultado.status).json(resultado);
  } catch (error) {
    console.error("Error en controller getMisZonas:", error);
    return res.status(500).json({
      status: 500,
      msg: "Error interno del servidor al obtener zonas del cobrador",
      data: null
    });
  }
};


const getInfoClientesPrestamos = async (req, res) => {
  try {
    const cobradorId = req.idUsuario;
    
    if (!cobradorId) {
      return res.status(400).json({
        status: 400,
        msg: "ID del cobrador no encontrado en el token",
        data: null
      });
    }

    const resultado = await obtenerInfoClientesPrestamos(cobradorId);
    return res.status(resultado.status).json(resultado);
  } catch (error) {
    console.error("Error en controller getInfoClientesPrestamos:", error);
    return res.status(500).json({
      status: 500,
      msg: "Error interno del servidor al obtener información de clientes y préstamos nuevos",
      data: null
    });
  }
};


const getPrestamosActivos = async (req, res) => {
  try {
    const cobradorId = req.idUsuario;
    const response = await obtenerPrestamosActivos(cobradorId);
    res.status(response.status).json(response);
  } catch (error) {
    console.error("Error en getPrestamosActivos:", error);
    res.status(500).json({ status: 500, msg: "Error del servidor" });
  }
};


const getPrestamosVencidos = async (req, res) => {
  try {
    const cobradorId = req.idUsuario;
    const response = await obtenerPrestamosVencidos(cobradorId);
    res.status(response.status).json(response);
  } catch (error) {
    console.error("Error en getPrestamosVencidos:", error);
    res.status(500).json({ status: 500, msg: "Error del servidor" });
  }
};

module.exports = {
  getInfoCobrador,
  getMetricasDia,
  getResumenSemanal,
  getProximosACobrar,
  getMisZonas,
  getInfoClientesPrestamos,
  getDashboardCobrador,
  getPrestamosActivos,
  getPrestamosVencidos
};
