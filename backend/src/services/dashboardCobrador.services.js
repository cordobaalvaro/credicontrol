const PrestamoModel = require("../models/prestamo.model");
const UsuarioModel = require("../models/usuario.model");
const ClienteModel = require("../models/cliente.model");
const ZonaModel = require("../models/zona.model");
const TablaSemanalClientesModel = require("../models/tablaSemanalClientes.model");

const obtenerInfoClientesPrestamos = async (cobradorId) => {
  try {
    const cobrador = await UsuarioModel.findById(cobradorId)
      .populate("zonaACargo", "nombre localidades")
      .lean();

    if (!cobrador) {
      return {
        status: 404,
        msg: "Cobrador no encontrado",
        data: null,
      };
    }

    if (!cobrador.zonaACargo || cobrador.zonaACargo.length === 0) {
      return {
        status: 200,
        msg: "El cobrador no tiene zonas asignadas",
        data: {
          clientesNuevos: [],
          prestamosNuevos: [],
        },
      };
    }

    const zonaIds = cobrador.zonaACargo.map((z) => z._id);

    const hoy = new Date();
    const inicioDia = new Date(hoy);
    inicioDia.setHours(0, 0, 0, 0);

    const finDia = new Date(hoy);
    finDia.setHours(23, 59, 59, 999);

    const clientesNuevos = await ClienteModel.find({
      zona: { $in: zonaIds },
      createdAt: {
        $gte: inicioDia,
        $lte: finDia,
      },
      estado: "activo",
    })
      .populate("zona", "nombre")
      .select("nombre dni telefono zona createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const prestamosNuevos = await PrestamoModel.find({
      zona: { $in: zonaIds },
      createdAt: {
        $gte: inicioDia,
        $lte: finDia,
      },
      estado: "activo",
    })
      .populate("cliente", "nombre dni telefono")
      .populate("zona", "nombre")
      .select("numero montoTotal cliente zona createdAt fechaInicio")
      .sort({ createdAt: -1 })
      .lean();

    const clientesFormateados = clientesNuevos.map((cliente) => ({
      tipo: "cliente",
      mensaje: `Nuevo cliente "${cliente.nombre}" agregado a la zona "${cliente.zona?.nombre || "N/A"}"`,
      detalles: {
        cliente: cliente.nombre,
        dni: cliente.dni,
        telefono: cliente.telefono,
        zona: cliente.zona?.nombre || "N/A",
        fechaCreacion: cliente.createdAt,
      },
    }));

    const prestamosFormateados = prestamosNuevos.map((prestamo) => ({
      tipo: "prestamo",
      mensaje: `Nuevo préstamo N°${prestamo.numero} para "${prestamo.cliente?.nombre || "N/A"}" en la zona "${prestamo.zona?.nombre || "N/A"}"`,
      detalles: {
        numeroPrestamo: prestamo.numero,
        monto: prestamo.montoTotal,
        cliente: prestamo.cliente?.nombre || "N/A",
        dni: prestamo.cliente?.dni || "N/A",
        telefono: prestamo.cliente?.telefono || "N/A",
        zona: prestamo.zona?.nombre || "N/A",
        fechaCreacion: prestamo.createdAt,
        fechaInicio: prestamo.fechaInicio,
      },
    }));

    return {
      status: 200,
      msg: "Información de clientes y préstamos nuevos obtenida correctamente",
      data: {
        clientesNuevos: clientesFormateados,
        prestamosNuevos: prestamosFormateados,
        totalNuevos: clientesFormateados.length + prestamosFormateados.length,
      },
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al obtener información de clientes y préstamos nuevos",
      data: {
        clientesNuevos: [],
        prestamosNuevos: [],
        totalNuevos: 0,
      },
    };
  }
};

const obtenerMisZonas = async (cobradorId) => {
  try {
    const cobrador = await UsuarioModel.findById(cobradorId)
      .populate("zonaACargo", "nombre localidades")
      .lean();

    if (!cobrador) {
      return { status: 404, msg: "Cobrador no encontrado", data: null };
    }

    const zonaIds = cobrador.zonaACargo.map((z) => z._id);

    const clientes = await ClienteModel.find({
      zona: { $in: zonaIds },
      estado: "activo",
    })
      .populate("zona", "nombre")
      .lean();

    const clienteIds = clientes.map((c) => c._id);
    const prestamos = await PrestamoModel.find({
      cliente: { $in: clienteIds },
      estado: "activo",
    })
      .populate("cliente", "nombre")
      .populate("zona", "nombre")
      .lean();

    const prestamosVencidos = await PrestamoModel.find({
      cliente: { $in: clienteIds },
      estado: "vencido",
    })
      .populate("cliente", "nombre")
      .populate("zona", "nombre")
      .lean();

    const todosLosPrestamos = [...prestamos, ...prestamosVencidos];

    let cantidadACobrar = 0;
    let totalVencido = 0;
    let totalPrestamos = 0;
    const clientesUnicos = new Set();

    todosLosPrestamos.forEach((prestamo) => {
      totalPrestamos++;

      if (prestamo.cliente) {
        clientesUnicos.add(prestamo.cliente._id.toString());
      }

      if (prestamo.estado === "activo") {
        cantidadACobrar += prestamo.saldoPendiente || 0;
      } else if (prestamo.estado === "vencido") {
        totalVencido += prestamo.saldoPendienteVencimiento || 0;
      }
    });

    const totalClientes = clientes.length;

    return {
      status: 200,
      msg: "Zonas del cobrador obtenidas correctamente",
      data: {
        cantidadACobrar,
        totalVencido,
        totalPrestamos,
        totalClientes,
        zonas: zonaIds.map((zonaId) => ({
          zona: zonaId.toString(),
          cantidadACobrar,
          totalVencido,
          totalPrestamos,
          totalClientes,
        })),
      },
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al obtener zonas del cobrador",
      data: null,
    };
  }
};

const obtenerClientesDeZonasCobrador = async (cobradorId) => {
  try {
    const zonasCobrador = await ZonaModel.find(
      { cobrador: cobradorId },
      { _id: 1 },
    );

    if (!zonasCobrador || zonasCobrador.length === 0) {
      return {
        success: false,
        msg: "El cobrador no tiene zonas asignadas",
        clienteIds: [],
      };
    }

    const zonaIds = zonasCobrador.map((z) => z._id);

    const clientesZona = await ClienteModel.find(
      {
        zona: { $in: zonaIds },
        estado: "activo",
      },
      { _id: 1 },
    );

    if (!clientesZona || clientesZona.length === 0) {
      return {
        success: false,
        msg: "No hay clientes activos en las zonas del cobrador",
        clienteIds: [],
      };
    }

    const clienteIds = clientesZona.map((c) => c._id);
    return { success: true, clienteIds };
  } catch (error) {
    return {
      success: false,
      msg: "Error al obtener clientes de zonas",
      clienteIds: [],
    };
  }
};

const obtenerInfoCobrador = async (cobradorId) => {
  try {
    const cobrador = await UsuarioModel.findById(cobradorId)
      .populate("zonaACargo", "nombre localidades")
      .lean();

    if (!cobrador) {
      return {
        status: 404,
        msg: "Cobrador no encontrado",
        data: null,
      };
    }

    return {
      status: 200,
      msg: "Información del cobrador obtenida correctamente",
      data: {
        _id: cobrador._id,
        nombre: cobrador.nombre,
        usuarioLogin: cobrador.usuarioLogin,
        telefono: cobrador.telefono,
        rol: cobrador.rol,
        zona: cobrador.zonaACargo,
        fechaCreacion: cobrador.createdAt,
      },
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al obtener información del cobrador",
      data: null,
    };
  }
};

const obtenerMetricasDia = async (cobradorId) => {
  try {
    const toPlain = (doc) => {
      if (!doc) return doc;
      if (typeof doc.toObject === "function")
        return doc.toObject({ virtuals: true });
      if (typeof doc.toJSON === "function")
        return doc.toJSON({ virtuals: true });
      return doc;
    };

    const getDireccionCobroFinal = (cliente) => {
      if (!cliente) return "";
      if (cliente.direccionCobroValor) return cliente.direccionCobroValor;
      if (cliente.direccionCobro === "direccionComercial")
        return cliente.direccionComercial || "";
      if (cliente.direccionCobro === "direccion")
        return cliente.direccion || "";
      return cliente.direccion || cliente.direccionComercial || "";
    };

    const ultimaTabla = await TablaSemanalClientesModel.findOne({
      cobrador: cobradorId,
      estado: { $ne: "borrador" },
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "items",
        populate: [
          {
            path: "cliente",
            select:
              "nombre telefono direccionCobro direccionComercial direccion direccionCobroValor",
          },
          { path: "prestamo", select: "numero estado planDeCuotas" },
          { path: "zona", select: "nombre" },
        ],
      })
      .lean();

    if (!ultimaTabla) {
      return {
        status: 200,
        msg: "El cobrador no tiene tablas semanales",
        data: {
          ultimaTabla: null,
          itemsTabla: {
            vencidos: { cantidad: 0, monto: 0, detalles: [] },
            activos: { cantidad: 0, monto: 0, detalles: [] },
            reportados: { cantidad: 0, monto: 0, detalles: [] },
          },
        },
      };
    }

    const montoTotalCobrado = ultimaTabla.montoTotalCobrado || 0;
    const montoTotalEsperado = ultimaTabla.montoTotalEsperado || 0;

    let totalEsperadoActivos = 0;
    let totalEsperadoVencidos = 0;
    let detallesVencidos = [];
    let detallesActivos = [];
    let detallesReportados = [];

    let itemsVencidos = 0;
    let itemsActivos = 0;
    let itemsReportados = 0;
    let montoVencidos = 0;
    let montoActivos = 0;
    let montoReportados = 0;

    if (ultimaTabla.items && Array.isArray(ultimaTabla.items)) {
      ultimaTabla.items.forEach((item) => {
        const clientePlain = toPlain(item.cliente);
        const prestamoPlain = toPlain(item.prestamo);
        const zonaPlain = toPlain(item.zona);

        const firstCuotaSemana = (item.cuotasSemana && item.cuotasSemana.length > 0) ? item.cuotasSemana[0] : null;
        const montoCuotaBase = (prestamoPlain?.planDeCuotas && prestamoPlain.planDeCuotas.length > 0) 
          ? prestamoPlain.planDeCuotas[0].monto 
          : 0;
        
        const montoItem = firstCuotaSemana ? firstCuotaSemana.monto : (item.montoCuotasEsperadoSemana || 0);

        const infoItem = {
          cliente: {
            ...(clientePlain || {}),
            direccionCobroFinal: getDireccionCobroFinal(clientePlain),
          },
          prestamo: prestamoPlain,
          zona: zonaPlain,
          monto: montoItem,
          montoCuota: montoCuotaBase,
          fechaVencimiento: firstCuotaSemana ? firstCuotaSemana.fechaVencimiento : null,
          numeroCuota: firstCuotaSemana ? firstCuotaSemana.numero : null,
          montoTotalPrestamo: item.montoTotalPrestamo ?? 0,
          saldoPendiente: item.saldoPendiente ?? 0,
          saldoPendienteVencimiento: item.saldoPendienteVencimiento ?? 0,
          montoCuotasEsperadoSemana: item.montoCuotasEsperadoSemana ?? 0,
          montoCobrado: item.montoCobrado ?? 0,
          deudaArrastrada: item.deudaArrastrada ?? 0,
        };

        // Calculamos los totales esperados por estado de préstamo
        if (prestamoPlain?.estado === "vencido") {
          totalEsperadoVencidos += montoItem;
        } else {
          totalEsperadoActivos += montoItem;
        }

        if (item.estado === "reportado") {
          itemsReportados++;
          montoReportados += item.montoCobrado || 0;
          detallesReportados.push(infoItem);
        } else if (item.estado === "enviado") {
          if (prestamoPlain?.estado === "vencido") {
            itemsVencidos++;
            montoVencidos += infoItem.monto || 0;
            detallesVencidos.push(infoItem);
          } else {
            itemsActivos++;
            montoActivos += infoItem.monto || 0;
            detallesActivos.push(infoItem);
          }
        }
      });
    }

    return {
      status: 200,
      msg: "Métricas obtenidas correctamente",
      data: {
        ultimaTabla: {
          _id: ultimaTabla._id,
          nombre: ultimaTabla.nombre || "Tabla Semanal",
          semana: ultimaTabla.semana,
          fechaInicio: ultimaTabla.fechaInicio,
          fechaFin: ultimaTabla.fechaFin,
          estado: ultimaTabla.estado,
          totalItems: ultimaTabla.items?.length || 0,
          itemsConCobros:
            ultimaTabla.items?.filter((item) => item.montoCobrado > 0)
              ?.length || 0,
          montoTotalCobrado: montoTotalCobrado,
          montoTotalEsperado: montoTotalEsperado,
          montoTotalEsperadoActivos: totalEsperadoActivos,
          montoTotalEsperadoVencidos: totalEsperadoVencidos,
        },
        itemsTabla: {
          vencidos: {
            cantidad: itemsVencidos,
            monto: montoVencidos,
            detalles: detallesVencidos,
          },
          activos: {
            cantidad: itemsActivos,
            monto: montoActivos,
            detalles: detallesActivos,
          },
          reportados: {
            cantidad: itemsReportados,
            monto: montoReportados,
            detalles: detallesReportados,
          },
        },
      },
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al obtener métricas del día",
      data: null,
    };
  }
};

const obtenerResumenSemanal = async (cobradorId) => {
  try {
    const tablas = await TablaSemanalClientesModel.find({
      cobrador: cobradorId,
      estado: { $ne: "borrador" },
    })
      .sort({ createdAt: -1 })
      .lean();

    if (tablas.length === 0) {
      return {
        status: 200,
        msg: "El cobrador no tiene tablas semanales",
        data: {
          totalSemana: 0,
          montoTotal: 0,
          diasConCarga: 0,
          detalleDias: [],
          metaSemanal: 25000,
          metaPorcentaje: 0,
          promedioDiario: 0,
          mejorDia: null,
        },
      };
    }

    let totalSemana = 0;
    let diasConCarga = new Set();
    let detalleDias = {};
    let tablaMasReciente = tablas[0];
    for (const tabla of tablas) {
      if (tabla.items && Array.isArray(tabla.items)) {
        tabla.items.forEach((item) => {
          if (item.montoCobrado > 0) {
            totalSemana += item.montoCobrado;

            const fechaTabla = new Date(tabla.createdAt);
            const fechaStr = fechaTabla.toISOString().split("T")[0];
            const diaSemana = fechaTabla.getDay();
            diasConCarga.add(diaSemana);

            if (!detalleDias[fechaStr]) {
              detalleDias[fechaStr] = {
                dia: diaSemana === 0 ? 7 : diaSemana,
                fecha: fechaStr,
                cobros: 0,
                monto: 0,
                prestamos: new Set(),
              };
            }

            detalleDias[fechaStr].cobros++;
            detalleDias[fechaStr].monto += item.montoCobrado;

            if (item.prestamo) {
              detalleDias[fechaStr].prestamos.add(
                item.prestamo._id?.toString() || item.prestamo.toString(),
              );
            }
          }
        });
      }
    }

    const detalleDiasArray = Object.values(detalleDias).map((dia) => ({
      ...dia,
      prestamos: dia.prestamos.size,
    }));

    const datos = {
      totalSemana: totalSemana,
      montoTotal: totalSemana,
      diasConCarga: diasConCarga.size,
      detalleDias: detalleDiasArray,
    };

    const metaSemanal = 25000;
    const metaPorcentaje = Math.round((datos.montoTotal / metaSemanal) * 100);

    return {
      status: 200,
      msg: "Resumen semanal obtenido correctamente",
      data: {
        ...datos,
        metaSemanal: metaSemanal,
        metaPorcentaje: Math.min(metaPorcentaje, 100),
        promedioDiario:
          datos.diasConCarga > 0
            ? Math.round(datos.montoTotal / datos.diasConCarga)
            : 0,
        mejorDia:
          datos.detalleDias.length > 0
            ? datos.detalleDias.reduce((max, dia) =>
                dia.monto > max.monto ? dia : max,
              )
            : null,
        tablaMasReciente: {
          _id: tablaMasReciente._id,
          nombre: tablaMasReciente.nombre || "Tabla Semanal",
          semana: tablaMasReciente.semana,
          fechaInicio: tablaMasReciente.fechaInicio,
          fechaFin: tablaMasReciente.fechaFin,
          estado: tablaMasReciente.estado,
          totalItems: tablaMasReciente.items?.length || 0,
          itemsConCobros:
            tablaMasReciente.items?.filter((item) => item.montoCobrado > 0)
              ?.length || 0,
          montoTotalCobrado:
            tablaMasReciente.items?.reduce(
              (sum, item) => sum + (item.montoCobrado || 0),
              0,
            ) || 0,
        },
      },
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al obtener resumen semanal",
      data: null,
    };
  }
};

const obtenerProximosACobrar = async (cobradorId) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const finSemana = new Date(hoy.setDate(hoy.getDate() - hoy.getDay() + 6));
    finSemana.setHours(23, 59, 59, 999);

    const clientesResult = await obtenerClientesDeZonasCobrador(cobradorId);

    if (!clientesResult.success) {
      return {
        status: 200,
        msg: clientesResult.msg,
        data: [],
      };
    }

    const clienteIds = clientesResult.clienteIds;

    const proximosCobros = await PrestamoModel.aggregate([
      {
        $match: {
          cliente: { $in: clienteIds },
          estado: "activo",
        },
      },
      {
        $lookup: {
          from: "clientes",
          localField: "cliente",
          foreignField: "_id",
          as: "clienteInfo",
        },
      },
      {
        $project: {
          numero: 1,
          saldoPendiente: 1,
          cliente: { $arrayElemAt: ["$clienteInfo", 0] },
          cuotasPendientes: {
            $filter: {
              input: "$planDeCuotas",
              cond: {
                $and: [
                  { $eq: ["$$this.estado", "pendiente"] },
                  { $gte: ["$$this.fechaVencimiento", hoy] },
                  { $lte: ["$$this.fechaVencimiento", finSemana] },
                ],
              },
            },
          },
        },
      },
      {
        $match: {
          "cuotasPendientes.0": { $exists: true },
        },
      },
      {
        $project: {
          numero: 1,
          saldoPendiente: 1,
          cliente: {
            nombre: "$cliente.nombre",
            telefono: "$cliente.telefono",
          },
          proximaCuota: { $arrayElemAt: ["$cuotasPendientes", 0] },
          totalCuotasSemana: { $size: "$cuotasPendientes" },
          montoEstimadoSemana: {
            $sum: "$cuotasPendientes.monto",
          },
        },
      },
      {
        $sort: { "proximaCuota.fechaVencimiento": 1 },
      },
      {
        $limit: 10,
      },
    ]);

    return {
      status: 200,
      msg: "Próximos a cobrar obtenidos correctamente",
      data: proximosCobros,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al obtener próximos a cobrar",
      data: [],
    };
  }
};

const obtenerDashboardCobrador = async (cobradorId) => {
  try {
    const [infoCobrador, metricasDia, resumenSemanal, proximosACobrar] =
      await Promise.all([
        obtenerInfoCobrador(cobradorId),
        obtenerMetricasDia(cobradorId),
        obtenerResumenSemanal(cobradorId),
        obtenerProximosACobrar(cobradorId),
      ]);

    if (infoCobrador.status !== 200) {
      return infoCobrador;
    }

    return {
      status: 200,
      msg: "Dashboard del cobrador obtenido correctamente",
      data: {
        cobrador: infoCobrador.data,
        metricasDia: metricasDia.data,
        resumenSemanal: resumenSemanal.data,
        proximosACobrar: proximosACobrar.data,
      },
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al obtener dashboard del cobrador",
      data: null,
    };
  }
};

const obtenerPrestamosActivos = async (cobradorId) => {
  try {
    const cobrador = await UsuarioModel.findById(cobradorId);
    if (!cobrador) {
      return { status: 404, msg: "Cobrador no encontrado", data: null };
    }

    const zonaIds = cobrador.zonaACargo.map((z) => z._id);

    const clientes = await ClienteModel.find({
      zona: { $in: zonaIds },
      estado: "activo",
    }).lean();

    const clienteIds = clientes.map((c) => c._id);
    const prestamosActivos = await PrestamoModel.find({
      cliente: { $in: clienteIds },
      estado: "activo",
    })
      .populate("cliente", "nombre dni telefono")
      .populate("zona", "nombre")
      .lean();

    return {
      status: 200,
      msg: "Préstamos activos obtenidos correctamente",
      data: prestamosActivos,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al obtener préstamos activos",
      data: [],
    };
  }
};

const obtenerPrestamosVencidos = async (cobradorId) => {
  try {
    const cobrador = await UsuarioModel.findById(cobradorId);
    if (!cobrador) {
      return { status: 404, msg: "Cobrador no encontrado", data: null };
    }

    const zonaIds = cobrador.zonaACargo.map((z) => z._id);

    const clientes = await ClienteModel.find({
      zona: { $in: zonaIds },
      estado: "activo",
    }).lean();

    const clienteIds = clientes.map((c) => c._id);
    const prestamosVencidos = await PrestamoModel.find({
      cliente: { $in: clienteIds },
      estado: "vencido",
    })
      .populate("cliente", "nombre dni telefono")
      .populate("zona", "nombre")
      .lean();

    return {
      status: 200,
      msg: "Préstamos vencidos obtenidos correctamente",
      data: prestamosVencidos,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al obtener préstamos vencidos",
      data: [],
    };
  }
};

module.exports = {
  obtenerInfoCobrador,
  obtenerMetricasDia,
  obtenerResumenSemanal,
  obtenerProximosACobrar,
  obtenerMisZonas,
  obtenerInfoClientesPrestamos,
  obtenerDashboardCobrador,
  obtenerPrestamosActivos,
  obtenerPrestamosVencidos,
};
