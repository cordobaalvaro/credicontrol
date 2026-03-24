const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  usuarioLogin: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  contraseña: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (v) {
        
        return /^[0-9]{10,15}$/.test(v);
      },
      message: 'El teléfono debe contener solo números y tener entre 10 y 15 dígitos'
    }
  },
  zonaACargo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Zona",
    },
  ],
  tablaSemanal: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TablaSemanalClientes",
    },
  ],
  rol: {
    type: String,
    enum: ["cobrador", "admin"],
    required: true,
  },
  tokenVersion: {
    type: Number,
    default: 0,
  },
});

const UsuarioModel = mongoose.model("Usuario", usuarioSchema);

module.exports = UsuarioModel;
