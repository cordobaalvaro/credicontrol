import { useState, useEffect, useMemo } from 'react';
import { tablaSemanalService } from "../services";
const useTablasSemanalesClientes = () => {
    const [tablas, setTablas] = useState([]);
    const [allTablas, setAllTablas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [viewMode, setViewMode] = useState("cards");
    const [showModalGenerar, setShowModalGenerar] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [estadoFiltro, setEstadoFiltro] = useState("");
    const [mesFiltro, setMesFiltro] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    });
    const [cobradorFiltro, setCobradorFiltro] = useState("");
    const fetchAllTablas = async () => {
        try {
            const filtros = {};
            if (mesFiltro) filtros.mes = mesFiltro;
            const response = await tablaSemanalService.getTablas(filtros);
            setAllTablas(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error("Error al obtener todas las tablas para stats:", err);
        }
    };
    const fetchTablas = async (mostrarLoading = false) => {
        try {
            if (mostrarLoading) {
                setLoading(true);
            }
            setError("");
            const filtros = {};
            if (busqueda.trim()) filtros.busqueda = busqueda.trim();
            if (estadoFiltro) filtros.estado = estadoFiltro;
            if (mesFiltro) filtros.mes = mesFiltro;
            if (cobradorFiltro) filtros.cobrador = cobradorFiltro;
            const response = await tablaSemanalService.getTablas(filtros);
            setTablas(Array.isArray(response.data) ? response.data : []);
            await fetchAllTablas();
        } catch (err) {
            setError(err?.response?.data?.msg || "No se pudieron obtener las tablas semanales");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTablas(true);
    }, [busqueda, estadoFiltro, mesFiltro, cobradorFiltro]);
    useEffect(() => {
        fetchAllTablas();
    }, [mesFiltro]);
    const tablasBase = useMemo(() => (Array.isArray(tablas) ? tablas : []), [tablas]);
    const stats = useMemo(() => {
        const base = Array.isArray(allTablas) ? allTablas : [];
        return {
            total: base.length,
            borrador: base.filter((t) => t.estado === "borrador").length,
            enviada: base.filter((t) => t.estado === "enviada").length,
            cerrada: base.filter((t) => t.estado === "cerrada").length,
        };
    }, [allTablas]);
    const handleEstadoStatClick = (value) => {
        setEstadoFiltro((prev) => (prev === value ? "" : value));
    };
    const handleRefreshClick = () => {
        fetchTablas(true);
    };
    const handleActualizarTablas = () => {
        fetchTablas(true);
    };
    const handleTablaActualizada = (tablaActualizada) => {
        if (!tablaActualizada || !tablaActualizada._id) return;
        setTablas((prev) =>
            prev.map((t) => (t._id === tablaActualizada._id ? tablaActualizada : t)),
        );
        setAllTablas((prev) =>
            prev.map((t) => (t._id === tablaActualizada._id ? tablaActualizada : t)),
        );
    };
    const handleTablaCreada = (nuevaTabla) => {
        setTablas((prev) => [nuevaTabla, ...prev]);
        setAllTablas((prev) => [nuevaTabla, ...prev]);
    };
    const handleEliminarTabla = (tablaId) => {
        setTablas((prev) => prev.filter((t) => t._id !== tablaId));
        setAllTablas((prev) => prev.filter((t) => t._id !== tablaId));
    };
    return {
        tablas,
        loading,
        error,
        viewMode,
        setViewMode,
        showModalGenerar,
        setShowModalGenerar,
        busqueda,
        setBusqueda,
        estadoFiltro,
        mesFiltro,
        setMesFiltro,
        cobradorFiltro,
        setCobradorFiltro,
        tablasBase,
        stats,
        handleEstadoStatClick,
        handleRefreshClick,
        handleActualizarTablas,
        handleTablaActualizada,
        handleTablaCreada,
        handleEliminarTabla
    };
};
export default useTablasSemanalesClientes;
