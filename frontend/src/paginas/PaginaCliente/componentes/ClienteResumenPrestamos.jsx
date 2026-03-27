import { Col, Card } from "react-bootstrap";
const ClienteResumenPrestamos = ({ resumenCliente, cliente }) => {
  const estadisticas = resumenCliente?.estadisticas || {};
  const totalPrestamos = estadisticas.totalPrestamos || 0;
  const prestamosActivos = estadisticas.prestamosActivos || 0;
  const prestamosVencidos = estadisticas.prestamosVencidos || 0;
  const prestamosDesactivados = estadisticas.prestamosDesactivados || 0;
  const prestamosCancelados = estadisticas.prestamosCancelados || 0;
  const prestamosRefinanciados = estadisticas.prestamosRefinanciados || 0;
  const montoPrestadoTotal = estadisticas.montoPrestadoTotal || 0;
  const saldoPendienteTotal = estadisticas.totalSaldoPendiente || 0;
  const tipoCliente = resumenCliente?.cliente?.tipo || cliente?.tipo || "-";
  return (
    <Col lg={4}>
      <Card className="cliente-card cliente-resumen-card">
        <h5 className="text-center mb-3 cliente-resumen-title">
          <i className="bi bi-graph-up me-2"></i>Resumen
        </h5>
        <div className="cliente-resumen-grid">
          <div className="detail-item">
            <div className="detail-label">Préstamos Totales</div>
            <div className="detail-value">{totalPrestamos}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Préstamos Activos</div>
            <div className="detail-value">{prestamosActivos}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Préstamos Vencidos</div>
            <div className="detail-value">{prestamosVencidos}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Préstamos Desactivados</div>
            <div className="detail-value">{prestamosDesactivados}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Préstamos Cancelados</div>
            <div className="detail-value">{prestamosCancelados}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Préstamos Refinanciados</div>
            <div className="detail-value">{prestamosRefinanciados}</div>
          </div>
        </div>
      </Card>
      <Card className="cliente-card mt-4 cliente-totales-card">
        <h5 className="text-center mb-3 cliente-totales-title">
          <i className="bi bi-cash-coin me-2"></i>Totales
        </h5>
        <div className="cliente-totales-grid">
          <div className="detail-item">
            <div className="detail-label">Monto Prestado Total</div>
            <div className="detail-value">${montoPrestadoTotal.toLocaleString()}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Saldo Pendiente Total</div>
            <div className="detail-value">${saldoPendienteTotal.toLocaleString()}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Tipo de Cliente</div>
            <div className="detail-value">{tipoCliente}</div>
          </div>
        </div>
      </Card>
    </Col>
  );
};
export default ClienteResumenPrestamos;
