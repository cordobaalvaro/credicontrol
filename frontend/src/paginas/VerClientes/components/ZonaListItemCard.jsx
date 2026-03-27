import { Button } from "react-bootstrap";
import { IconMapPin, IconEye } from "@tabler/icons-react";
import ZonasStatsPreview from "./ZonasStatsPreview";
const ZonaListItemCard = ({ zona, onVerClientes }) => {
  return (
    <ZonasStatsPreview
      title={zona.nombre}
      subtitle={zona.localidades?.join(", ") || "Sin localidades"}
      icon={IconMapPin}
      stats={zona.estadisticas}
      className="zona-card-item"
    >
      <div className="d-flex justify-content-center">
        <Button
          variant="success"
          className="btn-ver-clientes-modern"
          onClick={() => onVerClientes(zona)}
        >
          <IconEye size={16} className="me-2" />
          Ver {zona.estadisticas.totalClientes} Cliente{zona.estadisticas.totalClientes !== 1 ? "s" : ""}
        </Button>
      </div>
    </ZonasStatsPreview>
  );
};
export default ZonaListItemCard;
