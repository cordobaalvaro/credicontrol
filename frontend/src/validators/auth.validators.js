export const validarLogin = (usuarioLogin, contraseña) => {
  if (!usuarioLogin || !usuarioLogin.trim() || !contraseña || !contraseña.trim()) {
    return "Por favor, completa todos los campos obligatorios";
  }
  return null;
};


