const mongoose = require("mongoose")
const CounterModel = require("./counter.model")

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
    montoTotalEsperadoActivos: {
      type: Number,
      default: 0,
      min: 0,
    },
    montoTotalEsperadoVencidos: {
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
    numeroTabla: {
      type: Number,
      unique: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  },
)

tablaSemanalClientesSchema.pre("save", async function (next) {
  if (this.isNew && this.numeroTabla == null) {
    const TablaModel = mongoose.model("TablaSemanalClientes")
    const totalTablas = await TablaModel.countDocuments()

    if (totalTablas === 0) {
      await CounterModel.findByIdAndUpdate(
        { _id: "tablaSemanal" },
        { $set: { seq: 1 } },
        { upsert: true },
      )
      this.numeroTabla = 1
    } else {
      const ultimaTabla = await TablaModel.findOne({}, { numeroTabla: 1 }).sort({
        numeroTabla: -1,
      })
      const siguienteNumero = (ultimaTabla?.numeroTabla || 0) + 1

      await CounterModel.findByIdAndUpdate(
        { _id: "tablaSemanal" },
        { $set: { seq: siguienteNumero } },
        { upsert: true },
      )
      this.numeroTabla = siguienteNumero
    }
  }
  next()
})

const TablaSemanalClientesModel = mongoose.model(
  "TablaSemanalClientes",
  tablaSemanalClientesSchema,
)

module.exports = TablaSemanalClientesModel
