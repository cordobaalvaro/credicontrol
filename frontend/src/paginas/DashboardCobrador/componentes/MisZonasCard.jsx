import { useState } from "react"
import { Card, Badge } from "react-bootstrap"
import { IconMapPin, IconCash, IconAlertTriangle, IconUsers, IconCreditCard } from "@tabler/icons-react"
import ModalPrestamosActivos from "./ModalPrestamosActivos"
import ModalPrestamosVencidos from "./ModalPrestamosVencidos"
const MisZonasCard = ({ zonasData, loading, fetchPrestamosActivos, fetchPrestamosVencidos }) => {
  const [showModalActivos, setShowModalActivos] = useState(false)
  const [showModalVencidos, setShowModalVencidos] = useState(false)
  const [prestamosActivos, setPrestamosActivos] = useState([])
  const [prestamosVencidos, setPrestamosVencidos] = useState([])
  const [loadingActivos, setLoadingActivos] = useState(false)
  const [loadingVencidos, setLoadingVencidos] = useState(false)
  const handleVerActivos = async () => {
    setShowModalActivos(true)
    setLoadingActivos(true)
    try {
      const response = await fetchPrestamosActivos()
      if (response && response.status === 200) {
        setPrestamosActivos(response.data || [])
      }
    } catch (error) {
    } finally {
      setLoadingActivos(false)
    }
  }
  const handleVerVencidos = async () => {
    setShowModalVencidos(true)
    setLoadingVencidos(true)
    try {
      const response = await fetchPrestamosVencidos()
      if (response && response.status === 200) {
        setPrestamosVencidos(response.data || [])
      }
    } catch (error) {
    } finally {
      setLoadingVencidos(false)
    }
  }
  if (loading) {
    return (
      <Card className="border-0 shadow-sm h-100">
        <Card.Body className="text-center py-4">
          <div className="spinner-border spinner-border-sm text-success me-2" />
          <span className="text-muted">Cargando zonas...</span>
        </Card.Body>
      </Card>
    )
  }
  if (!zonasData || !zonasData.zonas || zonasData.zonas.length === 0) {
    return (
      <Card className="border-0 shadow-sm h-100">
        <Card.Body className="text-center py-4">
          <IconMapPin size={48} className="text-muted mb-3" />
          <h6 className="text-muted">No tienes zonas asignadas</h6>
          <small className="text-muted">Contacta al administrador para asignarte zonas</small>
        </Card.Body>
      </Card>
    )
  }
  return (
    <Card className="border-0 shadow-sm h-100 mis-zonas-card">
      <Card.Header className="border-0 bg-transparent py-3">
        <div className="d-flex align-items-center">
          <div className="me-3 mis-zonas-iconbox">
            <IconMapPin size={24} className="mis-zonas-iconbox__svg" />
          </div>
          <div className="flex-grow-1">
            <h6 className="mb-0 fw-semibold mis-zonas-title">
              Mis Zonas
            </h6>
            <small className="text-muted mis-zonas-subtitle">
              {zonasData.zonas.length} zona(s) asignada(s)
            </small>
          </div>
        </div>
      </Card.Header>
      <Card.Body className="pt-0">
        {}
        <div className="row g-3 mb-3">
          <div className="col-6">
            <div 
              className="text-center p-3 rounded-3 clickable-metric mis-zonas-metric mis-zonas-metric--primary" 
              onClick={handleVerActivos}
            >
              <div className="h4 mb-1 fw-bold mis-zonas-metric-value">
                ${zonasData.cantidadACobrar?.toLocaleString() || 0}
              </div>
              <div className="small mb-0 mis-zonas-metric-label">
                A Cobrar
              </div>
            </div>
          </div>
          <div className="col-6">
            <div 
              className="text-center p-3 rounded-3 clickable-metric mis-zonas-metric mis-zonas-metric--primary" 
              onClick={handleVerVencidos}
            >
              <div className="h4 mb-1 fw-bold mis-zonas-metric-value">
                ${zonasData.totalVencido?.toLocaleString() || 0}
              </div>
              <div className="small mb-0 mis-zonas-metric-label">
                Vencido
              </div>
            </div>
          </div>
        </div>
        {}
        <div className="row g-3">
          <div className="col-6">
            <div className="text-center p-2 rounded-2 mis-zonas-metric mis-zonas-metric--secondary">
              <div className="h5 mb-1 fw-semibold mis-zonas-metric-value--secondary">
                {zonasData.totalClientes || 0}
              </div>
              <div className="small mb-0 mis-zonas-metric-label--secondary">
                Clientes
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="text-center p-2 rounded-2 mis-zonas-metric mis-zonas-metric--secondary">
              <div className="h5 mb-1 fw-semibold mis-zonas-metric-value--secondary">
                {zonasData.totalPrestamos || 0}
              </div>
              <div className="small mb-0 mis-zonas-metric-label--secondary">
                Préstamos (Activos + Vencidos)
              </div>
            </div>
          </div>
        </div>
        {}
        <div className="mt-3 pt-3 border-top mis-zonas-divider">
          <small className="text-muted d-block mb-2 mis-zonas-list-title">
            Zonas asignadas:
          </small>
          <div className="d-flex flex-wrap gap-1">
            {zonasData.zonas.map((zona, index) => (
              <Badge 
                key={index}
                className="rounded-pill px-2 py-1 mis-zonas-badge"
              >
                {zona.nombre}
              </Badge>
            ))}
          </div>
        </div>
      </Card.Body>
      {}
      <ModalPrestamosActivos 
        show={showModalActivos}
        onHide={() => setShowModalActivos(false)}
        prestamosActivos={prestamosActivos}
        loading={loadingActivos}
      />
      <ModalPrestamosVencidos 
        show={showModalVencidos}
        onHide={() => setShowModalVencidos(false)}
        prestamosVencidos={prestamosVencidos}
        loading={loadingVencidos}
      />
    </Card>
  )
}
export default MisZonasCard
