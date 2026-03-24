import { useEffect, useRef, useState } from "react";
import { clienteService } from "../services";
import Swal from "sweetalert2";
const useClientesTotales = () => {
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroZona, setFiltroZona] = useState("conZona");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [seleccionados, setSeleccionados] = useState([]);
  const [seleccionarTodos, setSeleccionarTodos] = useState(false);
  const searchTimeoutRef = useRef(null);
  const isFirstLoadRef = useRef(true);
  const fetchClientes = async (filtros = {}) => {
    try {
      if (isFirstLoadRef.current) {
        setLoading(true);
      }
      const response = await clienteService.getClientes(filtros);
      const data = Array.isArray(response.data) ? response.data : [];
      setClientes(data);
      let filtrados = data;
      if (filtros.estado && filtros.estado !== "todos") {
        if (filtros.estado === "activo") {
          filtrados = filtrados.filter((c) => c.estado !== "inactivo");
        } else if (filtros.estado === "inactivo") {
          filtrados = filtrados.filter((c) => c.estado === "inactivo");
        }
      }
      if (filtros.zonaId === "conZona") {
        filtrados = filtrados.filter((c) => c.zona && c.zona._id);
      } else if (filtros.zonaId === "sinZona") {
        filtrados = filtrados.filter((c) => !c.zona || !c.zona._id);
      }
      setClientesFiltrados(filtrados);
      setError("");
    } catch (err) {
      setError("Error al cargar los clientes");
      setClientes([]);
      setClientesFiltrados([]);
    } finally {
      if (isFirstLoadRef.current) {
        setLoading(false);
        isFirstLoadRef.current = false;
      }
    }
  };
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      fetchClientes({
        q: busqueda.trim() || undefined,
        zonaId: filtroZona === "conZona" || filtroZona === "sinZona" ? filtroZona : undefined,
        estado: filtroEstado === "todos" ? undefined : filtroEstado,
      });
      setSeleccionados([]);
      setSeleccionarTodos(false);
    }, 400);
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [busqueda, filtroZona, filtroEstado]);
  const handleBusquedaChange = (e) => setBusqueda(e.target.value);
  const handleFiltroZonaChange = (f) => {
    const valor = f.target ? f.target.value : f;
    setFiltroZona(valor);
  };
  const handleFiltroEstadoChange = (e) => setFiltroEstado(e.target.value);
  const handleSeleccion = (id) =>
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const handleSeleccionarTodos = () => {
    if (seleccionarTodos) setSeleccionados([]);
    else setSeleccionados(clientesFiltrados.map((c) => c._id));
    setSeleccionarTodos(!seleccionarTodos);
  };
  const eliminarCliente = async (cliente) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Estás seguro?",
      text: `¿Eliminar a "${cliente.nombre}"?`,
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      await clienteService.eliminarCliente(cliente._id);
      await fetchClientes({
        q: busqueda.trim() || undefined,
        zonaId: filtroZona === "conZona" || filtroZona === "sinZona" ? filtroZona : undefined,
        estado: filtroEstado === "todos" ? undefined : filtroEstado,
      });
      Swal.fire({
        icon: "success",
        title: "¡Eliminado!",
        text: `El cliente "${cliente.nombre}" ha sido eliminado`,
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (err) {
      const msg =
        err?.response?.data?.msg ||
        (err?.request
          ? "No se pudo conectar con el servidor"
          : "Error al eliminar el cliente");
      Swal.fire({ icon: "error", title: "Error al eliminar", text: msg });
    }
  };
  const eliminarSeleccionados = async () => {
    if (seleccionados.length === 0) return;
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Estás seguro?",
      text: `¿Eliminar ${seleccionados.length} cliente(s)?`,
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
    });
    if (!result.isConfirmed) return;
    try {
      await Promise.all(
        seleccionados.map((id) =>
          clienteService.eliminarCliente(id)
        )
      );
      setSeleccionados([]);
      setSeleccionarTodos(false);
      setError("");
      await fetchClientes({
        q: busqueda.trim() || undefined,
        zonaId: filtroZona === "conZona" || filtroZona === "sinZona" ? filtroZona : undefined,
        estado: filtroEstado === "todos" ? undefined : filtroEstado,
      });
      Swal.fire({
        icon: "success",
        title: "¡Eliminados!",
        text: `Se eliminaron ${seleccionados.length} cliente(s)` ,
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (err) {
      const msg =
        err?.response?.data?.msg ||
        (err?.request
          ? "No se pudo conectar con el servidor"
          : "Error al eliminar clientes");
      Swal.fire({ icon: "error", title: "Error al eliminar", text: msg });
    }
  };
  const stats = {
    total: clientes.length,
    activos: clientes.filter((c) => c.estado !== "inactivo").length,
    inactivos: clientes.filter((c) => c.estado === "inactivo").length,
    conZona: clientes.filter((c) => c.zona).length,
    sinZona: clientes.filter((c) => !c.zona).length,
  };
  const cambiarEstadoCliente = async (cliente, nuevoEstado) => {
    const accion = nuevoEstado === "inactivo" ? "inactivar" : "activar";
    const result = await Swal.fire({
      icon: "question",
      title:
        nuevoEstado === "inactivo"
          ? "¿Marcar cliente como inactivo?"
          : "¿Marcar cliente como activo?",
      text: `Cliente: "${cliente.nombre}"`,
      showCancelButton: true,
      confirmButtonColor: "#198754",
      cancelButtonColor: "#6c757d",
      confirmButtonText:
        nuevoEstado === "inactivo" ? "Sí, inactivar" : "Sí, activar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      await clienteService.cambiarEstado(cliente._id, accion);
      await fetchClientes({
        q: busqueda.trim() || undefined,
        zonaId: filtroZona === "conZona" || filtroZona === "sinZona" ? filtroZona : undefined,
        estado: filtroEstado === "todos" ? undefined : filtroEstado,
      });
      Swal.fire({
        icon: "success",
        title:
          nuevoEstado === "inactivo"
            ? "Cliente inactivado"
            : "Cliente activado",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      const msg =
        err?.response?.data?.msg ||
        (err?.request
          ? "No se pudo conectar con el servidor"
          : "Error al cambiar el estado del cliente");
      Swal.fire({
        icon: "error",
        title: "Error al cambiar estado",
        text: msg,
      });
    }
  };
  return {
    clientes,
    clientesFiltrados,
    loading,
    error,
    busqueda,
    filtroZona,
    filtroEstado,
    seleccionados,
    seleccionarTodos,
    handleBusquedaChange,
    handleFiltroZonaChange,
    handleFiltroEstadoChange,
    handleSeleccion,
    handleSeleccionarTodos,
    eliminarCliente,
    eliminarSeleccionados,
    cambiarEstadoCliente,
    stats,
    fetchClientes,
  };
};
export default useClientesTotales;
