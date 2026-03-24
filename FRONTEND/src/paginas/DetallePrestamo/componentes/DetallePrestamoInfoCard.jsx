import { Card, Badge, Row, Col } from "react-bootstrap";
import LoadingButton from "../../../componentes/ui/LoadingButton";
import "./DetallePrestamoInfoCard.css";
const DetallePrestamoInfoCard = ({ prestamo, onDescargarPDF }) => {
  const isVencido = prestamo.estado === "vencido";
  const infoItems = [
    { label: "Monto Inicial", value: `$${prestamo.montoIncial?.toLocaleString() || prestamo.montoInicial?.toLocaleString()}`, icon: "bi-cash" },
    { label: "Monto Total", value: `$${prestamo.montoTotal?.toLocaleString()}`, icon: "bi-cash-stack", highlight: true },
    { label: "Monto de Cuota", value: `$${(prestamo.montoCuota || prestamo.montoCuotaPersonalizada || (prestamo.planDeCuotas && prestamo.planDeCuotas.length > 0 ? prestamo.planDeCuotas[0].monto : 0)).toLocaleString()}`, icon: "bi-calendar-event" },
    { label: "Saldo Pendiente", value: `$${prestamo.saldoPendiente?.toLocaleString()}`, icon: "bi-wallet2", danger: prestamo.saldoPendiente > 0 },
    { 
      label: "Estado", 
      value: prestamo.estado?.toUpperCase(), 
      icon: "bi-info-circle", 
      isBadge: true, 
      badgeVariant: prestamo.estado === "activo" ? "success" : isVencido ? "warning" : "secondary" 
    },
    { label: "Fecha Inicio", value: new Date(prestamo.fechaInicio).toLocaleDateString(), icon: "bi-calendar-event" },
    { label: "Vencimiento", value: new Date(prestamo.fechaVencimiento).toLocaleDateString(), icon: "bi-calendar-check" },
    { label: "Cuotas", value: prestamo.cantidadCuotas, icon: "bi-list-ol" },
    { label: "Frecuencia", value: prestamo.frecuencia?.toUpperCase(), icon: "bi-clock-history", isBadge: true, badgeVariant: "info" },
    { 
      label: "Tipo", 
      value: (prestamo.tipo || "nuevo").toUpperCase(), 
      icon: "bi-tag", 
      isBadge: true, 
      badgeVariant: prestamo.tipo === "refinanciado" ? "secondary" : "primary" 
    },
    { label: "Interés (%)", value: `${prestamo.interes}%`, icon: "bi-graph-up-arrow" },
  ];
  if (isVencido) {
    infoItems.splice(3, 0, { label: "Interés Semanal", value: `$${prestamo.interesSemanal?.toLocaleString()}`, icon: "bi-percent", danger: true });
  }
  const clientItems = [
    { label: "Cliente", value: prestamo.cliente?.nombre, icon: "bi-person", isBadge: true, badgeVariant: "success" },
    { label: "DNI", value: prestamo.cliente?.dni, icon: "bi-card-text" },
    { label: "Teléfono", value: prestamo.cliente?.telefono, icon: "bi-telephone" },
  ];
  const renderInfoItem = (item, idx) => (
    <div key={idx} className={`info-display-item ${item.highlight ? 'highlight' : ''} ${item.danger ? 'danger' : ''}`}>
      <div className="info-display-icon">
        <i className={`bi ${item.icon}`}></i>
      </div>
      <div className="info-display-content">
        <span className="info-display-label">{item.label}</span>
        {item.isBadge ? (
          <Badge bg={item.badgeVariant} className="info-display-badge">{item.value}</Badge>
        ) : (
          <span className="info-display-value">{item.value}</span>
        )}
      </div>
    </div>
  );
  return (
    <Card className="detalle-info-card-modern border-0 shadow-sm mb-4">
      <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center py-3 px-4">
        <h5 className="mb-0 fw-bold text-dark">
          <i className="bi bi-info-circle-fill me-2 text-success"></i>
          Información del Préstamo
        </h5>
        <LoadingButton
          variant="outline-success"
          size="sm"
          className="btn-download-pdf-modern"
          onClick={onDescargarPDF}
          loading={false}
        >
          <i className="bi bi-file-earmark-pdf me-2"></i>
          Descargar PDF
        </LoadingButton>
      </Card.Header>
      <Card.Body className="px-4 pb-4">
        <Row className="g-4">
          <Col lg={7}>
            <div className="info-display-grid">
              {infoItems.map(renderInfoItem)}
            </div>
          </Col>
          <Col lg={5}>
            <div className="info-display-section-alt">
              <h6 className="section-alt-title">Datos del Cliente</h6>
              <div className="info-display-grid-compact">
                {clientItems.map(renderInfoItem)}
              </div>
            </div>
          </Col>
        </Row>
        {isVencido && prestamo.saldoPendienteVencimiento > 0 && (
          <div className="mora-alert-modern mt-4">
            <div className="mora-alert-icon">
              <i className="bi bi-exclamation-triangle-fill"></i>
            </div>
            <div className="mora-alert-content">
              <h6>Saldo con Intereses por Mora</h6>
              <p>El saldo acumulado incluyendo intereses por vencimiento es de <strong>${prestamo.saldoPendienteVencimiento.toLocaleString()}</strong></p>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
export default DetallePrestamoInfoCard;
