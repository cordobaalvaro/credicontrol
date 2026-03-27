import { Row, Col, Card } from "react-bootstrap";
import LoadingButton from "../../../componentes/ui/LoadingButton";
import PrestamoCard from "./PrestamoCard";
const ClientePrestamosSection = ({ cliente, userRole, onNuevoPrestamo, navigate }) => {
  return (
    <Row>
      <Col>
        <Card className="cliente-card">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="cliente-prestamos-title">
              <i className="bi bi-cash-stack me-2"></i>Préstamos del Cliente
            </h4>
            {userRole === "admin" && (
              <LoadingButton
                variant="success"
                onClick={onNuevoPrestamo}
                loading={false}
                className="d-flex align-items-center"
              >
                <i className="bi bi-plus-circle me-2"></i>
                Nuevo Préstamo
              </LoadingButton>
            )}
          </div>
          {cliente.prestamos?.length > 0 ? (
            <Row>
              {cliente.prestamos.map((prestamo) => (
                <Col md={6} lg={4} key={prestamo._id} className="mb-3">
                  <PrestamoCard
                    prestamo={prestamo}
                    onVer={() => navigate(`/prestamo/${prestamo._id}`)}
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <div className="no-prestamos">
              <i className="bi bi-inbox"></i>
              <h5>No hay préstamos</h5>
              <p>Este cliente no tiene préstamos asociados.</p>
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
};
export default ClientePrestamosSection;
