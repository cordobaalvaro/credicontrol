export const validarMontoCobro = (monto) => {
  if (!monto || parseFloat(monto) <= 0) {
    return "Por favor ingrese un monto válido mayor que 0";
  }
  return null;
};

export const validarFechaCobro = (fechaPago) => {
  if (!fechaPago) {
    return "Por favor seleccione una fecha";
  }
  return null;
};


