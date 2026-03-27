import { useState, useEffect, useMemo } from 'react';
import { tablaSemanalService } from "../services";
const useTablasSemanalesCobrador = () => {
    const [tablas, setTablas] = useState([]);
    const [allTablas, setAllTablas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [estadoFiltro, setEstadoFiltro] = useState("");
    const [mesFiltro, setMesFiltro] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    });
    const fetchAllTablas = async () => {
        try {
            const response = await tablaSemanalService.getMisTablas({ mes: mesFiltro });
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
            const response = await tablaSemanalService.getMisTablas(filtros);
            setTablas(Array.isArray(response.data) ? response.data : []);
            await fetchAllTablas();
        } catch (err) {
            setError(err?.response?.data?.msg || "No se pudieron obtener tus tablas semanales");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTablas(true);
    }, [busqueda, estadoFiltro, mesFiltro]);
    useEffect(() => {
        fetchAllTablas();
    }, [mesFiltro]);
    const stats = useMemo(() => {
        const base = Array.isArray(allTablas) ? allTablas : [];
        return {
            total: base.length,
            enviada: base.filter((t) => t.estado === "enviada").length,
            cerrada: base.filter((t) => t.estado === "cerrada").length,
        };
    }, [allTablas]);
    const handleTablaActualizada = (tablaActualizada) => {
        setTablas((prev) => prev.map((t) => (t._id === tablaActualizada._id ? tablaActualizada : t)));
        setAllTablas((prev) => prev.map((t) => (t._id === tablaActualizada._id ? tablaActualizada : t)));
    };
    const handleEstadoStatClick = (value) => {
        setEstadoFiltro((prev) => (prev === value ? "" : value));
    };
    const handleRefreshClick = () => {
        fetchTablas(true);
    };
    return {
        tablas,
        loading,
        error,
        busqueda,
        setBusqueda,
        estadoFiltro,
        mesFiltro,
        setMesFiltro,
        stats,
        handleTablaActualizada,
        handleEstadoStatClick,
        handleRefreshClick
    };
};
export default useTablasSemanalesCobrador;
