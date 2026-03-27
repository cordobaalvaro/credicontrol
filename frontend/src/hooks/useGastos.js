import { useState, useEffect, useCallback } from "react";
import { gastoService } from "../services";
import Swal from "sweetalert2";

const useGastos = () => {
    const [gastos, setGastos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtroMes, setFiltroMes] = useState("");

    const cargarGastos = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const filtros = {};
            if (filtroMes) {
                const [year, month] = filtroMes.split('-');
                const fechaInicio = new Date(year, month - 1, 1).toISOString();
                const fechaFin = new Date(year, month, 0, 23, 59, 59).toISOString();
                filtros.fechaInicio = fechaInicio;
                filtros.fechaFin = fechaFin;
            }

            const response = await gastoService.getGastos(filtros);
            if (response) {
                setGastos(response.data);
            }
        } catch (err) {
            console.error("Error al cargar gastos:", err);
            setError("No se pudieron cargar los gastos. Intente nuevamente.");
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al cargar gastos",
            });
        } finally {
            setLoading(false);
        }
    }, [filtroMes]);

    useEffect(() => {
        const hoy = new Date();
        const mesActualYYYYMM = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
        setFiltroMes(mesActualYYYYMM);
    }, []);

    useEffect(() => {
        if (filtroMes) {
            cargarGastos();
        }
    }, [filtroMes, cargarGastos]);

    const crearGasto = async (gastoData) => {
        try {
            const data = await gastoService.crearGasto(gastoData);
            return data;
        } catch (error) {
            throw error.response?.data?.msg || "Error al crear gasto";
        }
    };

    const editarGasto = async (id, gastoData) => {
        try {
            const data = await gastoService.updateGasto(id, gastoData);
            return data;
        } catch (error) {
            throw error.response?.data?.msg || "Error al editar gasto";
        }
    };

    const borrarGasto = async (idGasto) => {
        try {
            const data = await gastoService.eliminarGasto(idGasto);
            return data;
        } catch (error) {
            throw error.response?.data?.msg || "Error al borrar gasto";
        }
    };

    return {
        gastos,
        loading,
        error,
        filtroMes,
        setFiltroMes,
        cargarGastos,
        crearGasto,
        editarGasto,
        borrarGasto
    };
};

export default useGastos;
