const mongoose = require("mongoose");
const { Schema } = mongoose;

const planesSchema = new Schema(
  {
    tabla: { type: String, required: true, trim: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

planesSchema.index({ tabla: 1, createdAt: -1 });

module.exports = mongoose.model("Plan", planesSchema, "datolibres");
