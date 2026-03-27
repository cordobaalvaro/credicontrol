import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { zonaService, clienteService, usuarioService } from "../services";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
const useZonaDetalle = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [zona, setZona] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isFirstLoadRef = useRef(true);
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [asignandoCliente, setAsignandoCliente] = useState(false);
  const [cobradores, setCobradores] = useState([]);
  const [cobradorSeleccionado, setCobradorSeleccionado] = useState("");
  const [loadingCobradores, setLoadingCobradores] = useState(false);
  const [asignandoCobrador, setAsignandoCobrador] = useState(false);
  const [seleccionados, setSeleccionados] = useState([]);
  const [seleccionarTodos, setSeleccionarTodos] = useState(false);
  const [busquedaClientesZona, setBusquedaClientesZona] = useState("");
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [showCobradorModal, setShowCobradorModal] = useState(false);
  const usuario = user || {
    nombre: "Usuario",
  };
  const fetchZona = async (textoBusqueda) => {
    try {
      if (isFirstLoadRef.current) {
        setLoading(true);
      }
      const params = {};
      if (textoBusqueda && textoBusqueda.trim()) {
        params.q = textoBusqueda.trim();
      }
      const res = await zonaService.getZonaById(id, params);
      setZona(res.data);
      setError("");
    } catch (e) {
      setError("Error al cargar la zona");
    } finally {
      if (isFirstLoadRef.current) {
        setLoading(false);
        isFirstLoadRef.current = false;
      }
    }
  };
  const fetchClientes = async () => {
    try {
      const res = await clienteService.getClientes();
      setClientes(res.data);
    } catch (e) {
      setError("Error al cargar los clientes");
    }
  };
  useEffect(() => {
    fetchZona();
    fetchClientes();
  }, []);
  useEffect(() => {
    if (!id) return;
    fetchZona(busquedaClientesZona);
  }, [busquedaClientesZona]);
  const handleBusquedaClientesZonaChange = (e) => {
    setBusquedaClientesZona(e.target.value);
  };
  const handleSeleccion = (clienteId) => {
    setSeleccionados((prev) =>
      prev.includes(clienteId)
        ? prev.filter((idSel) => idSel !== clienteId)
        : [...prev, clienteId]
    );
  };
  const handleSeleccionarTodos = () => {
    if (!zona) return;
    if (seleccionarTodos) {
      setSeleccionados([]);
    } else {
      setSeleccionados(zona.clientes.map((c) => c._id));
    }
    setSeleccionarTodos((s) => !s);
  };
  const eliminarSeleccionados = async () => {
    if (seleccionados.length === 0 || !zona) return;
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Estás seguro?",
      text: `¿Quieres eliminar ${seleccionados.length} cliente(s)? Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      await Promise.all(
        seleccionados.map((idCliente) =>
          zonaService.eliminarCliente(zona._id, idCliente)
        )
      );
      setSeleccionados([]);
      setSeleccionarTodos(false);
      setError("");
      await fetchZona();
      await Swal.fire({
        icon: "success",
        title: "¡Eliminados!",
        text: `Se eliminaron ${seleccionados.length} cliente(s)`,
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (e) {
      const errorText =
        e?.response?.data?.msg ||
        (e?.request
          ? "No se pudo conectar con el servidor"
          : "Error al eliminar clientes");
      Swal.fire({ icon: "error", title: "Error al eliminar", text: errorText });
    }
  };
  const fetchUsuarios = async () => {
    setLoadingCobradores(true);
    try {
      const res = await usuarioService.getUsuarios();
      const cobradoresList = res.data.filter((u) => u.rol === "cobrador");
      const asignados = zona?.cobrador?.map((c) => c._id) || [];
      setCobradores(cobradoresList.filter((c) => !asignados.includes(c._id)));
    } catch (e) {
      setError("Error al cargar los cobradores");
    } finally {
      setLoadingCobradores(false);
    }
  };
  const asignarCobradorAZona = async () => {
    if (!cobradorSeleccionado || !zona) return;
    setAsignandoCobrador(true);
    try {
      await zonaService.asignarCobradores(zona._id, [cobradorSeleccionado]);
      await fetchZona();
      setShowCobradorModal(false);
      setCobradorSeleccionado("");
      Swal.fire({
        icon: "success",
        title: "Cobrador agregado",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (e) {
      const errorText =
        e?.response?.data?.msg ||
        (e?.request
          ? "No se pudo conectar con el servidor"
          : "Error al asignar el cobrador");
      Swal.fire({ icon: "error", title: "Error al agregar", text: errorText });
    } finally {
      setAsignandoCobrador(false);
    }
  };
  const eliminarCobradorDeZona = async (cobradorId) => {
    const cobrador = zona?.cobrador?.find((c) => c._id === cobradorId);
    const nombre = cobrador
      ? `${cobrador.nombre} ${cobrador.apellido || ""}`
      : "este cobrador";
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Estás seguro?",
      text: `¿Quieres eliminar a ${nombre} de esta zona?`,
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      await zonaService.eliminarCobrador(zona._id, cobradorId);
      await fetchZona();
      Swal.fire({
        icon: "success",
        title: "Cobrador eliminado",
        text: `${nombre} ha sido eliminado de la zona`,
        timer: 1700,
        showConfirmButton: false,
      });
    } catch (e) {
      const errorText =
        e?.response?.data?.msg ||
        (e?.request
          ? "No se pudo conectar con el servidor"
          : "Error al eliminar el cobrador");
      Swal.fire({ icon: "error", title: "Error al eliminar", text: errorText });
    }
  };
  const handleAsignarCliente = async () => {
    if (!clienteSeleccionado) {
      Swal.fire({
        icon: "warning",
        title: "Cliente requerido",
        text: "Debes seleccionar un cliente",
      });
      return;
    }
    setAsignandoCliente(true);
    try {
      await zonaService.asignarCliente(id, clienteSeleccionado);
      await Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Cliente asignado exitosamente",
        timer: 1600,
        showConfirmButton: false,
      });
      setShowClienteModal(false);
      setClienteSeleccionado("");
      await fetchZona();
      await fetchClientes();
    } catch (e) {
      const status = e?.response?.data?.status;
      const msg = e?.response?.data?.msg;
      let title = "Error";
      let text = msg || "Error al asignar el cliente";
      if (status === 400) {
        title = "Cliente ya asignado";
      } else if (status === 404) {
        title = "No encontrado";
      } else if (status === 500) {
        title = "Error del servidor";
      }
      Swal.fire({ icon: "error", title, text });
    } finally {
      setAsignandoCliente(false);
    }
  };
  return {
    navigate,
    usuario,
    zona,
    loading,
    error,
    clientes,
    clienteSeleccionado,
    setClienteSeleccionado,
    asignandoCliente,
    cobradores,
    cobradorSeleccionado,
    setCobradorSeleccionado,
    loadingCobradores,
    asignandoCobrador,
    seleccionados,
    seleccionarTodos,
    showClienteModal,
    setShowClienteModal,
    showCobradorModal,
    setShowCobradorModal,
    fetchUsuarios,
    asignarCobradorAZona,
    eliminarCobradorDeZona,
    handleSeleccion,
    handleSeleccionarTodos,
    eliminarSeleccionados,
    handleAsignarCliente,
    busquedaClientesZona,
    handleBusquedaClientesZonaChange,
  };
};
export default useZonaDetalle;
