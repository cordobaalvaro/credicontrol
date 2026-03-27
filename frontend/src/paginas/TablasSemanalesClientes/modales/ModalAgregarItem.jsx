"use client"
import { Modal, Button, Form, InputGroup } from "react-bootstrap"
import { IconX, IconSearch, IconUser, IconCalendar } from "@tabler/icons-react"
import "../../../componentes/modales/ModalDetallesTabla.css"
import useModalAgregarItem from "../../../hooks/useModalAgregarItem"
const ModalAgregarItem = ({ show, onHide, tabla, onItemAgregado }) => {
  const {
    loading,
    busqueda,
    setBusqueda,
    cobradorFilter,
    setCobradorFilter,
    estadoFilter,
    setEstadoFilter,
    prestamoSeleccionado,
    cobradores,
    prestamosFiltrados,
    handleSeleccionarPrestamo,
    handleAgregarItem,
    handleLimpiarFiltros,
    formatearFecha,
    formatearMonto
  } = useModalAgregarItem({ show, onHide, tabla, onItemAgregado })
  return (
    <Modal show={show} onHide={onHide} centered size="xl" className="modal-detalles-tabla">
      <Modal.Header closeButton className="modal-detalles-header">
        <Modal.Title>Agregar Préstamo a la Tabla</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-detalles-body">
        {}
        <div className="mb-4">
          <h5 className="mb-3">Filtros de Búsqueda</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <Form.Label>Cobrador</Form.Label>
              <Form.Select
                value={cobradorFilter}
                onChange={(e) => setCobradorFilter(e.target.value)}
              >
                <option value="">Todos</option>
                {cobradores.map((cobrador) => (
                  <option key={cobrador._id} value={cobrador._id}>
                    {cobrador.nombre} {cobrador.apellido}
                  </option>
                ))}
              </Form.Select>
            </div>
            <div className="col-md-4">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="activo">Activo</option>
                <option value="vencido">Vencido</option>
              </Form.Select>
            </div>
            <div className="col-md-4">
              <Form.Label>Buscar</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Buscar por cliente, préstamo..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                <InputGroup.Text>
                  <IconSearch size={16} />
                </InputGroup.Text>
              </InputGroup>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-12">
              <div className="d-flex gap-2">
                <Button variant="secondary" onClick={handleLimpiarFiltros}>
                  <IconX size={16} className="me-1" />
                  Limpiar filtros
                </Button>
              </div>
            </div>
          </div>
        </div>
        {}
        <div className="row">
          <div className="col-12">
            <h5 className="mb-3">
              Préstamos Disponibles ({prestamosFiltrados.length})
            </h5>
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : prestamosFiltrados.length === 0 ? (
              <div className="alert alert-info">
                No se encontraron préstamos con los filtros aplicados
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>N° Préstamo</th>
                      <th>Nombre Préstamo</th>
                      <th>Estado</th>
                      <th>Monto Total</th>
                      <th>Saldo Pendiente</th>
                      <th>Fecha Vencimiento</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prestamosFiltrados.map((prestamo) => (
                      <tr key={prestamo._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <IconUser size={16} className="me-2" />
                            <div>
                              <div>{prestamo.cliente?.nombre || "N/A"}</div>
                              <small className="text-muted">
                                N° {prestamo.cliente?.numero || "N/A"}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>{prestamo.numero}</td>
                        <td>{prestamo.nombre}</td>
                        <td>
                          <span className={`badge ${prestamo.estado === "activo" ? "bg-success" : "bg-warning"
                            }`}>
                            {prestamo.estado}
                          </span>
                        </td>
                        <td>{formatearMonto(prestamo.montoTotal)}</td>
                        <td>{formatearMonto(prestamo.saldoPendiente || 0)}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <IconCalendar size={16} className="me-2" />
                            {formatearFecha(prestamo.fechaVencimiento)}
                          </div>
                        </td>
                        <td>
                          <Button
                            variant={prestamoSeleccionado?._id === prestamo._id ? "danger" : "outline-primary"}
                            size="sm"
                            onClick={() => handleSeleccionarPrestamo(prestamo)}
                          >
                            {prestamoSeleccionado?._id === prestamo._id ? "Deseleccionar" : "Seleccionar"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        {}
        {prestamoSeleccionado && (
          <div className="mt-4 p-3 bg-light rounded">
            <h6>Préstamo Seleccionado:</h6>
            <div className="row">
              <div className="col-md-6">
                <strong>Cliente:</strong> {prestamoSeleccionado.cliente?.nombre}<br />
                <strong>Préstamo:</strong> {prestamoSeleccionado.numero} - {prestamoSeleccionado.nombre}<br />
                <strong>Estado:</strong> {prestamoSeleccionado.estado}
              </div>
              <div className="col-md-6">
                <strong>Monto Total:</strong> {formatearMonto(prestamoSeleccionado.montoTotal)}<br />
                <strong>Saldo Pendiente:</strong> {formatearMonto(prestamoSeleccionado.saldoPendiente || 0)}<br />
                <strong>Vencimiento:</strong> {formatearFecha(prestamoSeleccionado.fechaVencimiento)}
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="modal-detalles-footer">
        <Button variant="secondary" onClick={onHide}>
          <IconX size={16} className="me-1" />
          Cancelar
        </Button>
        <Button
          variant="success"
          onClick={handleAgregarItem}
          disabled={!prestamoSeleccionado || loading}
        >
          Agregar a Tabla
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
export default ModalAgregarItem
