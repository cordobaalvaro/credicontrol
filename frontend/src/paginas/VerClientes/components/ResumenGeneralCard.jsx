import { IconUsers } from "@tabler/icons-react";
import ZonasStatsPreview from "./ZonasStatsPreview";
const ResumenGeneralCard = ({ zonasCount, estadisticas }) => {
  return (
    <ZonasStatsPreview
      title="Resumen General"
      subtitle={`${zonasCount} zona(s) asignada(s)`}
      icon={IconUsers}
      stats={estadisticas}
      className="resumen-general-card"
    />
  );
};
export default ResumenGeneralCard;
