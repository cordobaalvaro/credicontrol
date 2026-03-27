export const validarNombre = (nombre) => {
  if (!nombre || !nombre.trim()) return "El nombre es obligatorio";
  if (nombre.trim().length < 2)
    return "El nombre debe tener al menos 2 caracteres";
  if (nombre.trim().length > 50)
    return "El nombre no puede exceder 50 caracteres";
  if (!/^[a-zA-ZÀ-ÿñÑ\s]+$/.test(nombre.trim()))
    return "El nombre solo puede contener letras y espacios";
  return null;
};
export const validarDNI = (dni) => {
  if (!dni || !dni.trim()) return "El DNI es obligatorio";
  if (!/^\d{7,8}$/.test(dni.trim()))
    return "El DNI debe contener solo números y tener entre 7 y 8 dígitos";
  return null;
};
export const validarTelefono = (telefono) => {
  if (!telefono || !telefono.trim()) return "El teléfono es obligatorio";
  if (!/^[\d\s\-\+\(\)]{8,15}$/.test(telefono.trim()))
    return "El teléfono debe tener entre 8 y 15 caracteres y solo contener números, espacios, guiones, paréntesis o signo +";
  return null;
};
export const validarDireccion = (direccion) => {
  if (!direccion || !direccion.trim()) return "La dirección es obligatoria";
  if (direccion.trim().length < 5)
    return "La dirección debe tener al menos 5 caracteres";
  if (direccion.trim().length > 200)
    return "La dirección no puede exceder 200 caracteres";
  return null;
};
export const validarBarrio = (barrio) => {
  if (!barrio || !barrio.trim()) return "El barrio es obligatorio";
  if (barrio.trim().length > 100)
    return "El barrio no puede exceder 100 caracteres";
  return null;
};
export const validarCiudad = (ciudad) => {
  if (!ciudad || !ciudad.trim()) return "La ciudad es obligatoria";
  if (ciudad.trim().length > 100)
    return "La ciudad no puede exceder 100 caracteres";
  if (!/^[a-zA-ZÀ-ÿñÑ\s\.\-]+$/.test(ciudad.trim()))
    return "La ciudad solo puede contener letras, espacios, puntos y guiones";
  return null;
};
export const validarLocalidad = (localidad) => {
  if (!localidad || !localidad.trim()) return "La localidad es obligatoria";
  if (localidad.trim().length > 100)
    return "La localidad no puede exceder 100 caracteres";
  if (!/^[a-zA-ZÀ-ÿñÑ\s\.\-]+$/.test(localidad.trim()))
    return "La localidad solo puede contener letras, espacios, puntos y guiones";
  return null;
};
export const validarFechaNacimiento = (fecha) => {
  if (!fecha || !fecha.trim()) return "La fecha de nacimiento es obligatoria";
  const fechaNacimiento = new Date(fecha);
  const hoy = new Date();
  const edad = (hoy - fechaNacimiento) / (365.25 * 24 * 60 * 60 * 1000);
  if (edad < 18) return "El cliente debe ser mayor de 18 años";
  if (edad > 120) return "La fecha de nacimiento no es válida";
  return null;
};
export const validarDireccionComercial = (direccionComercial) => {
  if (!direccionComercial || !direccionComercial.trim())
    return "La dirección comercial es obligatoria";
  if (direccionComercial.trim().length > 200)
    return "La dirección comercial no puede exceder 200 caracteres";
  return null;
};
export const validarTipoDeComercio = (tipoDeComercio) => {
  if (!tipoDeComercio || !tipoDeComercio.trim())
    return "El tipo de comercio es obligatorio";
  if (tipoDeComercio.trim().length > 100)
    return "El tipo de comercio no puede exceder 100 caracteres";
  if (!/^[a-zA-ZÀ-ÿñÑ\s\.\-]+$/.test(tipoDeComercio.trim()))
    return "El tipo de comercio solo puede contener letras, espacios, puntos y guiones";
  return null;
};
export const validarDireccionCobro = (direccionCobro) => {
  if (!direccionCobro || !direccionCobro.trim())
    return "La dirección de cobro es obligatoria";
  if (!["direccion", "direccionComercial"].includes(direccionCobro))
    return "La dirección de cobro debe ser 'direccion' o 'direccionComercial'";
  return null;
};
