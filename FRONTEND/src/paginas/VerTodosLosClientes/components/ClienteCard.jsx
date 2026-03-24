import { Card, Badge, Button, Form } from "react-bootstrap";
import PropTypes from "prop-types";
const ClienteCard = ({
  cliente,
  isSelected,
  onToggleSelected,
  onVer,
  onEliminar,
  onVerZona,
  onCambiarEstado,
}) => {
  const isActivo = cliente.estado !== "inactivo";
  return (
    <Card
      className={`cliente-card-modern ${isSelected ? "selected" : ""}`}
      onClick={onVer}
    >
      <Card.Header className="cliente-card-header">
        <div className="d-flex justify-content-between align-items-center">
          <Form.Check
            type="checkbox"
            className="cliente-checkbox me-2"
            checked={isSelected}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              onToggleSelected();
            }}
          />
          <h6 className="cliente-card-title flex-grow-1" title={cliente.nombre}>
            {cliente.nombre}
          </h6>
          <span className={`cliente-status-badge ${isActivo ? 'cliente-badge-activo' : 'cliente-badge-inactivo'}`}>
            {isActivo ? "ACTIVO" : "INACTIVO"}
          </span>
        </div>
      </Card.Header>
      <Card.Body className="cliente-card-body">
        <div className="cliente-info-grid">
          <div className="cliente-info-item">
            <span className="cliente-info-label">NÂ° Cliente</span>
            <span className="cliente-info-value">
              <i className="bi bi-hash"></i>
              {cliente.numero || "N/A"}
            </span>
          </div>
          <div className="cliente-info-item">
            <span className="cliente-info-label">DNI</span>
            <span className="cliente-info-value">
              <i className="bi bi-card-text"></i>
              {cliente.dni || "N/A"}
            </span>
          </div>
          <div className="cliente-info-item">
            <span className="cliente-info-label">Teléfono</span>
            <span className="cliente-info-value">
              <i className="bi bi-telephone"></i>
              {cliente.telefono || "N/A"}
            </span>
          </div>
          <div className="cliente-info-item">
            <span className="cliente-info-label">Préstamos</span>
            <span className="cliente-info-value">
              <i className="bi bi-cash-stack"></i>
              {cliente.prestamos?.length || 0}
            </span>
          </div>
        </div>
        <div className="cliente-zona-section">
          <div 
            className={`cliente-zona-badge ${cliente.zona ? 'has-zona' : 'no-zona'}`}
            onClick={(e) => {
              if (cliente.zona && onVerZona) {
                e.stopPropagation();
                onVerZona();
              }
            }}
          >
            <i className={`bi ${cliente.zona ? 'bi-geo-alt-fill' : 'bi-exclamation-triangle'}`}></i>
            {cliente.zona ? cliente.zona.nombre : "Sin zona asignada"}
          </div>
        </div>
      </Card.Body>
      <Card.Footer className="cliente-card-footer">
        <Button
          variant="outline-secondary"
          className="btn-cliente-icon"
          onClick={(e) => {
            e.stopPropagation();
            onCambiarEstado();
          }}
          title={isActivo ? "Desactivar" : "Activar"}
        >
          <i className={`bi ${isActivo ? 'bi-toggle-on text-success' : 'bi-toggle-off text-muted'}`}></i>
        </Button>
        <Button
          variant="outline-danger"
          className="btn-cliente-icon"
          onClick={(e) => {
            e.stopPropagation();
            onEliminar();
          }}
          title="Eliminar"
        >
          <i className="bi bi-trash"></i>
        </Button>
      </Card.Footer>
    </Card>
  );
};
ClienteCard.propTypes = {
  cliente: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onToggleSelected: PropTypes.func.isRequired,
  onVer: PropTypes.func.isRequired,
  onEliminar: PropTypes.func.isRequired,
  onVerZona: PropTypes.func,
  onCambiarEstado: PropTypes.func.isRequired,
};
export default ClienteCard;
