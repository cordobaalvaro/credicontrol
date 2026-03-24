import { createContext, useContext, useState, useEffect } from "react";
import { setAccessToken, clearAccessToken } from "../helpers/axios.helpers";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const tokenData = sessionStorage.getItem("token");
    const rolData = sessionStorage.getItem("rol");
    const nombreData = sessionStorage.getItem("nombre");
    const idData = sessionStorage.getItem("id");
    const token = tokenData && tokenData !== "undefined" ? JSON.parse(tokenData) : null;
    const rol = rolData && rolData !== "undefined" ? JSON.parse(rolData) : null;
    const nombre = nombreData && nombreData !== "undefined" ? JSON.parse(nombreData) : null;
    const id = idData && idData !== "undefined" ? JSON.parse(idData) : null;
    if (token && rol && nombre) {
      setAccessToken(token);
      setUser({ token, rol, nombre, id });
    }
    setLoading(false);
  }, []);
  const login = (userData) => {
    const { token, rol, nombre, id } = userData;
    sessionStorage.setItem("token", JSON.stringify(token));
    sessionStorage.setItem("rol", JSON.stringify(rol));
    sessionStorage.setItem("nombre", JSON.stringify(nombre));
    sessionStorage.setItem("id", JSON.stringify(id));
    setAccessToken(token);
    setUser({ token, rol, nombre, id });
  };
  const logout = () => {
    clearAccessToken();
    sessionStorage.clear();
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
export default AuthContext;
