import { IconCash, IconCircleCheck, IconCircleX, IconAlertTriangle, IconCircleMinus } from "@tabler/icons-react"
import StatsRow from "../../../componentes/ui/StatsRow"
const PrestamosStatsGrid = ({ stats, estadoFiltro, onEstadoStatClick }) => {
  return (
    <StatsRow
      className="prestamos-stats-row mb-4"
      items={[
        {
          icon: IconCash,
          iconColor: "total",
          value: stats.total,
          label: "Total Préstamos",
          onClick: () => onEstadoStatClick("todos"),
          isActive: estadoFiltro === "todos",
        },
        {
          icon: IconCircleCheck,
          iconColor: "success",
          value: stats.activos,
          label: "Activos",
          onClick: () => onEstadoStatClick("activo"),
          isActive: estadoFiltro === "activo",
        },
        {
          icon: IconCircleX,
          iconColor: "danger",
          value: stats.cancelados,
          label: "Cancelados",
          onClick: () => onEstadoStatClick("cancelado"),
          isActive: estadoFiltro === "cancelado",
        },
        {
          icon: IconAlertTriangle,
          iconColor: "warning",
          value: stats.vencidos,
          label: "Vencidos",
          onClick: () => onEstadoStatClick("vencido"),
          isActive: estadoFiltro === "vencido",
        },
        {
          icon: IconCircleMinus,
          iconColor: "secondary",
          value: stats.desactivados,
          label: "Desactivados",
          onClick: () => onEstadoStatClick("desactivado"),
          isActive: estadoFiltro === "desactivado",
        },
      ]}
    />
  )
}
export default PrestamosStatsGrid
