"use client"
import React from "react"
import { Modal, Spinner, Button, Badge, Form } from "react-bootstrap"
import { IconChartBar } from "@tabler/icons-react"
import { Pencil, Trash, Plus, Search, People, Cash, ListCheck } from "react-bootstrap-icons"
import { formatARS as formatCurrency } from "../../../helpers/currency"
const GestionZonasModal = ({
  show,
  onHide,
  loadingZonas,
  zonasData,
  onNuevaZona,
  onEditarZona,
  onEliminarZona,
  onZonaClick,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("")
  const filteredZonas = (zonasData || []).filter(
    (zona) =>
      zona.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zona.localidades?.some((l) => l.toLowerCase().includes(searchTerm.toLowerCase()))
  )
  const stats = React.useMemo(() => {
    if (!zonasData || zonasData.length === 0)
      return { totalZonas: 0, totalClientes: 0, totalACobrar: 0 }
    return {
      totalZonas: zonasData.length,
      totalClientes: zonasData.reduce((acc, z) => acc + (z.cantidadClientes || 0), 0),
      totalACobrar: zonasData.reduce((acc, z) => acc + (z.totalACobrar || 0), 0),
    }
  }, [zonasData])
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      scrollable
      className="dashboard-zonas-modal"
    >
      <Modal.Header className="dashboard-zonas-modal__header" closeButton>
        <div className="dashboard-zonas-modal__header-left">
          <div className="dashboard-zonas-modal__icon">
            <IconChartBar size={22} />
          </div>
          <div>
            <h5 className="dashboard-zonas-modal__title">Gestión de Zonas</h5>
            <p className="dashboard-zonas-modal__subtitle">Administra las áreas de cobro y sus cobradores</p>
          </div>
        </div>
        <div className="dashboard-zonas-modal__header-actions me-3">
          <Button
            className="dashboard-zonas-modal__create-btn"
            onClick={onNuevaZona}
          >
            <Plus size={20} /> Nueva Zona
          </Button>
        </div>
      </Modal.Header>
      <Modal.Body className="dashboard-zonas-modal__body p-0">
        {loadingZonas ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" />
            <p className="text-muted mt-2">Cargando información de zonas...</p>
          </div>
        ) : (
          <>
            {}
            <div className="bg-light border-bottom p-3">
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="d-flex align-items-center gap-3 bg-white p-3 rounded-3 shadow-sm border">
                    <div className="bg-primary bg-opacity-10 p-2 rounded-2 text-primary">
                      <ListCheck size={20} />
                    </div>
                    <div>
                      <div className="text-muted small fw-medium">Total Zonas</div>
                      <div className="fw-bold fs-5">{stats.totalZonas}</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center gap-3 bg-white p-3 rounded-3 shadow-sm border">
                    <div className="bg-info bg-opacity-10 p-2 rounded-2 text-info">
                      <People size={20} />
                    </div>
                    <div>
                      <div className="text-muted small fw-medium">Total Clientes</div>
                      <div className="fw-bold fs-5">{stats.totalClientes}</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center gap-3 bg-white p-3 rounded-3 shadow-sm border">
                    <div className="bg-success bg-opacity-10 p-2 rounded-2 text-success">
                      <Cash size={20} />
                    </div>
                    <div>
                      <div className="text-muted small fw-medium">Cartera a Cobrar</div>
                      <div className="fw-bold fs-5 text-success">{formatCurrency(stats.totalACobrar)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {}
            <div className="p-3 border-bottom bg-white sticky-top">
              <div className="position-relative">
                <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <Form.Control
                  type="text"
                  placeholder="Buscar por nombre de zona o localidad..."
                  className="ps-5 py-2 border-0 bg-light rounded-pill"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="bg-light text-muted small text-uppercase fw-bold">
                  <tr>
                    <th className="ps-4 border-0">Zona / Localidades</th>
                    <th className="border-0">Métricas</th>
                    <th className="border-0">Finanzas</th>
                    <th className="border-0">Cobrador</th>
                    <th className="pe-4 border-0 text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody className="border-top-0">
                  {filteredZonas.length > 0 ? (
                    filteredZonas.map((zona) => (
                      <tr key={zona._id} className="zona-row-premium">
                        <td
                          className="ps-4 clickable-cell"
                          onClick={() => onZonaClick?.(zona._id)}
                          role="button"
                          title={`Ir a ${zona.nombre}`}
                        >
                          <div className="fw-bold text-dark">{zona.nombre}</div>
                          <div className="zona-localidad-text text-truncate">
                            {zona.localidades?.join(", ") || "Sin localidades"}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column gap-1">
                            <span className="small d-flex align-items-center gap-2">
                              <People size={14} className="text-primary" />
                              <span className="fw-medium">{zona.cantidadClientes || 0}</span> Clientes
                            </span>
                            <span className="small d-flex align-items-center gap-2">
                              <ListCheck size={14} className="text-success" />
                              <span className="fw-medium">{zona.cantidadPrestamosActivos || 0}</span> Activos
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <span className="fw-bold text-success font-monospace">
                              {formatCurrency(zona.totalACobrar || 0)}
                            </span>
                            {zona.totalVencido > 0 && (
                              <span className="small text-danger fw-medium">
                                Vencido: {formatCurrency(zona.totalVencido)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            {Array.isArray(zona.cobrador) && zona.cobrador.length > 0 ? (
                              <div className="d-flex flex-wrap gap-1">
                                {zona.cobrador.map((cob, idx) => (
                                  <Badge key={idx} bg="light" className="text-dark border px-2 py-1 fw-medium d-flex align-items-center gap-1">
                                    <span className="dot dot-success"></span>
                                    {typeof cob === 'object' ? cob.nombre : cob}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <Badge bg="light" className="text-muted border px-2 py-1 fw-normal">
                                Sin asignar
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="pe-4 text-end">
                          <div className="d-flex justify-content-end gap-2">
                            <Button
                              variant="light"
                              size="sm"
                              className="btn-action-premium btn-edit"
                              onClick={() => onEditarZona(zona)}
                              title="Editar zona"
                            >
                              <Pencil size={14} />
                            </Button>
                            <Button
                              variant="light"
                              size="sm"
                              className="btn-action-premium btn-delete"
                              onClick={() => onEliminarZona(zona)}
                              title="Eliminar zona"
                            >
                              <Trash size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-5">
                        <div className="text-muted">
                          <Search size={40} className="mb-3 opacity-25" />
                          <p>No se encontraron zonas que coincidan con la búsqueda</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  )
}
export default GestionZonasModal
