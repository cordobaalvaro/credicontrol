import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { notificacionService } from "../services";
import { useAuth } from "./AuthContext";
const NotificationContext = createContext();
export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifs, setNotifs] = useState([]);
  const [notifCount, setNotifCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const fetchNotifs = useCallback(async () => {
    if (!isAuthenticated || user?.rol !== "admin") return;
    try {
      setLoading(true);
      const response = await notificacionService.getNotificaciones({ soloNoLeidas: true, limit: 10 });
      const items = response?.data?.items || [];
      setNotifs(items);
      setNotifCount(items.length);
    } catch (e) {
      console.error("Error fetching notifications:", e);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.rol]);
  const marcarTodasComoLeidas = async () => {
    try {
      await notificacionService.marcarTodasComoLeidas();
      await fetchNotifs();
    } catch (e) {
      console.error("Error marking all as read:", e);
    }
  };
  const marcarComoLeida = async (id) => {
    try {
      await notificacionService.marcarComoLeida(id);
      await fetchNotifs();
    } catch (e) {
      console.error("Error marking as read:", e);
    }
  };
  useEffect(() => {
    if (isAuthenticated && user?.rol === "admin") {
      fetchNotifs();
    } else {
      setNotifs([]);
      setNotifCount(0);
    }
  }, [isAuthenticated, user?.rol, fetchNotifs]);
  return (
    <NotificationContext.Provider
      value={{
        notifs,
        notifCount,
        fetchNotifs,
        marcarTodasComoLeidas,
        marcarComoLeida,
        loading
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications debe usarse dentro de un NotificationProvider");
  }
  return context;
};
export default NotificationContext;
