import { IconCalendarWeek, IconUser, IconList, IconCash, IconCashBanknote, IconAlertTriangle } from "@tabler/icons-react"

import { formatARS } from "../../../helpers/currency"
const TablaSemanalInfoSection = ({ tabla }) => {
  if (!tabla) return null
  const formatDate = (fecha) => {
      if (!fecha) return "-";
      const d = new Date(fecha);
      return !isNaN(d.getTime()) ? d.toLocaleDateString("es-AR") : "-";
  }
  const formatMonto = (valor) => formatARS(valor)
  const totalItems = Array.isArray(tabla.items) ? tabla.items.length : 0
  const cobradorNombre = tabla.cobrador?.nombre || tabla.cobrador?.email || "Sin datos"
  const statCards = [
    {
      icon: IconCalendarWeek,
      label: "Semana",
      value: `${formatDate(tabla.fechaInicio)} - ${formatDate(tabla.fechaFin)}`,
      variant: "success",
    },
    {
      icon: IconUser,
      label: "Cobrador",
      value: cobradorNombre,
      variant: "primary",
    },
    {
      icon: IconList,
      label: "Items",
      value: totalItems.toString(),
      suffix: " items",
      variant: "indigo",
    },
    {
      icon: IconCash,
      label: "Esp. Activos",
      value: formatMonto(tabla.montoTotalEsperadoActivos || 0),
      variant: "success",
      hideOnMobile: true,
    },
    {
      icon: IconAlertTriangle,
      label: "Esp. Vencidos",
      value: formatMonto(tabla.montoTotalEsperadoVencidos || 0),
      variant: "danger",
      hideOnMobile: true,
    },
    {
      icon: IconCashBanknote,
      label: "Monto Cobrado",
      value: formatMonto(tabla.montoTotalCobrado),
      variant: "success",
      isHighlight: true,
    },
  ]
  if (tabla.montoTotalDeudaArrastrada > 0) {
    statCards.splice(3, 0, {
      icon: IconAlertTriangle,
      label: "Deuda Ant.",
      value: formatMonto(tabla.montoTotalDeudaArrastrada),
      variant: "danger",
      hideOnMobile: false,
    })
  }
  return (
    <div className="info-section-modern">
      <div className="info-stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className={`info-stat-card${card.hideOnMobile ? " hide-on-mobile" : ""} info-stat-card--${card.variant}`}>
            <div className="info-stat-icon">
              <card.icon size={28} stroke={1.8} />
            </div>
            <div className="info-stat-content">
              <span className="info-stat-label">{card.label}</span>
              <span className={`info-stat-value ${card.isHighlight ? "highlight" : ""}`}>
                {card.value}
                {card.suffix && <span className="info-stat-suffix">{card.suffix}</span>}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default TablaSemanalInfoSection
