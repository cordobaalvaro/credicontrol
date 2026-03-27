import { Card, Spinner, Alert } from "react-bootstrap";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { IconChartBar } from "@tabler/icons-react";
import useGraficoGananciasZonas from "../../../hooks/useGraficoGananciasZonas"
import "../DashboardAdmin.css"
const GraficoGananciasZonas = ({ filtroMes, filtroAnio }) => {
    const { data, loading, error } = useGraficoGananciasZonas(filtroMes, filtroAnio)
    const formatterMonto = (value) => `$${value.toLocaleString()}`;
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="custom-tooltip-label fw-bold mb-1">{`${label}`}</p>
                    {payload.map((entry, index) => (
                        <p
                            key={`item-${index}`}
                            className={`custom-tooltip-item mb-0 tooltip-color-${index}`}
                        >
                            {`${entry.name}: $${entry.value.toLocaleString()}`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };
    return (
        <Card
            className="border-0 shadow-sm mb-4 h-100 grafico-admin-card"
        >
            <Card.Header className="border-0 bg-transparent py-4">
                <div className="d-flex align-items-center">
                    <div className="me-3 grafico-icon-wrapper">
                        <IconChartBar size={22} className="grafico-icon" />
                    </div>
                    <div>
                        <h5 className="mb-0 fw-bold grafico-title">
                            Resumen Financiero Global
                        </h5>
                        <p className="text-muted small mb-0 grafico-subtitle">
                            Comparativa de prestado, cobrado y ganancia real
                        </p>
                    </div>
                </div>
            </Card.Header>
            <Card.Body className="pt-0 px-4 pb-4">
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2 text-muted small">Cargando gráfico...</p>
                    </div>
                ) : error ? (
                    <Alert variant="danger" className="text-center small py-2">
                        {error}
                    </Alert>
                ) : data.length === 0 ? (
                    <div className="text-center py-5">
                        <IconChartBar
                            size={48}
                            className="grafico-empty-icon"
                        />
                        <p className="mt-3 text-muted small">
                            No hay datos financieros para mostrar.
                        </p>
                    </div>
                ) : (
                    <div className="grafico-container">
                        <ResponsiveContainer>
                            <BarChart
                                data={data}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                />
                                <YAxis
                                    tickFormatter={formatterMonto}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar
                                    dataKey="Prestado"
                                    fill="var(--chart-bar-neutral)"
                                    radius={[4, 4, 0, 0]}
                                    barSize={70}
                                />
                                <Bar
                                    dataKey="Cobrado"
                                    fill="var(--chart-bar-primary)"
                                    radius={[4, 4, 0, 0]}
                                    barSize={70}
                                />
                                <Bar
                                    dataKey="Esperado"
                                    fill="var(--chart-bar-neutral-dark)"
                                    radius={[4, 4, 0, 0]}
                                    barSize={70}
                                />
                                <Bar
                                    dataKey="Ganancia"
                                    fill="var(--chart-bar-success)"
                                    radius={[4, 4, 0, 0]}
                                    barSize={70}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};
export default GraficoGananciasZonas;
