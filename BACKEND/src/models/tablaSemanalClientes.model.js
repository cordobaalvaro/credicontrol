const mongoose = require("mongoose")

const itemTablaSemanalSchema = new mongoose.Schema(
  {
    prestamo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prestamo",
      required: true,
    },
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
      required: true,
    },
    zona: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Zona",
      required: true,
    },
    cobrador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    
    cuotasSemana: [
      {
        numero: { type: Number, required: true },
        fechaVencimiento: { type: Date, required: true },
        monto: { type: Number, required: true, min: 0 },
      },
    ],
    montoCuotasEsperadoSemana: {
      type: Number,
      required: true,
      min: 0,
    },
    montoTotalPrestamo: {
      type: Number,
      required: true,
      min: 0,
    },
    saldoPendiente: {
      type: Number,
      required: true,
      min: 0,
    },
    saldoPendienteVencimiento: {
      type: Number,
      min: 0,
    },
    
    montoCobrado: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    deudaArrastrada: {
      type: Number,
      default: 0,
      min: 0,
    },
    estado: {
      type: String,
      enum: ["pendiente", "enviado", "reportado", "cargado"],
      default: "pendiente",
      required: true,
    },
  },
  {
    _id: true,
  },
)

const tablaSemanalClientesSchema = new mongoose.Schema(
  {
    cobrador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    zonas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Zona",
      },
    ],
    fechaInicio: {
      type: Date,
      required: true,
    },
    fechaFin: {
      type: Date,
      required: true,
    },
    estado: {
      type: String,
      enum: ["borrador", "enviada", "cerrada"],
      default: "borrador",
      required: true,
    },
    montoTotalEsperado: {
      type: Number,
      default: 0,
      min: 0,
    },
    montoTotalCobrado: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    montoTotalDeudaArrastrada: {
      type: Number,
      default: 0,
      min: 0,
    },
    items: {
      type: [itemTablaSemanalSchema],
      default: [],
    },
    
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  {
    timestamps: true,
  },
)

const TablaSemanalClientesModel = mongoose.model(
  "TablaSemanalClientes",
  tablaSemanalClientesSchema,
)

module.exports = TablaSemanalClientesModel
