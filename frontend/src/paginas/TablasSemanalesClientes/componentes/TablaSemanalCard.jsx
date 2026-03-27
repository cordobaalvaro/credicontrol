"use client"
import { Card, Badge, Button, Spinner } from "react-bootstrap"
import { IconChevronRight, IconSend, IconTrash } from "@tabler/icons-react"
import { useNavigate } from "react-router-dom"
import { formatARS } from "../../../helpers/currency"
import useTablaSemanalCard, { formatearFecha } from "../../../hooks/useTablaSemanalCard"
const TablaSemanalCard = ({ tabla, onTablaActualizada, onTablaEliminada, onActualizarTablas, modoCobrador = false }) => {
  const navigate = useNavigate()
  const {
    sending,
    deleting,
    handleEnviar,
    handleEliminar
  } = useTablaSemanalCard({
    tabla,
    onTablaActualizada,
    onTablaEliminada
  })
  const totalItems = Array.isArray(tabla.items) ? tabla.items.length : 0
  const estadoVariant = {
    borrador: "warning",
    enviada: "info",
    cerrada: "success",
  }[tabla.estado || "borrador"]
  return (
    <Card className="tabla-semanal-card shadow-sm h-100 tabla-semanal-card--base">
      <Card.Body className="p-3 p-md-4">
        <div className="d-flex justify-content-between align-items-start mb-3 tabla-semanal-header">
          <div>
            <Card.Title className="mb-2 fw-bold tabla-semanal-title">
              Semana del {formatearFecha(tabla.fechaInicio)} al {formatearFecha(tabla.fechaFin)}
            </Card.Title>
            <Card.Subtitle className="text-muted small d-flex align-items-center gap-2">
              <span className="tabla-semanal-cobrador-label">
                Cobrador:
              </span>
              <span className="fw-medium tabla-semanal-cobrador-name">
                {tabla.cobrador?.nombre || tabla.cobrador?.email || "Sin datos"}
              </span>
            </Card.Subtitle>
          </div>
          <Badge className="px-3 py-1 tabla-semanal-badge" bg={estadoVariant}>
            {tabla.estado || "borrador"}
          </Badge>
        </div>
        <div className="row g-4 mb-3 tabla-semanal-metrics">
          <div className={`col-6 ${tabla.montoTotalDeudaArrastrada > 0 ? 'col-sm-3' : 'col-sm-4'}`}>
            <div className="text-center">
              <div className="fw-bold h5 mb-1 tabla-semanal-metric-value tabla-semanal-metric-value--items">
                {totalItems}
              </div>
              <div className="small tabla-semanal-metric-label">
                Items
              </div>
            </div>
          </div>
          <div className={`col-6 ${tabla.montoTotalDeudaArrastrada > 0 ? 'col-sm-3' : 'col-sm-4'}`}>
            <div className="text-center">
              <div className="fw-bold h5 mb-1 tabla-semanal-metric-value tabla-semanal-metric-value--esperado">
                {formatARS(tabla.montoTotalEsperado)}
              </div>
              <div className="small tabla-semanal-metric-label">
                Esperado
              </div>
            </div>
          </div>
          {tabla.montoTotalDeudaArrastrada > 0 && (
            <div className="col-6 col-sm-3">
              <div className="text-center">
                <div className="fw-bold h5 mb-1 tabla-semanal-metric-value tabla-semanal-metric-value--deuda">
                  {formatARS(tabla.montoTotalDeudaArrastrada)}
                </div>
                <div className="small tabla-semanal-metric-label">
                  Deuda Ant.
                </div>
              </div>
            </div>
          )}
          <div className={`col-6 ${tabla.montoTotalDeudaArrastrada > 0 ? 'col-sm-3' : 'col-sm-4'}`}>
            <div className="text-center">
              <div className="fw-bold h5 mb-1 tabla-semanal-metric-value tabla-semanal-metric-value--cobrado">
                {formatARS(tabla.montoTotalCobrado)}
              </div>
              <div className="small tabla-semanal-metric-label">
                Cobrado
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center pt-3 mt-3 tabla-semanal-footer">
          <Button
            variant="link"
            className="p-0 d-flex align-items-center text-decoration-none tabla-semanal-link"
            onClick={() => navigate(`/tablas-semanal/${tabla._id}`, { state: { modoCobrador } })}
          >
            <IconChevronRight size={18} />
            <span className="ms-2">{modoCobrador ? "Cargar cobros" : "Ver detalle"}</span>
          </Button>
          <div className="d-flex align-items-center gap-2">
            {!modoCobrador && tabla.estado === "borrador" && (
              <Button
                variant="light"
                size="sm"
                onClick={handleEnviar}
                disabled={sending}
                className="d-flex align-items-center justify-content-center tabla-semanal-btn tabla-semanal-btn--send"
                title="Enviar al cobrador"
              >
                {sending ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <IconSend size={18} />
                )}
              </Button>
            )}
            {!modoCobrador && (
              <Button
                variant="light"
                size="sm"
                onClick={handleEliminar}
                disabled={deleting}
                className="d-flex align-items-center justify-content-center tabla-semanal-btn tabla-semanal-btn--delete"
                title="Eliminar tabla"
              >
                {deleting ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <IconTrash size={18} />
                )}
              </Button>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}
export default TablaSemanalCard
