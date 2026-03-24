const { gastoService } = require('../services/gasto.services');

const crearNuevoGasto = async (req, res) => {
    try {
        const { monto, tipo, descripcion, fecha } = req.body;
        
        const registradoPor = req.idUsuario || null;

        const resultado = await gastoService.crearGasto({
            monto,
            tipo,
            descripcion,
            fecha,
            registradoPor
        });

        return res.status(resultado.status).json(resultado);
    } catch (error) {
        console.error("Controlador: Error al crear gasto:", error);
        return res.status(500).json({ status: false, msg: "Error interno del servidor al crear gasto." });
    }
};

const listarGastos = async (req, res) => {
    try {
        const { fechaInicio, fechaFin, tipo } = req.query;

        const filtros = {};
        if (fechaInicio) filtros.fechaInicio = fechaInicio;
        if (fechaFin) filtros.fechaFin = fechaFin;
        if (tipo) filtros.tipo = tipo;

        const resultado = await gastoService.obtenerGastos(filtros);

        return res.status(resultado.status).json(resultado);
    } catch (error) {
        console.error("Controlador: Error al listar gastos:", error);
        return res.status(500).json({ status: false, msg: "Error interno del servidor al listar gastos." });
    }
};

const obtenerGasto = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await gastoService.obtenerGastoPorId(id);

        return res.status(resultado.status).json(resultado);
    } catch (error) {
        console.error("Controlador: Error al obtener gasto:", error);
        return res.status(500).json({ status: false, msg: "Error interno del servidor al obtener gasto." });
    }
};

const modificarGasto = async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizados = req.body;

        const resultado = await gastoService.actualizarGasto(id, datosActualizados);

        return res.status(resultado.status).json(resultado);
    } catch (error) {
        console.error("Controlador: Error al modificar gasto:", error);
        return res.status(500).json({ status: false, msg: "Error interno del servidor al modificar gasto." });
    }
};

const borrarGasto = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await gastoService.eliminarGasto(id);

        return res.status(resultado.status).json(resultado);
    } catch (error) {
        console.error("Controlador: Error al borrar gasto:", error);
        return res.status(500).json({ status: false, msg: "Error interno del servidor al borrar gasto." });
    }
};

module.exports = {
    crearNuevoGasto,
    listarGastos,
    obtenerGasto,
    modificarGasto,
    borrarGasto
};
