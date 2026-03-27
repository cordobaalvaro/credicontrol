const {
  generarTablaSemanalAdmin,
  obtenerTodasLasTablasSemanalAdmin,
  obtenerTablaSemanal,
  enviarTablaSemanalACobrador,
  obtenerMisTablasSemanalCobrador,
  guardarTablaSemanalMontos,
  guardarMontoItemTablaSemanalCobrador,
  cerrarTablaSemanal,
  eliminarTablaSemanalAdmin,
  editarMontosTablaSemanalAdmin,
  cargarItemTablaSemanalAdmin,
  traerPrestamosCobradores,
  agregarItemTablaAdmin,
  eliminarItemAdmin,
  trasladarItems,
  obtenerPlanDeCuotasPrestamo,
  modificarEsperado,
  obtenerUltimaTablaSemanalCobrador,
  obtenerUltimaTablaSemanalGeneral,
  abrirTablaSemanalAdmin,
} = require("../services/tablaSemanal.services")

const generarTablaSemanalCtrl = async (req, res) => {
  try {
    const { cobradorId, fechaInicio, fechaFin } = req.body || {}

    const resultado = await generarTablaSemanalAdmin({
      cobradorId,
      fechaInicio,
      fechaFin,
      adminId: req.idUsuario,
    })

    return res.status(resultado.status).json({ msg: resultado.msg, data: resultado.data })
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error inesperado al generar la tabla semanal", error: error.message })
  }
}

const guardarMontoItemTablaSemanal = async (req, res) => {
  try {
    const cobradorId = req.idUsuario
    const { id, itemId } = req.params
    const { montoCobrado } = req.body || {}

    const resultado = await guardarMontoItemTablaSemanalCobrador(cobradorId, id, itemId, montoCobrado)
    return res.status(resultado.status).json({ msg: resultado.msg, data: resultado.data })
  } catch (error) {
    return res.status(500).json({
      msg: "Error inesperado al guardar el monto del item",
      error: error.message,
    })
  }
}

const cerrarTablaSemanalCtrl = async (req, res) => {
  try {
    const userId = req.idUsuario
    const { id } = req.params
    const rol = req.rolUsuario 

    const resultado = await cerrarTablaSemanal(userId, id, rol)
    return res.status(resultado.status).json({ msg: resultado.msg, data: resultado.data })
  } catch (error) {
    return res.status(500).json({
      msg: "Error inesperado al cerrar la tabla semanal",
      error: error.message,
    })
  }
}

const cargarItemTablaSemanalCtrl = async (req, res) => {
  try {
    const adminId = req.idUsuario
    const { id, itemId } = req.params

    const resultado = await cargarItemTablaSemanalAdmin(adminId, id, itemId)
    return res.status(resultado.status).json({ msg: resultado.msg, data: resultado.data })
  } catch (error) {
    return res.status(500).json({
      msg: "Error inesperado al cargar el cobro del item",
      error: error.message,
    })
  }
}

const eliminarTablaSemanalCtrl = async (req, res) => {
  try {
    const { id } = req.params
    const resultado = await eliminarTablaSemanalAdmin(id)
    return res.status(resultado.status).json({ msg: resultado.msg, data: resultado.data })
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error inesperado al eliminar la tabla semanal", error: error.message })
  }
}

const obtenerTablasSemanalAdminCtrl = async (req, res) => {
  try {
    const { busqueda, estado, mes, cobrador } = req.query || {}

    const filtros = {
      busqueda: busqueda?.trim(),
      estado,
      mes,
      cobrador,
    }

    const resultado = await obtenerTodasLasTablasSemanalAdmin(filtros)
    return res.status(resultado.status).json({ msg: resultado.msg, data: resultado.data })
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error inesperado al obtener las tablas semanales", error: error.message })
  }
}

const obtenerTablaSemanalPorIdCtrl = async (req, res) => {
  try {
    const { id } = req.params
    const resultado = await obtenerTablaSemanal(id)
    return res.status(resultado.status).json({ msg: resultado.msg, data: resultado.data })
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error inesperado al obtener la tabla semanal", error: error.message })
  }
}

const enviarTablaSemanalCtrl = async (req, res) => {
  try {
    const { id } = req.params
    const resultado = await enviarTablaSemanalACobrador(id)
    return res.status(resultado.status).json({ msg: resultado.msg, data: resultado.data })
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error inesperado al enviar la tabla semanal", error: error.message })
  }
}

const obtenerMisTablasSemanalCtrl = async (req, res) => {
  try {
    const cobradorId = req.idUsuario

    const filtros = {
      busqueda: req.query.busqueda || "",
      estado: req.query.estado || "",
      mes: req.query.mes || "",
    }

    const resultado = await obtenerMisTablasSemanalCobrador(cobradorId, filtros)
    return res.status(resultado.status).json({ msg: resultado.msg, data: resultado.data })
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error inesperado al obtener las tablas del cobrador", error: error.message })
  }
}

const guardarMontosTablaSemanalCtrl = async (req, res) => {
  try {
    const cobradorId = req.idUsuario
    const { id } = req.params
    const { items, itemsMontos } = req.body || {}

    const listaMontos = Array.isArray(itemsMontos) ? itemsMontos : items

    const resultado = await guardarTablaSemanalMontos(cobradorId, id, listaMontos)
    return res.status(resultado.status).json({ msg: resultado.msg, data: resultado.data })
  } catch (error) {
    return res.status(500).json({
      msg: "Error inesperado al guardar los montos de la tabla semanal",
      error: error.message,
    })
  }
}

const editarMontosTablaSemanalCtrl = async (req, res) => {
  try {
    const { id } = req.params
    const { items } = req.body || {}

    const resultado = await editarMontosTablaSemanalAdmin(id, items)
    return res.status(resultado.status).json({ msg: resultado.msg, data: resultado.data })
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error inesperado al editar los montos de la tabla semanal", error: error.message })
  }
}

const traerPrestamosCobradoresCtrl = async (req, res) => {
  try {
    const filtros = req.query
    const resultado = await traerPrestamosCobradores(filtros)
    return res.status(resultado.status).json({ msg: resultado.msg, data: resultado.data })
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error inesperado al obtener préstamos de cobradores", error: error.message })
  }
}

const agregarItemTablaCtrl = async (req, res) => {
  try {
    const { id } = req.params
    const { prestamoId } = req.body

    if (!id || !prestamoId) {
      return res.status(400).json({
        msg: "El ID de la tabla y del préstamo son requeridos",
        data: null,
      })
    }

    const resultado = await agregarItemTablaAdmin(id, prestamoId)
    return res.status(resultado.status).json({ msg: resultado.msg, data: resultado.data })
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error inesperado al agregar préstamo a tabla semanal", error: error.message })
  }
}

const eliminarItemTablaCtrl = async (req, res) => {
  try {
    const { id, itemId } = req.params

    if (!id || !itemId) {
      return res.status(400).json({
        msg: "El ID de la tabla y del item son requeridos",
        data: null,
      })
    }

    const resultado = await eliminarItemAdmin(id, itemId)
    return res.status(resultado.status).json({ msg: resultado.msg, data: resultado.data })
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error inesperado al eliminar item de tabla semanal", error: error.message })
  }
}

const trasladarItemsCtrl = async (req, res) => {
  try {
    const { itemsIds, tablaDestinoId } = req.body || {}
    const tablaId = req.params.id

    if (!itemsIds || !Array.isArray(itemsIds) || itemsIds.length === 0) {
      return res.status(400).json({ msg: "Debe proporcionar los IDs de los items a trasladar" })
    }

    if (!tablaDestinoId) {
      return res.status(400).json({ msg: "Debe proporcionar el ID de la tabla destino" })
    }

    if (tablaId === tablaDestinoId) {
      return res.status(400).json({ msg: "La tabla destino no puede ser la misma que la tabla origen" })
    }

    const resultado = await trasladarItems(tablaId, itemsIds, tablaDestinoId)
    return res.status(resultado.status).json({ msg: resultado.msg, data: resultado.data })
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error inesperado al trasladar items entre tablas semanales", error: error.message })
  }
}

const obtenerPlanDeCuotasPrestamoCtrl = async (req, res) => {
  try {
    const { prestamoId } = req.params
    const resultado = await obtenerPlanDeCuotasPrestamo({ prestamoId })
    res.status(resultado.status).json(resultado)
  } catch (error) {
    res.status(500).json({ status: 500, msg: "Error interno del servidor", data: null })
  }
}

const modificarEsperadoCtrl = async (req, res) => {
  try {
    const { tablaId, itemId } = req.params
    const { nuevoMontoEsperado, numeroCuota } = req.body

    const resultado = await modificarEsperado({
      tablaId,
      itemId,
      nuevoMontoEsperado,
      numeroCuota,
    })

    res.status(resultado.status).json(resultado)
  } catch (error) {
    res.status(500).json({ status: 500, msg: "Error interno del servidor", data: null })
  }
}

const obtenerUltimaTablaSemanalCobradorCtrl = async (req, res) => {
  try {
    const { cobradorId } = req.params
    const resultado = await obtenerUltimaTablaSemanalCobrador(cobradorId)
    res.status(resultado.status).json(resultado)
  } catch (error) {
    res.status(500).json({
      status: 500,
      msg: "Error al obtener última tabla semanal del cobrador: " + error.message,
      data: null,
    })
  }
}

const obtenerUltimaTablaSemanalGeneralCtrl = async (req, res) => {
  try {
    const resultado = await obtenerUltimaTablaSemanalGeneral()
    res.status(resultado.status).json(resultado)
  } catch (error) {
    res.status(500).json({
      status: 500,
      msg: "Error al obtener última tabla semanal general: " + error.message,
      data: null,
    })
  }
}

const abrirTablaAdminCtrl = async (req, res) => {
  try {
    const { id } = req.params
    const resultado = await abrirTablaSemanalAdmin(req.idUsuario, id)
    return res.status(resultado.status).json({ msg: resultado.msg, data: resultado.data })
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error inesperado al abrir la tabla semanal", error: error.message })
  }
}

module.exports = {
  generarTablaSemanalCtrl,
  obtenerTablasSemanalAdminCtrl,
  obtenerTablaSemanalPorIdCtrl,
  enviarTablaSemanalCtrl,
  obtenerMisTablasSemanalCtrl,
  guardarMontosTablaSemanalCtrl,
  guardarMontoItemTablaSemanal,
  cerrarTablaSemanalCtrl,
  abrirTablaAdminCtrl,
  eliminarTablaSemanalCtrl,
  editarMontosTablaSemanalCtrl,
  cargarItemTablaSemanalCtrl,
  traerPrestamosCobradoresCtrl,
  agregarItemTablaCtrl,
  eliminarItemTablaCtrl,
  trasladarItemsCtrl,
  obtenerPlanDeCuotasPrestamoCtrl,
  modificarEsperadoCtrl,
  obtenerUltimaTablaSemanalCobradorCtrl,
  obtenerUltimaTablaSemanalGeneralCtrl,
}
