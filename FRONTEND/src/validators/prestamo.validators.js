export const validarPrestamoCreacion = (
  nuevoPrestamo,
  usarCuotaPersonalizada,
  montoCuotaPersonalizada
) => {
  const errores = {};
  if (!nuevoPrestamo.nombre || nuevoPrestamo.nombre.trim() === "")
    errores.nombre = "El nombre del préstamo es obligatorio";
  else if (nuevoPrestamo.nombre.length > 50)
    errores.nombre = "El nombre no puede exceder 50 caracteres";
  if (
    !nuevoPrestamo.montoInicial ||
    nuevoPrestamo.montoInicial.toString().trim() === ""
  )
    errores.montoInicial = "El monto inicial es obligatorio";
  else if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(nuevoPrestamo.montoInicial))
    errores.montoInicial =
      "Ingrese solo números positivos válidos (máx 2 decimales)";
  else if (parseFloat(nuevoPrestamo.montoInicial) <= 0)
    errores.montoInicial = "El monto inicial debe ser mayor a 0";
  else if (nuevoPrestamo.montoInicial.length > 12)
    errores.montoInicial = "El monto inicial es demasiado grande";
  if (
    !nuevoPrestamo.cantidadCuotas ||
    nuevoPrestamo.cantidadCuotas.toString().trim() === ""
  )
    errores.cantidadCuotas = "La cantidad de cuotas es obligatoria";
  else if (!/^[0-9]+$/.test(nuevoPrestamo.cantidadCuotas))
    errores.cantidadCuotas = "Ingrese solo números positivos";
  else if (parseInt(nuevoPrestamo.cantidadCuotas) <= 0)
    errores.cantidadCuotas = "La cantidad de cuotas debe ser mayor a 0";
  else if (parseInt(nuevoPrestamo.cantidadCuotas) > 36)
    errores.cantidadCuotas = "La cantidad máxima de cuotas es 36";
  else if (nuevoPrestamo.cantidadCuotas.length > 3)
    errores.cantidadCuotas = "El número de cuotas es demasiado grande";
  if (
    !nuevoPrestamo.fechaInicio ||
    nuevoPrestamo.fechaInicio.toString().trim() === ""
  )
    errores.fechaInicio = "La fecha de inicio es obligatoria";
  if (
    !nuevoPrestamo.frecuencia ||
    nuevoPrestamo.frecuencia.toString().trim() === ""
  )
    errores.frecuencia = "La frecuencia es obligatoria";
  if (usarCuotaPersonalizada) {
    if (!montoCuotaPersonalizada || montoCuotaPersonalizada.toString().trim() === "")
      errores.montoCuotaPersonalizada =
        "El monto de la cuota personalizada es obligatorio";
    else if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(montoCuotaPersonalizada))
      errores.montoCuotaPersonalizada =
        "Ingrese solo números positivos válidos (máx 2 decimales)";
    else if (parseFloat(montoCuotaPersonalizada) <= 0)
      errores.montoCuotaPersonalizada =
        "El monto de la cuota personalizada debe ser mayor a 0";
    else if (montoCuotaPersonalizada.length > 12)
      errores.montoCuotaPersonalizada =
        "El monto de la cuota personalizada es demasiado grande";
  } else {
    if (!nuevoPrestamo.interes || nuevoPrestamo.interes.toString().trim() === "")
      errores.interes = "El interés es obligatorio";
    else if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(nuevoPrestamo.interes))
      errores.interes =
        "Ingrese solo números positivos válidos (máx 2 decimales)";
    else if (parseFloat(nuevoPrestamo.interes) < 0)
      errores.interes = "El interés debe ser mayor o igual a 0";
    else if (nuevoPrestamo.interes.length > 6)
      errores.interes = "El interés es demasiado grande";
  }
  return errores;
};
export const validarPrestamoEdicion = (
  prestamoEditado,
  usarCuotaPersonalizadaEdit,
  montoCuotaPersonalizadaEdit
) => {
  const errores = {};
  if (!prestamoEditado.nombre || prestamoEditado.nombre.trim() === "")
    errores.nombre = "El nombre del préstamo es obligatorio";
  else if (prestamoEditado.nombre.length > 50)
    errores.nombre = "El nombre no puede exceder 50 caracteres";
  if (
    !prestamoEditado.montoInicial ||
    prestamoEditado.montoInicial.toString().trim() === ""
  )
    errores.montoInicial = "El monto inicial es obligatorio";
  else if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(prestamoEditado.montoInicial))
    errores.montoInicial =
      "Ingrese solo números positivos válidos (máx 2 decimales)";
  else if (parseFloat(prestamoEditado.montoInicial) <= 0)
    errores.montoInicial = "El monto inicial debe ser mayor a 0";
  else if (prestamoEditado.montoInicial.length > 12)
    errores.montoInicial = "El monto inicial es demasiado grande";
  if (
    !prestamoEditado.cantidadCuotas ||
    prestamoEditado.cantidadCuotas.toString().trim() === ""
  )
    errores.cantidadCuotas = "La cantidad de cuotas es obligatoria";
  else if (!/^[0-9]+$/.test(prestamoEditado.cantidadCuotas))
    errores.cantidadCuotas = "Ingrese solo números positivos";
  else if (parseInt(prestamoEditado.cantidadCuotas) <= 0)
    errores.cantidadCuotas = "La cantidad de cuotas debe ser mayor a 0";
  else if (parseInt(prestamoEditado.cantidadCuotas) > 36)
    errores.cantidadCuotas = "La cantidad máxima de cuotas es 36";
  else if (prestamoEditado.cantidadCuotas.length > 3)
    errores.cantidadCuotas = "El número de cuotas es demasiado grande";
  if (
    !prestamoEditado.frecuencia ||
    prestamoEditado.frecuencia.toString().trim() === ""
  )
    errores.frecuencia = "La frecuencia es obligatoria";
  if (usarCuotaPersonalizadaEdit) {
    if (
      !montoCuotaPersonalizadaEdit ||
      montoCuotaPersonalizadaEdit.toString().trim() === ""
    )
      errores.montoCuotaPersonalizadaEdit =
        "El monto de la cuota personalizada es obligatorio";
    else if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(montoCuotaPersonalizadaEdit))
      errores.montoCuotaPersonalizadaEdit =
        "Ingrese solo números positivos válidos (máx 2 decimales)";
    else if (parseFloat(montoCuotaPersonalizadaEdit) <= 0)
      errores.montoCuotaPersonalizadaEdit =
        "El monto de la cuota personalizada debe ser mayor a 0";
    else if (montoCuotaPersonalizadaEdit.length > 12)
      errores.montoCuotaPersonalizadaEdit =
        "El monto de la cuota personalizada es demasiado grande";
  } else {
    if (
      !prestamoEditado.interes ||
      prestamoEditado.interes.toString().trim() === ""
    )
      errores.interes = "El interés es obligatorio";
    else if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(prestamoEditado.interes))
      errores.interes =
        "Ingrese solo números positivos válidos (máx 2 decimales)";
    else if (parseFloat(prestamoEditado.interes) < 0)
      errores.interes = "El interés debe ser mayor o igual a 0";
    else if (prestamoEditado.interes.length > 6)
      errores.interes = "El interés es demasiado grande";
  }
  return errores;
};
