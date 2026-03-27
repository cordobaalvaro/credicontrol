const PrestamoModel = require("../models/prestamo.model");
const ClienteModel = require("../models/cliente.model");
const Plan = require("../models/planes.model");
const { crearNotificacion } = require("./notificaciones.services");

/**
 * Calcula el interés equivalente cuando se define una cuota personalizada.
 * Permite saber el porcentaje real cobrado al cliente aunque no se haya definido una tasa.
 *
 * @param {number} montoInicial - Capital prestado (sin intereses).
 * @param {number} montoCuotaPersonalizada - Monto fijo acordado por cuota.
 * @param {number} cantidadCuotas - Número total de cuotas.
 * @returns {number} Tasa de interés equivalente en porcentaje (ej: 25.50).
 */
const calcularInteresEquivalente = (
  montoInicial,
  montoCuotaPersonalizada,
  cantidadCuotas
) => {
  const totalCuotas = montoCuotaPersonalizada * cantidadCuotas;
  const interesEquivalente =
    ((totalCuotas - montoInicial) / montoInicial) * 100;
  return parseFloat(interesEquivalente.toFixed(2));
};

/**
 * Genera el plan de cuotas de un préstamo calculando las fechas de vencimiento
 * según la frecuencia de pago. Es la función central de la lógica financiera.
 *
 * @param {Date|string} fechaInicio - Fecha desde la cual se calculan los vencimientos.
 * @param {number} cantidadCuotas - Número total de cuotas a generar.
 * @param {number} montoTotal - Monto final del préstamo (capital + intereses).
 * @param {'semanal'|'quincenal'|'mensual'} frecuencia - Intervalo entre pagos.
 * @param {number|null} [montoCuotaPersonalizada] - Si se define, cada cuota tendrá este monto fijo.
 * @returns {Array<{numero: number, fechaVencimiento: Date, monto: number, pagado: boolean}>} Plan de cuotas.
 * @throws {Error} Si la frecuencia no es 'semanal', 'quincenal' o 'mensual'.
 */
const calcularCuotas = (
  fechaInicio,
  cantidadCuotas,
  montoTotal,
  frecuencia,
  montoCuotaPersonalizada = null
) => {
  const cuotasArray = [];

  const montoCuota = montoCuotaPersonalizada
    ? parseFloat(montoCuotaPersonalizada.toFixed(2))
    : parseFloat((montoTotal / cantidadCuotas).toFixed(2));

  for (let i = 0; i < cantidadCuotas; i++) {
    const fecha = new Date(fechaInicio);

    if (frecuencia === "semanal") {
      fecha.setDate(fecha.getDate() + (i + 1) * 7);
    } else if (frecuencia === "quincenal") {
      fecha.setDate(fecha.getDate() + (i + 1) * 15);
    } else if (frecuencia === "mensual") {
      fecha.setMonth(fecha.getMonth() + (i + 1));
    } else {
      throw new Error(
        "Frecuencia inválida. Debe ser semanal, quincenal o mensual."
      );
    }

    cuotasArray.push({
      numero: i + 1,
      fechaVencimiento: fecha,
      monto: montoCuota,
      pagado: false,
    });
  }

  return cuotasArray;
};

/**
 * Crea un nuevo préstamo, genera su plan de cuotas y lo vincula al cliente.
 * Si se provee `montoCuotaPersonalizada`, se calcula la tasa equivalente automáticamente.
 * Si se provee `interes`, se calcula el `montoTotal` aplicando el porcentaje sobre el capital.
 * Requiere que el cliente tenga una zona asignada antes de poder crear un préstamo.
 *
 * @param {{ cliente: string, montoInicial: number, cantidadCuotas: number, frecuencia: 'semanal'|'quincenal'|'mensual', interes?: number, fechaInicio?: Date, montoCuotaPersonalizada?: number, nombre?: string, tipo?: 'nuevo'|'refinanciado' }} data
 * @returns {Promise<{status: number, msg: string, data: object|null}>}
 */
const crearPrestamoBD = async (data) => {
  try {
    const {
      nombre,
      cliente,
      montoInicial,
      cantidadCuotas,
      interes,
      fechaInicio,
      fechaVencimiento,
      frecuencia,
      montoCuotaPersonalizada,
      tipo,
    } = data;

    if (!cliente || !montoInicial || !cantidadCuotas || !frecuencia) {
      return {
        status: 400,
        msg: "Faltan campos obligatorios",
        data: null,
      };
    }

    const clienteExiste = await ClienteModel.findById(cliente);
    if (!clienteExiste) {
      return {
        status: 404,
        msg: "Cliente no encontrado",
        data: null,
      };
    }

    let montoFinal;
    let interesCalculado;

    if (montoCuotaPersonalizada) {
      montoFinal = parseFloat(
        (montoCuotaPersonalizada * cantidadCuotas).toFixed(2)
      );

      interesCalculado = calcularInteresEquivalente(
        montoInicial,
        montoCuotaPersonalizada,
        cantidadCuotas
      );
    } else {
      interesCalculado = interes || 0;
      montoFinal = interesCalculado
        ? parseFloat((montoInicial * (1 + interesCalculado / 100)).toFixed(2))
        : montoInicial;
    }

    const planDeCuotas = calcularCuotas(
      fechaInicio || new Date(),
      cantidadCuotas,
      montoFinal,
      frecuencia,
      montoCuotaPersonalizada
    );

    const fechaVencimientoPrestamo =
      planDeCuotas[planDeCuotas.length - 1].fechaVencimiento;

    if (!clienteExiste.zona) {
      return {
        status: 400,
        msg: "El cliente debe tener una zona asignada para crear un préstamo",
        data: null,
      };
    }

    const nuevoPrestamo = new PrestamoModel({
      nombre,
      cliente,
      zona: clienteExiste.zona,
      planDeCuotas,
      montoInicial,
      montoTotal: montoFinal,
      cantidadCuotas,
      interes: interesCalculado,
      frecuencia,
      interesSemanal: 0,
      estado: "activo",
      fechaInicio: fechaInicio || new Date(),
      fechaVencimiento: fechaVencimientoPrestamo,
      montoCuotaPersonalizada: montoCuotaPersonalizada || null,
      tipo: tipo || "nuevo",
    });

    const prestamoGuardado = await nuevoPrestamo.save();

    clienteExiste.prestamos.push(prestamoGuardado._id);
    await clienteExiste.save();

    return {
      status: 201,
      msg: montoCuotaPersonalizada
        ? `Préstamo creado con cuota personalizada de $${montoCuotaPersonalizada}. Interés calculado: ${interesCalculado}%`
        : "Préstamo creado correctamente",
      data: prestamoGuardado,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error interno al crear el préstamo",
      data: null,
    };
  }
};

const obtenerPrestamoPorIdBD = async (id) => {
  try {
    const prestamo = await PrestamoModel.findById(id).populate("cliente");
    if (!prestamo) {
      return {
        status: 404,
        msg: "Préstamo no encontrado",
        data: null,
      };
    }

    return {
      status: 200,
      msg: "Préstamo obtenido correctamente",
      data: prestamo,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al obtener el préstamo",
      data: null,
    };
  }
};
/**
 * Job de actualización automática de estados de préstamos (llamado por cron a medianoche).
 * Evalúa todos los préstamos activos y vencidos y aplica las siguientes reglas:
 *
 * - Si todas las cuotas están pagadas → estado: 'cancelado'.
 * - Si se superó la fechaVencimiento → estado: 'vencido'.
 * - Por cada semana de mora se aplica un recargo del 5% sobre el saldo base al momento del vencimiento.
 *   (Regla de negocio del cliente: interés punitorio = 5% semanal compuesto sobre saldo pendiente).
 * - Si el préstamo vencido vuelve a estar dentro de plazo → estado: 'activo', interés reiniciado a 0.
 *
 * @returns {Promise<void>}
 * @throws {Error} Lanza el error hacia arriba para que el cron lo capture y loguee.
 */
const actualizarPrestamos = async () => {
  try {
    const prestamosActivos = await PrestamoModel.find({
      estado: { $in: ["activo", "vencido"] },
    }).populate("cliente", "numero nombre");

    const hoy = new Date();

    const promesasActualizacion = prestamosActivos.map(async (prestamo) => {
      let modificado = false;

      const cuotasPendientes = prestamo.planDeCuotas.filter(
        (cuota) => !cuota.pagado || cuota.estado === "cobrado" || cuota.estado === "pendiente"
      );

      const todasPagadas = prestamo.planDeCuotas.every(
        (cuota) => cuota.pagado === cuota.monto || cuota.estado === "completo"
      );

      if (cuotasPendientes.length === 0 && todasPagadas) {
        prestamo.estado = "cancelado";
        prestamo.interesSemanal = 0;
        prestamo.saldoPendiente = 0;
        prestamo.saldoPendienteVencimiento = undefined;
        modificado = true;
      } else {
        const fechaVenc = prestamo.fechaVencimiento ? new Date(prestamo.fechaVencimiento) : null;

        if (fechaVenc && hoy > fechaVenc) {
          const msPorSemana = 7 * 24 * 60 * 60 * 1000;
          const semanasVencidas = Math.max(0, Math.floor((hoy - fechaVenc) / msPorSemana));
          const semanasNuevas = semanasVencidas - (prestamo.semanasVencidas || 0);
          const eraActivo = prestamo.estado !== "vencido";

          if (eraActivo) {
            prestamo.estado = "vencido";
            if (!prestamo.saldoPendienteVencimiento) {
              prestamo.saldoPendienteVencimiento = prestamo.saldoPendiente;
            }
            modificado = true;
          }

          if (semanasNuevas > 0) {
            const baseSaldo = prestamo.saldoPendienteVencimiento ?? prestamo.saldoPendiente;
            const interesIncremental = baseSaldo * 0.05 * semanasNuevas;
            prestamo.interesSemanal = parseFloat((prestamo.interesSemanal + interesIncremental).toFixed(2));
            prestamo.saldoPendienteVencimiento = parseFloat(
              ((prestamo.saldoPendienteVencimiento ?? prestamo.saldoPendiente) + interesIncremental).toFixed(2),
            );

            const clienteNum = prestamo.cliente?.numero;
            const clienteNom = prestamo.cliente?.nombre;

            const promesasNotificaciones = [];

            if (eraActivo && !prestamo.notificadoVencido) {
              promesasNotificaciones.push(crearNotificacion({
                tipo: "prestamo_vencido",
                mensaje: `El préstamo #${prestamo.numero} (${prestamo.nombre}) del cliente #${clienteNum ?? "?"
                  } - ${clienteNom ?? "(sin nombre)"} ha vencido. Semanas vencidas: ${semanasVencidas}.`,
                prestamo: prestamo._id,
                cliente: prestamo.cliente?._id || prestamo.cliente,
                metadata: {
                  semanasVencidas,
                  clienteNumero: clienteNum,
                  clienteNombre: clienteNom,
                },
              }));
              prestamo.notificadoVencido = true;
            }

            promesasNotificaciones.push(crearNotificacion({
              tipo: "interes_actualizado",
              mensaje: `Interés actualizado por mora en préstamo #${prestamo.numero} del cliente #${clienteNum ?? "?"
                } - ${clienteNom ?? "(sin nombre)"}: $${prestamo.interesSemanal} (semanas vencidas: ${semanasVencidas
                }).`,
              prestamo: prestamo._id,
              cliente: prestamo.cliente?._id || prestamo.cliente,
              metadata: {
                semanasVencidas,
                interesSemanal: prestamo.interesSemanal,
                clienteNumero: clienteNum,
                clienteNombre: clienteNom,
                semanasNuevas,
              },
            }));

            await Promise.all(promesasNotificaciones);
            modificado = true;
          }

          if (prestamo.semanasVencidas !== semanasVencidas) {
            prestamo.semanasVencidas = semanasVencidas;
            modificado = true;
          }
        } else if (prestamo.estado !== "activo" || prestamo.interesSemanal !== 0) {
          
          prestamo.interesSemanal = 0;
          prestamo.estado = "activo";
          prestamo.semanasVencidas = 0;
          prestamo.saldoPendienteVencimiento = undefined;
          modificado = true;
        }
      }

      if (modificado) {
        
        await prestamo.save({ validateModifiedOnly: true });
      }
    });

    await Promise.all(promesasActualizacion);

  } catch (error) {
    console.error("Error crítico en actualizarPrestamos:", error);
    throw error;
  }
};

const eliminarPrestamoBD = async (id) => {
  try {
    const prestamo = await PrestamoModel.findById(id);
    if (!prestamo) {
      return {
        status: 404,
        msg: "Préstamo no encontrado",
        data: null,
      };
    }

    const cliente = await ClienteModel.findById(prestamo.cliente);
    if (cliente) {
      cliente.prestamos = cliente.prestamos.filter(
        (prestamoId) => prestamoId.toString() !== id
      );
      await cliente.save();
    }

    await PrestamoModel.findByIdAndDelete(id);

    return {
      status: 200,
      msg: "Préstamo eliminado correctamente",
      data: null,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error interno al eliminar el préstamo",
      data: null,
    };
  }
};

const actualizarPrestamoBD = async (id, datos) => {
  try {
    const prestamo = await PrestamoModel.findById(id);
    if (!prestamo) {
      return {
        status: 404,
        msg: "Préstamo no encontrado",
        data: null,
      };
    }

    if (
      datos.montoInicial ||
      datos.cantidadCuotas ||
      datos.interes !== undefined ||
      datos.frecuencia ||
      datos.fechaInicio ||
      datos.montoCuotaPersonalizada !== undefined
    ) {
      const montoInicial = datos.montoInicial || prestamo.montoInicial;
      const cantidadCuotas = datos.cantidadCuotas || prestamo.cantidadCuotas;
      const frecuencia = datos.frecuencia || prestamo.frecuencia;

      const fechaInicio = datos.fechaInicio || new Date();

      let montoFinal;
      let interesCalculado;

      if (datos.montoCuotaPersonalizada) {
        montoFinal = parseFloat(
          (datos.montoCuotaPersonalizada * cantidadCuotas).toFixed(2)
        );

        interesCalculado = calcularInteresEquivalente(
          montoInicial,
          datos.montoCuotaPersonalizada,
          cantidadCuotas
        );
      } else {
        interesCalculado =
          datos.interes !== undefined ? datos.interes : prestamo.interes;
        montoFinal = interesCalculado
          ? parseFloat((montoInicial * (1 + interesCalculado / 100)).toFixed(2))
          : montoInicial;
      }

      const totalCobrado = prestamo.planDeCuotas.reduce(
        (sum, cuota) => sum + (cuota.pagado || 0),
        0
      );

      const nuevoPlanDeCuotas = calcularCuotas(
        fechaInicio,
        cantidadCuotas,
        montoFinal,
        frecuencia,
        datos.montoCuotaPersonalizada
      );

      let montoRestante = totalCobrado;
      for (const cuota of nuevoPlanDeCuotas) {
        if (montoRestante <= 0) break;

        const montoParaEstaCuota = Math.min(montoRestante, cuota.monto);
        cuota.pagado = montoParaEstaCuota;

        if (montoParaEstaCuota >= cuota.monto) {
          cuota.estado = "completo";
        } else if (montoParaEstaCuota > 0) {
          cuota.estado = "cobrado";
        } else {
          cuota.estado = "pendiente";
        }

        montoRestante -= montoParaEstaCuota;
      }

      prestamo.montoInicial = montoInicial;
      prestamo.montoTotal = montoFinal;
      prestamo.cantidadCuotas = cantidadCuotas;
      prestamo.interes = interesCalculado;
      prestamo.frecuencia = frecuencia;
      prestamo.fechaInicio = fechaInicio;
      prestamo.planDeCuotas = nuevoPlanDeCuotas;
      prestamo.saldoPendiente = Math.max(0, montoFinal - totalCobrado);
      prestamo.montoCuotaPersonalizada = datos.montoCuotaPersonalizada || null;
      prestamo.fechaVencimiento =
        nuevoPlanDeCuotas[nuevoPlanDeCuotas.length - 1].fechaVencimiento;
    }

    Object.keys(datos).forEach((key) => {
      if (
        ![
          "montoInicial",
          "cantidadCuotas",
          "interes",
          "frecuencia",
          "fechaInicio",
          "fechaVencimiento",
          "montoCuotaPersonalizada",
        ].includes(key)
      ) {
        prestamo[key] = datos[key];
      }
    });

    const prestamoActualizado = await prestamo.save();

    await prestamoActualizado.populate("cliente");

    return {
      status: 200,
      msg: datos.montoCuotaPersonalizada
        ? `Préstamo actualizado con cuota personalizada de $${datos.montoCuotaPersonalizada}. Interés calculado: ${prestamo.interes}%`
        : "Préstamo actualizado correctamente",
      data: prestamoActualizado,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error interno al actualizar el préstamo",
      data: null,
    };
  }
};

const desactivarPrestamoBD = async (id) => {
  try {
    const prestamo = await PrestamoModel.findById(id);
    if (!prestamo) {
      return {
        status: 404,
        msg: "Préstamo no encontrado",
        data: null,
      };
    }

    prestamo.estado = "desactivado";

    const prestamoActualizado = await prestamo.save();

    return {
      status: 200,
      msg: "Préstamo desactivado correctamente",
      data: prestamoActualizado,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error interno al desactivar el préstamo",
      data: null,
    };
  }
};

const activarPrestamoBD = async (id) => {
  try {
    const prestamo = await PrestamoModel.findById(id);
    if (!prestamo) {
      return {
        status: 404,
        msg: "Préstamo no encontrado",
        data: null,
      };
    }

    if (prestamo.estado === "activo") {
      return {
        status: 400,
        msg: "El préstamo ya está activo",
        data: prestamo,
      };
    }



    prestamo.estado = "activo";

    const prestamoActualizado = await prestamo.save();

    return {
      status: 200,
      msg: "Préstamo activado correctamente",
      data: prestamoActualizado,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error interno al activar el préstamo",
      data: null,
    };
  }
};

const obtenerTodosLosPrestamosBD = async ({ q, estado } = {}) => {
  try {
    const prestamos = await PrestamoModel.find()
      .populate("cliente", "nombre apellido dni telefono direccion dni")
      .sort({ fechaCreacion: -1 });

    let filtrados = prestamos;

    if (estado && estado !== "todos") {
      filtrados = filtrados.filter((p) => p.estado === estado);
    }

    if (q && q.trim()) {
      const texto = q.trim().toLowerCase();
      filtrados = filtrados.filter((p) => {
        const numeroPrestamo = p.numero ? String(p.numero).toLowerCase() : "";
        const clienteNombre = p.cliente?.nombre
          ? p.cliente.nombre.toLowerCase()
          : "";
        const clienteApellido = p.cliente?.apellido
          ? p.cliente.apellido.toLowerCase()
          : "";

        const nombreCompletoCliente = `${clienteNombre} ${clienteApellido}`.trim();

        return (
          numeroPrestamo.includes(texto) ||
          clienteNombre.includes(texto) ||
          clienteApellido.includes(texto) ||
          nombreCompletoCliente.includes(texto)
        );
      });
    }

    return {
      status: 200,
      msg: "Préstamos obtenidos correctamente",
      data: filtrados,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error interno al obtener los préstamos",
      data: null,
    };
  }
};

const elegirPlanesPrestamoBD = async (data) => {
  try {
    const { clienteId, planId, monto, nombre, tipo } = data;

    if (!clienteId || !planId || !monto) {
      return {
        status: 400,
        msg: "Cliente, Plan y Monto son requeridos",
        data: null,
      };
    }

    const clienteExiste = await ClienteModel.findById(clienteId);
    if (!clienteExiste) {
      return {
        status: 404,
        msg: "Cliente no encontrado",
        data: null,
      };
    }

    if (!clienteExiste.zona) {
      return {
        status: 400,
        msg: "El cliente debe tener una zona asignada para crear un préstamo",
        data: null,
      };
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return {
        status: 404,
        msg: "Plan no encontrado",
        data: null,
      };
    }

    const indexMonto = plan.data.montos.indexOf(Number(monto));
    if (indexMonto === -1) {
      return {
        status: 400,
        msg: "Monto no válido para este plan",
        data: null,
      };
    }

    const planElegido = plan.data.planes.find(p => p.nombre === data.planNombre);
    if (!planElegido) {
      return {
        status: 404,
        msg: "Variante de plan no encontrada",
        data: null,
      };
    }

    const filaMonto = planElegido.filas[indexMonto];
    if (!filaMonto) {
      return {
        status: 400,
        msg: "No hay configuración para este monto en el plan elegido",
        data: null,
      };
    }

    const cantidadCuotas = filaMonto.semanas;
    const montoCuota = filaMonto.monto;
    const montoTotal = montoCuota * cantidadCuotas;
    const frecuencia = plan.tabla.includes("semanal") ? "semanal" : plan.tabla.includes("quincenal") ? "quincenal" : "mensual";

    const planDeCuotas = calcularCuotas(
      new Date(),
      cantidadCuotas,
      montoTotal,
      frecuencia,
      montoCuota
    );

    const fechaVencimientoPrestamo =
      planDeCuotas[planDeCuotas.length - 1].fechaVencimiento;

    const interesCalculado = calcularInteresEquivalente(
      Number(monto),
      Number(montoCuota),
      cantidadCuotas
    );

    const nuevoPrestamo = new PrestamoModel({
      nombre: nombre || `Préstamo ${plan.data.title} - ${planElegido.nombre}`,
      cliente: clienteId,
      zona: clienteExiste.zona,
      planDeCuotas,
      montoInicial: Number(monto),
      montoTotal,
      cantidadCuotas,
      interes: interesCalculado,
      frecuencia,
      interesSemanal: 0,
      estado: "activo",
      fechaInicio: new Date(),
      fechaVencimiento: fechaVencimientoPrestamo,
      montoCuotaPersonalizada: montoCuota,
      tipo: tipo || "nuevo",
    });

    const prestamoGuardado = await nuevoPrestamo.save();

    clienteExiste.prestamos.push(prestamoGuardado._id);
    await clienteExiste.save();

    return {
      status: 201,
      msg: "Préstamo creado correctamente desde el plan",
      data: prestamoGuardado,
    };
  } catch (error) {
    console.error("Error en elegirPlanesPrestamoBD:", error);
    return {
      status: 500,
      msg: "Error interno al crear el préstamo desde el plan",
      data: null,
    };
  }
};

module.exports = {
  crearPrestamoBD,
  elegirPlanesPrestamoBD,
  obtenerPrestamoPorIdBD,
  obtenerTodosLosPrestamosBD,
  actualizarPrestamos,
  eliminarPrestamoBD,
  actualizarPrestamoBD,
  desactivarPrestamoBD,
  activarPrestamoBD,
};
