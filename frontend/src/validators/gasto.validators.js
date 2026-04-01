export const validarMontoGasto = (monto) => {
  if (!monto || Number(monto) <= 0) {
    return "Ingrese un monto válido mayor a 0.";
  }
  return null;
};

export const validarTipoGasto = (tipo) => {
  if (!tipo || typeof tipo !== "string" || !tipo.trim()) {
    return "Seleccione un tipo de gasto.";
  }
  return null;
};


