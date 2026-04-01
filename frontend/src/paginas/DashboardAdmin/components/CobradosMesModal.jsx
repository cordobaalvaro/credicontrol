import { Modal, Spinner, Table } from "react-bootstrap";
import { IconTrendingUp, IconCalendarEvent } from "@tabler/icons-react";
import { formatARS } from "../../../helpers/currency";

import "../DashboardAdmin.css"
const formatDate = (fecha) => {
  if (!fecha) return "-";
  const d = new Date(fecha);
  return !isNaN(d.getTime()) ? d.toLocaleDateString("es-AR") : "-";
}
const CobradosMesModal = ({ show, onHide, loading, cobradosMesData }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="dashboard-zonas-modal">
      <Modal.Header closeButton className="dashboard-zonas-modal__header">
        <div className="dashboard-zonas-modal__header-left">
          <div className="dashboard-zonas-modal__icon">
            <IconTrendingUp size={22} />
          </div>
          <div>
            <h5 className="dashboard-zonas-modal__title">Préstamos Cobrados Mes</h5>
            <p className="dashboard-zonas-modal__subtitle">Detalle de ingresos por cobros del periodo</p>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="p-0">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" size="sm" className="me-2" />
            <span className="text-muted">Cargando cobros del mes...</span>
          </div>
        ) : (
          <div className="table-responsive dashboard-zonas-modal__body-scroll">
            <Table hover align="middle" className="mb-0">
              <thead className="bg-light text-muted small text-uppercase">
                <tr>
                  <th className="ps-4 border-0">Cliente</th>
                  <th className="border-0"># Cuota</th>
                  <th className="border-0">Monto</th>
                  <th className="pe-4 border-0">Fecha</th>
                </tr>
              </thead>
              <tbody className="border-top-0">
                {cobradosMesData && cobradosMesData.length > 0 ? (
                  cobradosMesData.map((cobro) => (
                    <tr key={`${cobro._id}-${cobro.fechaCobro}`}>
                      <td className="ps-4">
                        <span className="fw-bold text-dark">{cobro.cliente?.nombre || "N/A"}</span>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          Cuota {cobro.numero}
                        </span>
                      </td>
                      <td>
                        <span className="fw-bold text-success">
                          {formatARS(cobro.montoCobro)}
                        </span>
                      </td>
                      <td className="pe-4 text-muted small">
                        <div className="d-flex align-items-center gap-1">
                          <IconCalendarEvent size={14} />
                          {formatDate(cobro.fechaCobro)}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-5 text-muted">
                      No hay cobros registrados en este periodo.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}
      </Modal.Body>
    </Modal>
  )
}
export default CobradosMesModal
