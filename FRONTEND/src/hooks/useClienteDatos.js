import { useEffect, useState } from "react";
import { clienteService, zonaService } from "../services";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
const useClienteDatos = (id) => {
  const { user } = useAuth();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [zonas, setZonas] = useState([]);
  const [resumenCliente, setResumenCliente] = useState(null);
  const userRole = user?.rol || "";
  useEffect(() => {
    const fetchResumenCliente = async ({ silent = false } = {}) => {
      try {
        const response = await clienteService.getResumenCliente(id);
        setResumenCliente(response.data);
      } catch (error) {
        if (!silent) {
          console.error("Error al obtener resumen:", error);
          Swal.fire({
            title: "Error",
            text: "No se pudo obtener el resumen del cliente",
            icon: "error",
            confirmButtonColor: "#3085d6",
          });
        }
      }
    };
    const fetchCliente = async () => {
      try {
        const response = await clienteService.getClienteById(id);
        setCliente(response.data);
        await fetchResumenCliente({ silent: true });
      } catch (err) {
        setError("Error al cargar los datos del cliente");
      } finally {
        setLoading(false);
      }
    };
    const fetchZonas = async () => {
      try {
        const response = await zonaService.getZonas();
        setZonas(response.data);
      } catch (err) {
      }
    };
    fetchCliente();
    fetchZonas();
  }, [id]);
  const obtenerResumenCliente = async ({ silent = false } = {}) => {
    try {
      const response = await clienteService.getResumenCliente(id);
      setResumenCliente(response.data);
      return response.data;
    } catch (error) {
      if (!silent) {
        console.error("Error al obtener resumen:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo obtener el resumen del cliente",
          icon: "error",
          confirmButtonColor: "#3085d6",
        });
      }
      return null;
    }
  };
  return {
    cliente,
    setCliente,
    loading,
    error,
    zonas,
    resumenCliente,
    obtenerResumenCliente,
    userRole,
  };
};
export default useClienteDatos;
