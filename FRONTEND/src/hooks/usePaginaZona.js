import { useState, useEffect } from "react";
import { zonaService, usuarioService } from "../../../services";
import { useAuth } from "../../../context/AuthContext";
import Swal from "sweetalert2";
const usePaginaZona = (id) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [overview, setOverview] = useState(null);
    const [clientesData, setClientesData] = useState({ items: [], page: 1, totalPages: 1, total: 0, limit: 20 });
    const [prestamosData, setPrestamosData] = useState({ items: [], page: 1, totalPages: 1, total: 0, limit: 20 });
    const [qClientes, setQClientes] = useState("");
    const [qPrestamos, setQPrestamos] = useState("");
    const [estadoPrestamos, setEstadoPrestamos] = useState("todos");
    const [showCobradorModal, setShowCobradorModal] = useState(false);
    const [cobradores, setCobradores] = useState([]);
    const [cobradorSeleccionado, setCobradorSeleccionado] = useState("");
    const [loadingCobradores, setLoadingCobradores] = useState(false);
    const [asignandoCobrador, setAsignandoCobrador] = useState(false);
    const { user } = useAuth();
    const usuario = user || { nombre: "Usuario" };
    const fetchOverview = async () => {
        const res = await zonaService.getZonaOverview(id);
        return res.data;
    };
    const fetchCobradoresDisponibles = async () => {
        try {
            setLoadingCobradores(true);
            const res = await usuarioService.getUsuarios();
            const usuarios = Array.isArray(res.data) ? res.data : [];
            const cobradoresList = usuarios.filter((u) => u.rol === "cobrador");
            const asignados = Array.isArray(overview?.zona?.cobrador) ? overview.zona.cobrador.map((c) => c._id) : [];
            setCobradores(cobradoresList.filter((c) => !asignados.includes(c._id)));
        } catch (e) {
            setCobradores([]);
            setError(e?.response?.data?.msg || "Error al cargar los cobradores");
        } finally {
            setLoadingCobradores(false);
        }
    };
    const asignarCobradorAZona = async () => {
        if (!cobradorSeleccionado || !id) return;
        try {
            setAsignandoCobrador(true);
            await zonaService.asignarCobrador(id, [cobradorSeleccionado]);
            setShowCobradorModal(false);
            setCobradorSeleccionado("");
            const ov = await fetchOverview();
            setOverview(ov);
            await Swal.fire({ icon: "success", title: "Cobrador agregado", timer: 1600, showConfirmButton: false });
        } catch (e) {
            const msg = e?.response?.data?.msg || "Error al asignar el cobrador";
            await Swal.fire({ icon: "error", title: "Error", text: msg });
        } finally {
            setAsignandoCobrador(false);
        }
    };
    const eliminarCobradorDeZona = async (cobradorId) => {
        if (!id || !cobradorId) return;
        const cobrador = Array.isArray(overview?.zona?.cobrador)
            ? overview.zona.cobrador.find((c) => c._id === cobradorId)
            : null;
        const nombre = cobrador ? `${cobrador.nombre} ${cobrador.apellido || ""}`.trim() : "este cobrador";
        const result = await Swal.fire({
            icon: "warning",
            title: "¿Eliminar cobrador?",
            text: `¿Quieres eliminar a ${nombre} de esta zona?`,
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
        });
        if (!result.isConfirmed) return;
        try {
            await zonaService.eliminarCobradorDeZona(id, cobradorId);
            const ov = await fetchOverview();
            setOverview(ov);
            await Swal.fire({ icon: "success", title: "Cobrador eliminado", timer: 1600, showConfirmButton: false });
        } catch (e) {
            const msg = e?.response?.data?.msg || "Error al eliminar el cobrador";
            await Swal.fire({ icon: "error", title: "Error", text: msg });
        }
    };
    const fetchClientes = async ({ q, page, limit } = {}) => {
        const filtros = {};
        if (q && q.trim()) filtros.q = q.trim();
        if (page) filtros.page = page;
        if (limit) filtros.limit = limit;
        const res = await zonaService.getClientesPorZona(id, filtros);
        return res.data;
    };
    const fetchPrestamos = async ({ q, estado, page, limit } = {}) => {
        const filtros = {};
        if (q && q.trim()) filtros.q = q.trim();
        if (estado && estado !== "todos") filtros.estado = estado;
        if (page) filtros.page = page;
        if (limit) filtros.limit = limit;
        const res = await zonaService.getPrestamosPorZona(id, filtros);
        return res.data;
    };
    const [isInitialMount, setIsInitialMount] = useState(true);
    const cargarTodo = async () => {
        if (!id) return;
        try {
            setLoading(true);
            setError("");
            const [ov, cli, pre] = await Promise.all([
                fetchOverview(),
                fetchClientes({ q: qClientes, page: 1, limit: clientesData.limit }),
                fetchPrestamos({ q: qPrestamos, estado: estadoPrestamos, page: 1, limit: prestamosData.limit }),
            ]);
            setOverview(ov);
            setClientesData(cli);
            setPrestamosData(pre);
            setIsInitialMount(false);
        } catch (e) {
            setError(e?.response?.data?.msg || "Error al cargar la zona");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        cargarTodo();
    }, [id]);
    useEffect(() => {
        if (isInitialMount || !id) return;
        const t = setTimeout(async () => {
            try {
                const cli = await fetchClientes({ q: qClientes, page: 1, limit: clientesData.limit });
                setClientesData(cli);
            } catch (e) {
                console.error("Error al buscar clientes:", e);
            }
        }, 400);
        return () => clearTimeout(t);
    }, [qClientes]);
    useEffect(() => {
        if (isInitialMount || !id) return;
        const t = setTimeout(async () => {
            try {
                const pre = await fetchPrestamos({ q: qPrestamos, estado: estadoPrestamos, page: 1, limit: prestamosData.limit });
                setPrestamosData(pre);
            } catch (e) {
                console.error("Error al buscar préstamos:", e);
            }
        }, 400);
        return () => clearTimeout(t);
    }, [qPrestamos, estadoPrestamos]);
    return {
        loading,
        error,
        overview,
        clientesData,
        setClientesData,
        prestamosData,
        setPrestamosData,
        qClientes,
        setQClientes,
        qPrestamos,
        setQPrestamos,
        estadoPrestamos,
        setEstadoPrestamos,
        showCobradorModal,
        setShowCobradorModal,
        cobradores,
        cobradorSeleccionado,
        setCobradorSeleccionado,
        loadingCobradores,
        asignandoCobrador,
        usuario,
        cargarTodo,
        fetchClientes,
        fetchPrestamos,
        fetchCobradoresDisponibles,
        asignarCobradorAZona,
        eliminarCobradorDeZona
    };
};
export default usePaginaZona;
