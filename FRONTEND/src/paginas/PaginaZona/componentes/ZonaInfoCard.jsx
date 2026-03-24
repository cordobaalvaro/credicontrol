import { Card } from "react-bootstrap"
import { IconMapPin, IconUsers, IconCash, IconMap2 } from "@tabler/icons-react"
import StatsRow from "../../../componentes/ui/StatsRow"
const ZonaInfoCard = ({ zona }) => {
  const prestamosActivos = zona.clientes.reduce(
    (t, c) => t + (c.prestamos?.filter((p) => p.estado === "activo").length || 0),
    0,
  )
  return (
    <div className="zona-info-section">
      <StatsRow
        className="stats-row zona-stats-row mb-4"
        items={[
          {
            icon: IconMapPin,
            iconColor: "total",
            value: zona.localidades.length,
            label: "Localidades",
          },
          {
            icon: IconUsers,
            iconColor: "success",
            value: zona.clientes.length,
            label: "Clientes",
          },
          {
            icon: IconCash,
            iconColor: "warning",
            value: prestamosActivos,
            label: "Préstamos Activos",
          },
        ]}
      />
      <Card className="zona-localidades-card">
        <div className="zona-localidades-content">
          <h5 className="zona-localidades-title">
            <IconMap2 size={22} className="zona-localidades-icon" />
            Localidades Cubiertas
          </h5>
          <p className="zona-localidades-text">
            {zona.localidades.length > 0 ? zona.localidades.join(", ") : "No hay localidades definidas."}
          </p>
        </div>
      </Card>
    </div>
  )
}
export default ZonaInfoCard
