export const validarZona = (nombre, localidades) => {
  if (!nombre || typeof nombre !== "string" || !nombre.trim()) {
    return "El nombre de la zona es obligatorio";
  }
  if (!localidades || !Array.isArray(localidades) || localidades.length === 0) {
    return "Debe agregar al menos una localidad";
  }
  return null;
};


