"use client"
import { Form, Button, Card } from 'react-bootstrap'
import UnifiedListItem from '../../../componentes/ui/UnifiedListItem/UnifiedListItem'
import { IconEye, IconSearch } from '@tabler/icons-react'
const ZonaPrestamosTab = ({
  prestamosData,
  qPrestamos,
  setQPrestamos,
  estadoPrestamos,
  setEstadoPrestamos,
  fetchPrestamos,
  setPrestamosData,
  navigate,
  getEstadoBadge
}) => {
  return (
    <Card className="zona-tab-card shadow-sm border-0">
      <div className="zona-tab-filter-section d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div className="zona-tab-title-group">
          <h6>Préstamos de la zona</h6>
          <small>Buscar por cliente o número de préstamo</small>
        </div>
        <div className="zona-tab-search-container">
          <div className="zona-tab-search-wrapper">
            <IconSearch className="zona-tab-search-icon" size={20} />
            <Form.Control
              type="text"
              placeholder="Buscar préstamo..."
              className="zona-tab-search-input"
              value={qPrestamos}
              onChange={(e) => setQPrestamos(e.target.value)}
            />
          </div>
          <div className="zona-tab-select-wrapper">
            <Form.Select
              className="zona-tab-select"
              value={estadoPrestamos}
              onChange={(e) => setEstadoPrestamos(e.target.value)}
            >
              <option value="todos">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="vencido">Vencidos</option>
            </Form.Select>
          </div>
        </div>
      </div>
      <Card.Body className="zona-tab-list-container">
        <div className="unified-list-items">
          {prestamosData.items.map((p) => {
            const data = {
              ...p,
              estadoBadge: getEstadoBadge(p.estado)
            }
            const acciones = [
              {
                icon: IconEye,
                title: "Ver detalles",
                onClick: () => navigate(`/prestamo/${p._id}`),
                color: "var(--verde-principal)"
              }
            ]
            return (
              <UnifiedListItem
                key={p._id}
                tipo="prestamo"
                data={data}
                showCheckbox={false}
                onClick={() => navigate(`/prestamo/${p._id}`)}
                acciones={acciones}
              />
            )
          })}
          {prestamosData.items.length === 0 && (
            <div className="no-results-premium">
              <div className="no-results-icon-container">
                <IconSearch size={32} />
              </div>
              <h5 className="no-results-title">No se encontraron préstamos</h5>
              <p className="no-results-text">
                No hay préstamos registrados en esta zona que coincidan con tu búsqueda.
              </p>
            </div>
          )}
        </div>
      </Card.Body>
      <div className="zona-tab-pagination d-flex justify-content-between align-items-center">
        <small className="text-muted fw-medium">Total: {prestamosData.total || 0}</small>
        <div className="d-flex gap-2">
          <Button
            variant="light"
            size="sm"
            className="rounded-pill px-3"
            disabled={(prestamosData.page || 1) <= 1}
            onClick={async () => {
              const page = Math.max(1, (prestamosData.page || 1) - 1)
              const pre = await fetchPrestamos({ q: qPrestamos, estado: estadoPrestamos, page, limit: prestamosData.limit })
              setPrestamosData(pre)
            }}
          >
            Anterior
          </Button>
          <Button
            variant="light"
            size="sm"
            className="rounded-pill px-3"
            disabled={(prestamosData.page || 1) >= (prestamosData.totalPages || 1)}
            onClick={async () => {
              const page = Math.min((prestamosData.totalPages || 1), (prestamosData.page || 1) + 1)
              const pre = await fetchPrestamos({ q: qPrestamos, estado: estadoPrestamos, page, limit: prestamosData.limit })
              setPrestamosData(pre)
            }}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </Card>
  )
}
export default ZonaPrestamosTab
