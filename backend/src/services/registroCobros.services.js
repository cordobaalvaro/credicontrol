const PrestamoModel = require("../models/prestamo.model");

const editarRegistroCobroBD = async (
    prestamoId,
    registroId,
    monto,
    fecha,
    horaPago,
    cuota
) => {
    try {
        if (!prestamoId || !registroId) {
            return {
                status: 400,
                msg: "PrestamoId y registroId son requeridos",
                data: null,
            };
        }

        const prestamo = await PrestamoModel.findById(prestamoId);
        if (!prestamo) {
            return {
                status: 404,
                msg: "Préstamo no encontrado",
                data: null,
            };
        }

        const registroEncontrado = prestamo.registroCobros.id(registroId);
        if (!registroEncontrado) {
            return {
                status: 404,
                msg: "Registro de cobro no encontrado",
                data: null,
            };
        }

        const estadoAnteriorPrestamo = prestamo.estado;

        prestamo.planDeCuotas.forEach((cuota) => {
            cuota.pagado = 0;
            cuota.estado = "pendiente";
        });

        if (monto !== undefined) registroEncontrado.monto = parseFloat(monto);
        if (fecha !== undefined) {
            if (typeof fecha === "string" && fecha.length === 10 && fecha.includes("-")) {
                const [year, month, day] = fecha.split("-");
                registroEncontrado.fechaPago = new Date(year, month - 1, day, 12, 0, 0);
            } else {
                registroEncontrado.fechaPago = new Date(fecha);
            }
        }
        if (horaPago !== undefined) registroEncontrado.horaPago = horaPago;
        if (cuota !== undefined) registroEncontrado.cuota = parseInt(cuota);

        const registrosOrdenados = prestamo.registroCobros
            .toObject()
            .sort((a, b) => new Date(a.fechaPago) - new Date(b.fechaPago));

        for (const reg of registrosOrdenados) {
            let montoRestante = reg.monto;
            for (const cuota of prestamo.planDeCuotas) {
                if (cuota.estado === "completo") continue;
                const faltante = cuota.monto - cuota.pagado;
                if (faltante <= 0) continue;
                const aplicar = Math.min(montoRestante, faltante);
                cuota.pagado += aplicar;
                if (cuota.pagado >= cuota.monto) {
                    cuota.estado = "completo";
                } else if (cuota.pagado > 0) {
                    cuota.estado = "cobrado";
                }
                montoRestante -= aplicar;
                if (montoRestante <= 0) break;
            }
        }

        const totalPagado = prestamo.planDeCuotas.reduce(
            (sum, c) => sum + (c.pagado || 0),
            0
        );

        const nuevoSaldoPendiente = Math.max(0, prestamo.montoTotal - totalPagado);

        const esVencido = prestamo.estado === "vencido";
        if (esVencido && prestamo.saldoPendienteVencimiento > 0) {
            const saldoPendienteAnterior = prestamo.saldoPendiente || 0;
            const diferencia = saldoPendienteAnterior - nuevoSaldoPendiente;
            prestamo.saldoPendienteVencimiento = Math.max(
                0,
                prestamo.saldoPendienteVencimiento - diferencia
            );
        }

        prestamo.saldoPendiente = nuevoSaldoPendiente;

        const todasCompletas = prestamo.planDeCuotas.every(
            (c) => c.estado === "completo"
        );
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fechaVencimientoObj = new Date(prestamo.fechaVencimiento);
        fechaVencimientoObj.setHours(0, 0, 0, 0);

        if (todasCompletas) {
            prestamo.estado = "cancelado";
        } else if (fechaVencimientoObj < hoy) {
            prestamo.estado = "vencido";
        } else {
            prestamo.estado = "activo";
        }

        if (estadoAnteriorPrestamo === "cancelado" && prestamo.estado !== "cancelado") {
            prestamo.fechaCancelacion = null;
        }

        if (estadoAnteriorPrestamo !== "cancelado" && prestamo.estado === "cancelado") {
            prestamo.fechaCancelacion = new Date();
        }

        await prestamo.save();

        return {
            status: 200,
            msg: "Registro de cobro actualizado y cuotas recalculadas correctamente",
            data: {
                registro: registroEncontrado,
                prestamo: prestamoId,
                cuotas: prestamo.planDeCuotas,
                saldoPendiente: prestamo.saldoPendiente,
                estadoPrestamo: prestamo.estado,
            },
        };
    } catch (error) {
        return {
            status: 500,
            msg: "Error interno al editar el registro de cobro",
            data: null,
        };
    }
};

const eliminarRegistroCobroBD = async (prestamoId, registroId) => {
    try {
        if (!prestamoId || !registroId) {
            return {
                status: 400,
                msg: "PrestamoId y registroId son requeridos",
                data: null,
            };
        }

        const prestamo = await PrestamoModel.findById(prestamoId);
        if (!prestamo) {
            return {
                status: 404,
                msg: "Préstamo no encontrado",
                data: null,
            };
        }

        const registroEncontrado = prestamo.registroCobros.id(registroId);
        if (!registroEncontrado) {
            return {
                status: 404,
                msg: "Registro de cobro no encontrado",
                data: null,
            };
        }

        const montoEliminado = registroEncontrado.monto;

        registroEncontrado.deleteOne();

        prestamo.planDeCuotas.forEach((cuota) => {
            cuota.pagado = 0;
            cuota.estado = "pendiente";
        });

        const registrosOrdenados = prestamo.registroCobros
            .toObject()
            .sort((a, b) => new Date(a.fechaPago) - new Date(b.fechaPago));

        for (const reg of registrosOrdenados) {
            let montoRestante = reg.monto;
            for (const cuota of prestamo.planDeCuotas) {
                if (cuota.estado === "completo") continue;
                const faltante = cuota.monto - cuota.pagado;
                if (faltante <= 0) continue;
                const aplicar = Math.min(montoRestante, faltante);
                cuota.pagado += aplicar;
                if (cuota.pagado >= cuota.monto) {
                    cuota.estado = "completo";
                } else if (cuota.pagado > 0) {
                    cuota.estado = "cobrado";
                }
                montoRestante -= aplicar;
                if (montoRestante <= 0) break;
            }
        }

        const totalPagado = prestamo.planDeCuotas.reduce(
            (sum, c) => sum + (c.pagado || 0),
            0
        );

        const nuevoSaldoPendiente = Math.max(0, prestamo.montoTotal - totalPagado);

        const esVencido = prestamo.estado === "vencido";
        if (esVencido && prestamo.saldoPendienteVencimiento > 0) {
            const saldoPendienteAnterior = prestamo.saldoPendiente || 0;
            const diferencia = saldoPendienteAnterior - nuevoSaldoPendiente;
            prestamo.saldoPendienteVencimiento = Math.max(
                0,
                prestamo.saldoPendienteVencimiento - diferencia
            );
        }

        prestamo.saldoPendiente = nuevoSaldoPendiente;

        const todasCompletas = prestamo.planDeCuotas.every(
            (c) => c.estado === "completo"
        );
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fechaVencimientoObj = new Date(prestamo.fechaVencimiento);
        fechaVencimientoObj.setHours(0, 0, 0, 0);

        if (todasCompletas) {
            prestamo.estado = "cancelado";
        } else if (fechaVencimientoObj < hoy) {
            prestamo.estado = "vencido";
        } else {
            prestamo.estado = "activo";
        }

        await prestamo.save();

        return {
            status: 200,
            msg: "Registro de cobro eliminado y cuotas recalculadas correctamente",
            data: {
                montoEliminado: montoEliminado,
                prestamo: prestamoId,
                cuotas: prestamo.planDeCuotas,
                saldoPendiente: prestamo.saldoPendiente,
                estadoPrestamo: prestamo.estado,
            },
        };
    } catch (error) {
        console.error("Error al eliminar el registro de cobro:", error);
        return {
            status: 500,
            msg: "Error interno al eliminar el registro de cobro",
            data: null,
        };
    }
};

const crearRegistroCobroBD = async (prestamoId, monto, fecha, horaPago, cuotaParam) => {
    try {
        if (!prestamoId || !monto) {
            return {
                status: 400,
                msg: "PrestamoId y monto son requeridos",
                data: null,
            };
        }

        const prestamo = await PrestamoModel.findById(prestamoId);
        if (!prestamo) {
            return {
                status: 404,
                msg: "Préstamo no encontrado",
                data: null,
            };
        }

        const montoNumerico = parseFloat(monto);
        if (montoNumerico <= 0) {
            return {
                status: 400,
                msg: "El monto debe ser mayor a 0",
                data: null,
            };
        }

        let fechaRegistro;
        if (fecha) {
            if (typeof fecha === "string" && fecha.length === 10 && fecha.includes("-")) {
                const [year, month, day] = fecha.split("-");
                fechaRegistro = new Date(year, month - 1, day, 12, 0, 0);
            } else {
                fechaRegistro = new Date(fecha);
            }
        } else {
            fechaRegistro = new Date();
        }

        const registroCobro = {
            monto: montoNumerico,
            fechaPago: fechaRegistro,
            horaPago: horaPago,
            cuota: cuotaParam
        };

        prestamo.registroCobros.push(registroCobro);

        let montoRestante = montoNumerico;
        let cuotasAfectadas = [];

        const cuotasPendientes = prestamo.planDeCuotas
            .filter((cuota) => cuota.estado !== "completo")
            .sort((a, b) => a.numero - b.numero);

        for (const cuota of cuotasPendientes) {
            if (montoRestante <= 0) break;

            const totalCobradoCuota = cuota.pagado || 0;
            const montoFaltante = cuota.monto - totalCobradoCuota;

            if (montoFaltante > 0) {
                const montoParaEstaCuota = Math.min(montoRestante, montoFaltante);

                cuota.pagado = totalCobradoCuota + montoParaEstaCuota;

                const nuevoTotalCuota = totalCobradoCuota + montoParaEstaCuota;
                const estadoAnterior = cuota.estado;
                if (nuevoTotalCuota >= cuota.monto) {
                    cuota.estado = "completo";
                } else {
                    cuota.estado = "cobrado";
                }

                cuotasAfectadas.push({
                    numero: cuota.numero,
                    montoCobrado: montoParaEstaCuota,
                    estadoAnterior: estadoAnterior,
                    estadoNuevo: cuota.estado,
                });

                montoRestante -= montoParaEstaCuota;
            }
        }

        prestamo.saldoPendiente = Math.max(
            0,
            prestamo.saldoPendiente - montoNumerico
        );

        const esVencido = prestamo.estado === "vencido";
        if (esVencido && prestamo.saldoPendienteVencimiento > 0) {
            prestamo.saldoPendienteVencimiento = Math.max(
                0,
                prestamo.saldoPendienteVencimiento - montoNumerico
            );
        }

        if (esVencido) {
                if (prestamo.saldoPendienteVencimiento <= 0) {
                prestamo.estado = "cancelado";
            }
            } else {
                const todasLasCuotasCompletas = prestamo.planDeCuotas.every(
                (c) => c.estado === "completo"
            );
            if (todasLasCuotasCompletas) {
                prestamo.estado = "cancelado";
            } else if (prestamo.saldoPendiente < prestamo.montoTotal) {
                prestamo.estado = "activo";
            }
        }

        await prestamo.save();

        return {
            status: 200,
            msg: "Registro de cobro creado y aplicado correctamente",
            data: {
                registroCreado: registroCobro,
                prestamo: prestamoId,
                montoAplicado: montoNumerico,
                montoSobrante: montoRestante,
                saldoPendiente: prestamo.saldoPendiente,
                estadoPrestamo: prestamo.estado,
                cuotasAfectadas: cuotasAfectadas,
            },
        };
    } catch (error) {
        return {
            status: 500,
            msg: "Error interno al crear el registro de cobro",
            data: null,
        };
    }
};

module.exports = {
    editarRegistroCobroBD,
    eliminarRegistroCobroBD,
    crearRegistroCobroBD,
};
