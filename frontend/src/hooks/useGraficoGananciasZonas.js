import { useState, useEffect } from "react";
import { dashboardService } from "../services";

const useGraficoGananciasZonas = (filtroMes, filtroAnio) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEstadisticas();
    }, [filtroMes, filtroAnio]);

    const fetchEstadisticas = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await dashboardService.getEstadisticasGanancias(filtroMes, filtroAnio);
            
            if (res.data) {
                
                const totales = res.data.reduce((acc, item) => {
                    acc.Prestado += item.totalPrestado || 0;
                    acc.Cobrado += item.totalCobrado || 0;
                    acc.Esperado += item.totalEsperado || 0;
                    acc.Ganancia += item.gananciaRealActual || 0;
                    return acc;
                }, { name: "Total", Prestado: 0, Cobrado: 0, Esperado: 0, Ganancia: 0 });

                setData([totales]);
            }
        } catch (err) {
            console.error("Error fetching estadisticas ganancias:", err);
            setError("No se pudieron cargar las estadísticas financieras.");
        } finally {
            setLoading(false);
        }
    };

    return {
        data,
        loading,
        error
    };
};

export default useGraficoGananciasZonas;
