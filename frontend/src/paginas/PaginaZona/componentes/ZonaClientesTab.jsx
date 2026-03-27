"use client"
import { Form, Button, Card } from 'react-bootstrap'
import UnifiedListItem from '../../../componentes/ui/UnifiedListItem/UnifiedListItem'
import { IconEye, IconSearch } from '@tabler/icons-react'
const ZonaClientesTab = ({ 
  clientesData, 
  qClientes, 
  setQClientes, 
  fetchClientes, 
  setClientesData, 
  navigate,
  zonaId
}) => {
  return (
    <Card className="zona-tab-card shadow-sm border-0">
      <div className="zona-tab-filter-section d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div className="zona-tab-title-group">
          <h6>Clientes de la zona</h6>
          <small>Buscar por número o nombre</small>
        </div>
        <div className="zona-tab-search-container">
          <div className="zona-tab-search-wrapper">
            <IconSearch className="zona-tab-search-icon" size={20} />
            <Form.Control
              type="text"
              placeholder="Buscar por nombre o DNI..."
              className="zona-tab-search-input"
              value={qClientes}
              onChange={(e) => setQClientes(e.target.value)}
            />
          </div>
        </div>
      </div>
      <Card.Body className="zona-tab-list-container">
        <div className="unified-list-items">
          {clientesData.items.map((c) => {
            const acciones = [
              {
                icon: IconEye,
                title: "Ver cliente",
                onClick: () => navigate(`/cliente/${c._id}`),
                color: "var(--verde-principal)"
              }
            ]
            return (
              <UnifiedListItem
                key={c._id}
                tipo="cliente"
                data={c}
                showCheckbox={false}
                onClick={() => navigate(`/cliente/${c._id}`)}
                acciones={acciones}
              />
            )
          })}
          {clientesData.items.length === 0 && (
            <div className="no-results-premium">
              <div className="no-results-icon-container">
                <IconSearch size={32} />
              </div>
              <h5 className="no-results-title">No se encontraron clientes</h5>
              <p className="no-results-text">
                No hay clientes registrados en esta zona que coincidan con tu búsqueda.
              </p>
            </div>
          )}
        </div>
      </Card.Body>
      <div className="zona-tab-pagination d-flex justify-content-between align-items-center">
        <small className="text-muted fw-medium">Total: {clientesData.total || 0}</small>
        <div className="d-flex gap-2">
          <Button
            variant="light"
            size="sm"
            className="rounded-pill px-3"
            disabled={(clientesData.page || 1) <= 1}
            onClick={async () => {
              const page = Math.max(1, (clientesData.page || 1) - 1)
              const cli = await fetchClientes({ q: qClientes, page, limit: clientesData.limit })
              setClientesData(cli)
            }}
          >
            Anterior
          </Button>
          <Button
            variant="light"
            size="sm"
            className="rounded-pill px-3"
            disabled={(clientesData.page || 1) >= (clientesData.totalPages || 1)}
            onClick={async () => {
              const page = Math.min((clientesData.totalPages || 1), (clientesData.page || 1) + 1)
              const cli = await fetchClientes({ q: qClientes, page, limit: clientesData.limit })
              setClientesData(cli)
            }}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </Card>
  )
}
export default ZonaClientesTab
