import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const ClienteItem = ({ cliente }) => {
  const navigate = useNavigate();
  return (
    <div className="cliente-item">
      <div className="cliente-header">
        <h5 className="cliente-nombre">{cliente.nombre}</h5>
      </div>
      <div className="cliente-details">
        <div className="detail-item">
          <i className="bi bi-card-text"></i>
          <span>DNI: {cliente.dni}</span>
        </div>
        <div className="detail-item">
          <i className="bi bi-telephone"></i>
          <span>Tel: {cliente.telefono || "No especificado"}</span>
        </div>
        <div className="detail-item">
          <i className="bi bi-geo-alt"></i>
          <span>Barrio: {cliente.barrio || "No especificado"}</span>
        </div>
        <div className="detail-item">
          <i className="bi bi-cash-stack"></i>
          <span>Préstamos: {cliente.prestamosActivos || 0}</span>
        </div>
      </div>
      <div className="cliente-actions">
        <Button
          className="btn-action btn-ver"
          onClick={() => navigate(`/cliente/${cliente._id}`)}
        >
          <i className="bi bi-eye me-1"></i>
          Ver Perfil
        </Button>
        {cliente.telefono && (
          <Button
            className="btn-action btn-llamar"
            onClick={() => window.open(`tel:${cliente.telefono}`, "_self")}
          >
            <i className="bi bi-telephone me-1"></i>
            Llamar
          </Button>
        )}
      </div>
    </div>
  );
};
export default ClienteItem;
