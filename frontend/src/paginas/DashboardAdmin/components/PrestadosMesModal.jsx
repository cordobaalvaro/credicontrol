import { Modal, Spinner, Table } from "react-bootstrap";
import { IconCash, IconCalendarEvent } from "@tabler/icons-react";
import { formatARS } from "../../../helpers/currency";

import "../DashboardAdmin.css"

const formatDate = (fecha) => {
  if (!fecha) return "-";
  const d = new Date(fecha);
  return !isNaN(d.getTime()) ? d.toLocaleDateString("es-AR") : "-";
}

const PrestadosMesModal = ({ show, onHide, loading, prestadosMesData }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="dashboard-zonas-modal">
      <Modal.Header closeButton className="dashboard-zonas-modal__header">
        <div className="dashboard-zonas-modal__header-left">
          <div className="dashboard-zonas-modal__icon" style={{ backgroundColor: 'rgba(33, 37, 41, 0.1)', color: '#212529' }}>
            <IconCash size={22} />
          </div>
          <div>
            <h5 className="dashboard-zonas-modal__title">Préstamos Entregados Mes</h5>
            <p className="dashboard-zonas-modal__subtitle">Detalle de capital entregado en el periodo</p>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="p-0">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="dark" size="sm" className="me-2" />
            <span className="text-muted">Cargando préstamos del mes...</span>
          </div>
        ) : (
          <div className="table-responsive dashboard-zonas-modal__body-scroll">
            <Table hover align="middle" className="mb-0">
              <thead className="bg-light text-muted small text-uppercase">
                <tr>
                  <th className="ps-4 border-0">Cliente</th>
                  <th className="border-0">Zona</th>
                  <th className="border-0">Capital</th>
                  <th className="border-0">Total</th>
                  <th className="pe-4 border-0">Iniciado</th>
                </tr>
              </thead>
              <tbody className="border-top-0">
                {prestadosMesData && prestadosMesData.length > 0 ? (
                  prestadosMesData.map((prestamo) => (
                    <tr key={prestamo._id}>
                      <td className="ps-4">
                        <div className="d-flex flex-column">
                          <span className="fw-bold text-dark">{prestamo.cliente?.nombre || "N/A"}</span>
                          <small className="text-muted">Préstamo N°{prestamo.numero}</small>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {prestamo.zona?.nombre || "N/A"}
                        </span>
                      </td>
                      <td>
                        <span className="fw-bold text-dark">
                          {formatARS(prestamo.montoInicial)}
                        </span>
                      </td>
                      <td>
                        <span className="text-muted small">
                          {formatARS(prestamo.montoTotal)}
                        </span>
                      </td>
                      <td className="pe-4 text-muted small">
                        <div className="d-flex align-items-center gap-1">
                          <IconCalendarEvent size={14} />
                          {formatDate(prestamo.fechaInicio)}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      No hay préstamos entregados en este periodo.
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

export default PrestadosMesModal
