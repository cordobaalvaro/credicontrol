import { Card, Button, Form } from "react-bootstrap";
import { 
  IconEye, 
  IconUser, 
  IconHash, 
  IconCash, 
  IconAlertCircle,
  IconCalendarEvent,
  IconMapPin,
  IconId
} from '@tabler/icons-react';
const PrestamoCard = ({ prestamo, onVerDetalle, getEstadoBadge }) => {
  const getStatusClass = (estado) => {
    switch (estado) {
      case 'activo': return 'prestamo-badge-activo';
      case 'vencido': return 'prestamo-badge-vencido';
      case 'cancelado': return 'prestamo-badge-cancelado';
      default: return 'bg-secondary text-white';
    }
  };
  const nombreCliente = prestamo.cliente?.nombre || "Sin cliente asignado";
  const nombrePrestamo = prestamo.nombre || `Préstamo #${prestamo._id?.slice(-6)}`;
  return (
    <Card
      className="prestamo-card-modern"
      onClick={() => onVerDetalle(prestamo._id)}
    >
      <Card.Header className="prestamo-card-header">
        <div className="d-flex justify-content-between align-items-center">
          <Form.Check
            type="checkbox"
            className="prestamo-checkbox me-2"
            disabled
            onClick={(e) => e.stopPropagation()}
          />
          <h6 className="prestamo-card-title flex-grow-1" title={nombrePrestamo}>
            {nombrePrestamo}
          </h6>
          <span className={`prestamo-status-badge ${getStatusClass(prestamo.estado)}`}>
            {prestamo.estado?.toUpperCase() || "DESCONOCIDO"}
          </span>
        </div>
      </Card.Header>
      <Card.Body className="prestamo-card-body">
        <div className="prestamo-info-grid">
          <div className="prestamo-info-item">
            <span className="prestamo-info-label">N° Préstamo</span>
            <span className="prestamo-info-value">
              <IconHash size={16} />
              {prestamo.numero || "N/A"}
            </span>
          </div>
          <div className="prestamo-info-item">
            <span className="prestamo-info-label">DNI Cliente</span>
            <span className="prestamo-info-value">
              <IconId size={16} />
              {prestamo.cliente?.dni || "N/A"}
            </span>
          </div>
          <div className="prestamo-info-item">
            <span className="prestamo-info-label">Monto Total</span>
            <span className="prestamo-info-value monto-total">
              <IconCash size={16} />
              ${prestamo.montoTotal?.toLocaleString() || "0"}
            </span>
          </div>
          <div className="prestamo-info-item">
            <span className="prestamo-info-label">Saldo Pendiente</span>
            <span className="prestamo-info-value saldo-pendiente">
              <IconAlertCircle size={16} />
              ${prestamo.saldoPendiente?.toLocaleString() || "0"}
            </span>
          </div>
          <div className="prestamo-info-item">
            <span className="prestamo-info-label">Fecha Inicio</span>
            <span className="prestamo-info-value">
              <IconCalendarEvent size={16} />
              {prestamo.fechaInicio ? new Date(prestamo.fechaInicio).toLocaleDateString() : "N/A"}
            </span>
          </div>
          <div className="prestamo-info-item">
            <span className="prestamo-info-label">Vencimiento</span>
            <span className="prestamo-info-value">
              <IconCalendarEvent size={16} />
              {prestamo.fechaVencimiento ? new Date(prestamo.fechaVencimiento).toLocaleDateString() : "N/A"}
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
export default PrestamoCard;
