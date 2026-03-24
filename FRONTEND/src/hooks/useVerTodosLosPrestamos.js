import { useState, useEffect, useRef, useCallback } from "react";
import { prestamoService } from "../services";
const useVerTodosLosPrestamos = () => {
    const getEstadoBadge = (estado) => {
        switch (estado) {
            case "activo":
                return "bg-success";
            case "cancelado":
                return "bg-danger";
            case "vencido":
                return "bg-warning text-dark";
            case "desactivado":
                return "bg-secondary";
            default:
                return "bg-info text-dark";
        }
    };
    const [prestamos, setPrestamos] = useState([]);
    const [prestamosFiltrados, setPrestamosFiltrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filtro, setFiltro] = useState("");
    const [estadoFiltro, setEstadoFiltro] = useState("todos");
    const [filtroZona, setFiltroZona] = useState("todos");
    const [viewMode, setViewMode] = useState("list");
    const searchTimeoutRef = useRef(null);
    const isFirstLoadRef = useRef(true);
    const fetchPrestamos = useCallback(async ({ q, estado, zonaId } = {}) => {
        try {
            if (isFirstLoadRef.current) {
                setLoading(true);
            }
            const filtros = {};
            if (q) filtros.q = q;
            const res = await prestamoService.getPrestamos(filtros);
            const prestamosData = res?.data || res || [];
            setPrestamos(prestamosData);
            let filtrados = prestamosData;
            if (estado && estado !== "todos") {
                filtrados = filtrados.filter((p) => p.estado === estado);
            }
            if (zonaId === "conZona") {
                filtrados = filtrados.filter((p) => p.idZona);
            } else if (zonaId === "sinZona") {
                filtrados = filtrados.filter((p) => !p.idZona);
            }
            setPrestamosFiltrados(filtrados);
            setError("");
        } catch (error) {
            setError("No se pudieron cargar los préstamos");
            setPrestamos([]);
            setPrestamosFiltrados([]);
        } finally {
            if (isFirstLoadRef.current) {
                setLoading(false);
                isFirstLoadRef.current = false;
            }
        }
    }, []);
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = setTimeout(() => {
            fetchPrestamos({
                q: filtro.trim() || undefined,
                estado: estadoFiltro,
                zonaId: filtroZona
            });
        }, 400);
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [filtro, estadoFiltro, filtroZona, fetchPrestamos]);
    const stats = {
        total: prestamos.length,
        activos: prestamos.filter((p) => p.estado === "activo").length,
        cancelados: prestamos.filter((p) => p.estado === "cancelado").length,
        vencidos: prestamos.filter((p) => p.estado === "vencido").length,
        desactivados: prestamos.filter((p) => p.estado === "desactivado").length,
        conZona: prestamos.filter((p) => p.idZona).length,
        sinZona: prestamos.filter((p) => !p.idZona).length,
    };
    const handleEstadoStatClick = (value) => {
        setEstadoFiltro((prev) => (prev === value ? "todos" : value));
    };
    return {
        prestamosFiltrados,
        loading,
        error,
        filtro,
        setFiltro,
        estadoFiltro,
        setEstadoFiltro,
        filtroZona,
        setFiltroZona,
        viewMode,
        setViewMode,
        stats,
        handleEstadoStatClick,
        getEstadoBadge
    };
};
export default useVerTodosLosPrestamos;
