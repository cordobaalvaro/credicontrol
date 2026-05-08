"use client"
import { Modal, Button, Table, Badge } from "react-bootstrap"
import { IconCash, IconCalendarTime, IconCheck } from "@tabler/icons-react"

const ModalDetalleRendicion = ({ show, onHide, rendicion }) => {
  if (!rendicion) return null

  const totalRendido = rendicion.items?.reduce((sum, it) => sum + (it.montoCobrado || 0), 0) || 0

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold d-flex align-items-center">
          <IconCalendarTime size={24} className="me-2 text-primary" />
          Detalle de Jornada - {new Date(rendicion.fechaRendicion).toLocaleDateString()}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-3">
        <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded-3">
          <div>
            <div className="small text-muted mb-1">Estado de la Rendición</div>
            <Badge bg={rendicion.estado === "cargada" ? "success" : "info"} className="rounded-pill px-3">
              {rendicion.estado === "cargada" ? "PROCESADA POR ADMIN" : "PENDIENTE DE PROCESAR"}
            </Badge>
          </div>
          <div className="text-end">
            <div className="small text-muted mb-1">Total Cobrado en esta Jornada</div>
            <div className="h4 mb-0 fw-bold text-success">${totalRendido.toLocaleString()}</div>
          </div>
        </div>

        {rendicion.observaciones && (
          <div className="mb-4 p-3 border-start border-4 border-info bg-info bg-opacity-10 rounded-end-3">
            <div className="small fw-bold text-info text-uppercase mb-1">Observaciones del Cobrador</div>
            <div className="text-dark" style={{ whiteSpace: 'pre-wrap' }}>{rendicion.observaciones}</div>
          </div>
        )}

        <h6 className="fw-bold mb-3 d-flex align-items-center">
          <IconCash size={18} className="me-2" />
          Cobros Incluidos ({rendicion.items?.length || 0})
        </h6>

        <div className="table-responsive">
          <Table hover className="align-middle">
            <thead className="bg-light">
              <tr>
                <th className="border-0 small text-muted">CLIENTE</th>
                <th className="border-0 small text-muted">PRÉSTAMO</th>
                <th className="border-0 small text-muted text-end">MONTO COBRADO</th>
              </tr>
            </thead>
            <tbody>
              {rendicion.items?.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="fw-semibold">{item.cliente?.nombre || "N/A"}</div>
                    {item.cliente?.dni && <div className="small text-muted">DNI: {item.cliente.dni}</div>}
                  </td>
                  <td>
                    <Badge bg="secondary" className="fw-normal">
                      #{item.prestamo?.numero || "N/A"}
                    </Badge>
                  </td>
                  <td className="text-end fw-bold text-success">
                    ${item.montoCobrado?.toLocaleString() || 0}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-light">
              <tr>
                <td colSpan="2" className="fw-bold text-end py-3">TOTAL JORNADA:</td>
                <td className="fw-bold text-end text-success h5 py-3">${totalRendido.toLocaleString()}</td>
              </tr>
            </tfoot>
          </Table>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="secondary" onClick={onHide} className="rounded-pill px-4">
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalDetalleRendicion
