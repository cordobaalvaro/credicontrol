const mongoose = require('mongoose');

const gastoSchema = new mongoose.Schema({
    monto: {
        type: Number,
        required: [true, 'El monto del gasto es obligatorio'],
        min: [0, 'El monto no puede ser negativo']
    },
    tipo: {
        type: String,
        required: [true, 'El tipo de gasto es obligatorio'],
        trim: true
    },
    descripcion: {
        type: String,
        trim: true,
        default: ''
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    registradoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false 
    }
}, {
    timestamps: true,
    versionKey: false
});

const Gasto = mongoose.model('Gasto', gastoSchema);

module.exports = Gasto;
