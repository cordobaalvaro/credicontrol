import { useState, useEffect } from "react";
import { dashboardService, gastoService } from "../services";

const useGraficoGastosGanancias = ({ filtroMes, filtroAnio }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                
                const resGanancias = await dashboardService.getEstadisticasGanancias(filtroMes, filtroAnio);

                
                const a = parseInt(filtroAnio);
                const m = parseInt(filtroMes);
                const lastDay = new Date(a, m, 0).getDate();
                const start = `${a}-${String(m).padStart(2, '0')}-01T00:00:00.000Z`;
                const end = `${a}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}T23:59:59.999Z`;

                const resGastos = await gastoService.getGastos({ fechaInicio: start, fechaFin: end });

                let totalGananciaPrestamos = 0;
                if (resGanancias.data) {
                    totalGananciaPrestamos = resGanancias.data.reduce(
                        (acc, item) => acc + (item.gananciaRealActual || 0),
                        0
                    );
                }

                let totalGastos = 0;
                if (resGastos.data) {
                    totalGastos = resGastos.data.reduce(
                        (acc, item) => acc + (item.monto || 0),
                        0
                    );
                }

                const gananciaNeta = totalGananciaPrestamos - totalGastos;

                setData([
                    {
                        name: "Balance",
                        "A Favor (Ganancia)": totalGananciaPrestamos,
                        Gastos: totalGastos,
                        "Ganancia Neta": gananciaNeta,
                    },
                ]);
            } catch (err) {
                console.error("Error fetching gastos vs ganancias:", err);
                setError("No se pudieron cargar los datos de gastos y ganancias.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filtroMes, filtroAnio]);

    return { data, loading, error };
};

export default useGraficoGastosGanancias;
