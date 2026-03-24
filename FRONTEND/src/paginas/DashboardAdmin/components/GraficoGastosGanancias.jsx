import React, { useState, useEffect } from "react";
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
import { IconWallet } from "@tabler/icons-react";
import useGraficoGastosGanancias from "../../../hooks/useGraficoGastosGanancias";
import "../DashboardAdmin.css";
const GraficoGastosGanancias = ({ filtroMes, filtroAnio }) => {
    const { data, loading, error } = useGraficoGastosGanancias({ filtroMes, filtroAnio });
    const formatterMonto = (value) => `$${value.toLocaleString()}`;
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="custom-tooltip-label fw-bold mb-1">{`Balance Nivel Global`}</p>
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
        <Card className="border-0 shadow-sm grafico-admin-card">
            <Card.Header className="border-0 bg-transparent py-4">
                <div className="d-flex align-items-center">
                    <div className="me-3 grafico-icon-container">
                        <IconWallet size={22} className="grafico-icon" />
                    </div>
                    <div>
                        <h5 className="mb-0 fw-semibold grafico-title">
                            Ganancia vs Gastos Totales
                        </h5>
                        <p className="text-muted grafico-subtitle mb-0">
                            Balance general restando los gastos del sistema
                        </p>
                    </div>
                </div>
            </Card.Header>
            <Card.Body className="pt-0 px-4 pb-4">
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="success" />
                        <p className="mt-2 text-muted small">Calculando balance real...</p>
                    </div>
                ) : error ? (
                    <Alert variant="danger" className="text-center small py-2">
                        {error}
                    </Alert>
                ) : data.length === 0 ? (
                    <div className="text-center py-5">
                        <IconWallet
                            size={48}
                            className="grafico-empty-icon"
                        />
                        <p className="mt-3 text-muted small">
                            No hay datos suficientes para el balance.
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
                                    width={80}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar
                                    dataKey="A Favor (Ganancia)"
                                    fill="var(--chart-bar-primary)"
                                    radius={[4, 4, 0, 0]}
                                    barSize={70}
                                />
                                <Bar
                                    dataKey="Gastos"
                                    fill="var(--chart-bar-danger)"
                                    radius={[4, 4, 0, 0]}
                                    barSize={70}
                                />
                                <Bar
                                    dataKey="Ganancia Neta"
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
export default GraficoGastosGanancias;
