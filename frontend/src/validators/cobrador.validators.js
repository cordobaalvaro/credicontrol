export const validarNombre = (nombre) => {
  if (!nombre || nombre.trim() === "") {
    return "El nombre es obligatorio"
  }
  if (nombre.trim().length < 3) {
    return "El nombre debe tener al menos 3 caracteres"
  }
  if (nombre.trim().length > 50) {
    return "El nombre no puede exceder 50 caracteres"
  }
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre.trim())) {
    return "El nombre solo puede contener letras y espacios"
  }
  return null
}
export const validarUsuarioLogin = (usuarioLogin) => {
  if (!usuarioLogin || usuarioLogin.trim() === "") {
    return "El usuario de login es obligatorio"
  }
  if (usuarioLogin.trim().length < 3) {
    return "El usuario debe tener al menos 3 caracteres"
  }
  if (usuarioLogin.trim().length > 20) {
    return "El usuario no puede exceder 20 caracteres"
  }
  if (!/^[a-zA-Z0-9_]+$/.test(usuarioLogin.trim())) {
    return "El usuario solo puede contener letras, números y guiones bajos"
  }
  return null
}
export const validarTelefono = (telefono) => {
  if (!telefono || telefono.trim() === "") {
    return "El teléfono es obligatorio"
  }
  const telefonoLimpio = telefono.trim().replace(/\s|-|\(|\)/g, "")
  if (!/^[0-9]+$/.test(telefonoLimpio)) {
    return "El teléfono debe contener solo números"
  }
  if (telefonoLimpio.length < 10) {
    return "El teléfono debe tener al menos 10 dígitos"
  }
  if (telefonoLimpio.length > 15) {
    return "El teléfono no puede exceder 15 dígitos"
  }
  return null
}
export const validarContraseña = (contraseña) => {
  if (!contraseña || contraseña.trim() === "") {
    return "La contraseña es obligatoria"
  }
  if (contraseña.length < 6) {
    return "La contraseña debe tener al menos 6 caracteres"
  }
  if (contraseña.length > 50) {
    return "La contraseña no puede exceder 50 caracteres"
  }
  if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(contraseña)) {
    return "La contraseña debe contener al menos una letra y un número"
  }
  return null
}
export const validarConfirmarContraseña = (contraseña, confirmarContraseña) => {
  if (!confirmarContraseña || confirmarContraseña.trim() === "") {
    return "Debe confirmar la contraseña"
  }
  if (contraseña !== confirmarContraseña) {
    return "Las contraseñas no coinciden"
  }
  return null
}
export const validarFormularioCobrador = (datos) => {
  const errores = {}
  const errorNombre = validarNombre(datos.nombre)
  if (errorNombre) errores.nombre = errorNombre
  const errorUsuario = validarUsuarioLogin(datos.usuarioLogin)
  if (errorUsuario) errores.usuarioLogin = errorUsuario
  const errorTelefono = validarTelefono(datos.telefono)
  if (errorTelefono) errores.telefono = errorTelefono
  const errorContraseña = validarContraseña(datos.contraseña)
  if (errorContraseña) errores.contraseña = errorContraseña
  const errorConfirmar = validarConfirmarContraseña(datos.contraseña, datos.confirmarContraseña)
  if (errorConfirmar) errores.confirmarContraseña = errorConfirmar
  return errores
}
