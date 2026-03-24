const Gasto = require('../models/gasto.model');

const gastoService = {
    crearGasto: async (gastoData) => {
        try {
            const nuevoGasto = new Gasto(gastoData);
            const gastoGuardado = await nuevoGasto.save();
            return {
                status: 201,
                msg: 'Gasto registrado correctamente.',
                data: gastoGuardado
            };
        } catch (error) {
            console.error("Error al crear gasto:", error);
            return {
                status: 500,
                msg: 'Ocurrió un error al registrar el gasto.',
                data: error.message
            };
        }
    },

    obtenerGastos: async (filtros = {}) => {
        try {
            let query = {};

                    if (filtros.fechaInicio && filtros.fechaFin) {
                query.fecha = {
                    $gte: new Date(filtros.fechaInicio),
                    $lte: new Date(filtros.fechaFin)
                };
            }

            if (filtros.tipo) {
                query.tipo = filtros.tipo;
            }

                    const gastos = await Gasto.find(query)
                .populate('registradoPor', 'nombre _id')
                .sort({ fecha: -1 });

            return {
                status: 200,
                msg: 'Gastos obtenidos correctamente',
                data: gastos
            };
        } catch (error) {
            console.error("Error al obtener gastos:", error);
            return {
                status: 500,
                msg: 'Ocurrió un error al obtener los gastos.',
                data: error.message
            };
        }
    },

    obtenerGastoPorId: async (idGasto) => {
        try {
            const gasto = await Gasto.findById(idGasto).populate('registradoPor', 'nombre _id');
            if (!gasto) {
                return {
                    status: 404,
                    msg: 'Gasto no encontrado.',
                    data: null
                };
            }
            return {
                status: 200,
                msg: 'Gasto obtenido correctamente',
                data: gasto
            };
        } catch (error) {
            console.error("Error al obtener gasto por ID:", error);
            return {
                status: 500,
                msg: 'Ocurrió un error al obtener el gasto.',
                data: error.message
            };
        }
    },

    actualizarGasto: async (idGasto, datosActualizados) => {
        try {
            const gastoActualizado = await Gasto.findByIdAndUpdate(
                idGasto,
                datosActualizados,
                { new: true, runValidators: true }
            );

            if (!gastoActualizado) {
                return {
                    status: 404,
                    msg: 'Gasto no encontrado para actualizar.',
                    data: null
                };
            }

            return {
                status: 200,
                msg: 'Gasto actualizado correctamente.',
                data: gastoActualizado
            };

        } catch (error) {
            console.error("Error al actualizar gasto:", error);
            return {
                status: 500,
                msg: 'Ocurrió un error al actualizar el gasto.',
                data: error.message
            };
        }
    },

    eliminarGasto: async (idGasto) => {
        try {
            const gastoEliminado = await Gasto.findByIdAndDelete(idGasto);

            if (!gastoEliminado) {
                return {
                    status: 404,
                    msg: 'Gasto no encontrado para eliminar.',
                    data: null
                };
            }

            return {
                status: 200,
                msg: 'Gasto eliminado exitosamente.',
                data: gastoEliminado
            };
        } catch (error) {
            console.error("Error al eliminar gasto:", error);
            return {
                status: 500,
                msg: 'Ocurrió un error al eliminar el gasto.',
                data: error.message
            };
        }
    }
};

module.exports = { gastoService };
