import { Row, Col } from 'react-bootstrap';
import { IconCalendarWeek } from "@tabler/icons-react";
import TablaSemanalCard from "../../TablasSemanalesClientes/componentes/TablaSemanalCard";
import "../TablasSemanalesCobrador.css";
const CobradorTablasList = ({ tablas, hasFilters, onTablaActualizada }) => {
  if (tablas.length === 0) {
    return (
      <div className="empty-state-card text-center py-5 mt-3">
        <IconCalendarWeek size={48} className="empty-state-icon" />
        <h5 className="text-secondary fw-semibold">
          {hasFilters
            ? "No se encontraron tablas con los filtros aplicados"
            : "No tenés tablas semanales asignadas"}
        </h5>
        <p className="empty-state-description mb-0">
          {hasFilters
            ? "Intenta ajustar los filtros para ver resultados."
            : "Cuando el administrador te envíe tablas, las vas a ver acá para cargar tus cobros."}
        </p>
      </div>
    );
  }
  return (
    <Row className="mt-3 g-4">
      {tablas.map((tabla) => (
        <Col key={tabla._id} md={6} lg={4}>
          <TablaSemanalCard
            tabla={tabla}
            onTablaActualizada={onTablaActualizada}
            modoCobrador={true}
          />
        </Col>
      ))}
    </Row>
  );
};
export default CobradorTablasList;
