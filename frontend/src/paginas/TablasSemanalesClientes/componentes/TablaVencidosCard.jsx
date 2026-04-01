"use client"
import { useState } from "react"
import { Card, Badge, Button, Spinner } from "react-bootstrap"
import { IconChevronRight, IconAlertTriangle, IconClock, IconRefresh } from "@tabler/icons-react"

import TablaVencidosItemsList from "./TablaVencidosItemsList"
import { formatARS } from "../../../helpers/currency"
import "./TablaVencidosCard.css"
const formatearFecha = (fecha) => {
  if (!fecha) return "-";
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return "-";
  return `${d.toLocaleDateString("es-AR")} ${d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}`;
}
const TablaVencidosCard = ({ 
  tabla, 
  onTablaActualizada, 
  onVerDetalles,
  modoCobrador = false, 
  modoEdicionAdmin = false 
}) => {
  const [showDetalles, setShowDetalles] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const totalItems = Array.isArray(tabla.items) ? tabla.items.length : 0
  const montoTotalVencido = tabla.totalMontoVencido || 0
  const montoTotalCobrado = tabla.totalMontoCobrado || 0
  const porcentajeCobrado = montoTotalVencido > 0 ? (montoTotalCobrado / montoTotalVencido) * 100 : 0
  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      onTablaActualizada?.(tabla)
    } catch (error) {
      console.error("Error al actualizar tabla:", error)
    } finally {
      setRefreshing(false)
    }
  }
  const getEstadoVariant = (estado) => {
    switch (estado) {
      case "activa":
        return "success"
      case "cerrada":
        return "secondary"
      default:
        return "primary"
    }
  }
  const getEstadoIcon = (estado) => {
    switch (estado) {
      case "activa":
        return <IconClock size={16} />
      case "cerrada":
        return <IconRefresh size={16} />
      default:
        return <IconAlertTriangle size={16} />
    }
  }
  const formatMonto = (valor) => formatARS(valor)
  return (
    <Card className="tabla-vencidos-card shadow-sm h-100 border-0">
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1">
            <Card.Title className="mb-2 d-flex align-items-center gap-2 fw-bold">
              {getEstadoIcon(tabla.estado)}
              {tabla.nombre || "Préstamos Vencidos"}
            </Card.Title>
            <Card.Subtitle className="text-muted small">
              {tabla.descripcion}
            </Card.Subtitle>
          </div>
          <div className="d-flex gap-2">
            <Badge bg={getEstadoVariant(tabla.estado)} className="text-capitalize px-3 py-2">
              {tabla.estado || "activa"}
            </Badge>
          </div>
        </div>
        <div className="row g-3 mb-4">
          <div className="col-6">
            <div className="text-center p-3 rounded-3 stat-box-prestamos">
              <div className="fw-bold h5 mb-1 stat-value">
                {totalItems}
              </div>
              <div className="small stat-label">Préstamos</div>
            </div>
          </div>
          <div className="col-6">
            <div className="text-center p-3 rounded-3 stat-box-vencido">
              <div className="fw-bold h5 mb-1 stat-value">
                {formatMonto(montoTotalVencido)}
              </div>
              <div className="small stat-label">Vencido</div>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="small text-muted d-flex align-items-center gap-1">
              <span className="text-progreso-cobro">Progreso de cobro</span>
            </span>
            <span className="small fw-bold text-progreso-value">
              {porcentajeCobrado.toFixed(1)}%
            </span>
          </div>
          <div className="progress progress-container">
            <div 
              className={`progress-bar progress-bar-custom progress-${Math.round(porcentajeCobrado)}`}
              role="progressbar"
              aria-valuenow={porcentajeCobrado}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {porcentajeCobrado.toFixed(1)}%
            </div>
          </div>
          <div className="d-flex justify-content-between mt-2">
            <small className="text-muted">
              Cobrado: {formatMonto(montoTotalCobrado)}
            </small>
            <small className="text-muted">
              Pendiente: {formatMonto(montoTotalVencido - montoTotalCobrado)}
            </small>
          </div>
        </div>
        <div className="mb-4">
          <div className="small text-muted d-flex align-items-center gap-2 text-fecha-actualizacion">
            <IconClock size={14} />
            Última actualización: {formatearFecha(tabla.ultimaActualizacion)}
          </div>
        </div>
        <div className="mb-4">
          <TablaVencidosItemsList
            items={tabla.items || []}
            tablaId={tabla._id}
            modoCobrador={modoCobrador}
            modoEdicionAdmin={modoEdicionAdmin}
            onItemsActualizados={onTablaActualizada}
          />
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => onVerDetalles?.(tabla)}
            className="d-flex align-items-center flex-grow-1 rounded-3 btn-detalles-vencidos"
          >
            Ver detalles
            <IconChevronRight size={16} className="ms-1" />
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 d-flex align-items-center rounded-circle btn-refresh-vencidos"
            title="Actualizar"
          >
            {refreshing ? (
              <Spinner 
                as="span"
                animation="border"
                size="sm"
                className="stat-value"
              />
            ) : (
              <IconRefresh size={16} />
            )}
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}
export default TablaVencidosCard
