import { useState, useEffect, useMemo } from 'react';
import { usuarioService } from '../services';

const useVerClientes = () => {
    const [zonas, setZonas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [error, setError] = useState(null);

    const [modalClientes, setModalClientes] = useState({
        show: false,
        zona: null,
        clientes: [],
    });
    const [busquedaModal, setBusquedaModal] = useState("");

    useEffect(() => {
        const cargarMisZonas = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await usuarioService.getMisZonasCobradores();
                setZonas(data?.data || []);
            } catch (e) {
                setZonas([]);
                setError("Error al cargar las zonas. Intenta de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        };
        cargarMisZonas();
    }, []);

    const estadisticasGenerales = useMemo(() => {
        return zonas.reduce(
            (total, z) => ({
                totalClientes: total.totalClientes + z.estadisticas.totalClientes,
                clientesConPrestamos: total.clientesConPrestamos + z.estadisticas.clientesConPrestamos,
                totalPrestamos: total.totalPrestamos + z.estadisticas.totalPrestamos,
                cantidadACobrar: total.cantidadACobrar + z.estadisticas.cantidadACobrar,
                totalVencido: total.totalVencido + z.estadisticas.totalVencido,
            }),
            {
                totalClientes: 0,
                clientesConPrestamos: 0,
                totalPrestamos: 0,
                cantidadACobrar: 0,
                totalVencido: 0,
            },
        );
    }, [zonas]);

    const abrirModalClientes = (zona) => {
        setModalClientes({
            show: true,
            zona: zona,
            clientes: zona.clientes || [],
        });
        setBusquedaModal("");
    };

    const cerrarModalClientes = () => {
        setModalClientes({ show: false, zona: null, clientes: [] });
        setBusquedaModal("");
    };

    const clientesFiltradosModal = useMemo(() => {
        if (!modalClientes.clientes.length) return [];
        if (!busquedaModal.trim()) return modalClientes.clientes;
        const q = busquedaModal.toLowerCase();
        return modalClientes.clientes.filter(
            (c) =>
                c.nombre.toLowerCase().includes(q) ||
                (c.dni && c.dni.includes(busquedaModal)) ||
                (c.telefono && c.telefono.includes(busquedaModal)),
        );
    }, [modalClientes.clientes, busquedaModal]);

    const zonasFiltradas = useMemo(() => {
        if (!busqueda.trim()) return zonas;
        const q = busqueda.toLowerCase();
        return zonas.filter(
            (z) => z.nombre.toLowerCase().includes(q) || z.localidades?.some((loc) => loc.toLowerCase().includes(q)),
        );
    }, [zonas, busqueda]);

    return {
        zonas,
        loading,
        error,
        busqueda,
        setBusqueda,
        modalClientes,
        busquedaModal,
        setBusquedaModal,
        estadisticasGenerales,
        abrirModalClientes,
        cerrarModalClientes,
        clientesFiltradosModal,
        zonasFiltradas
    };
};

export default useVerClientes;
