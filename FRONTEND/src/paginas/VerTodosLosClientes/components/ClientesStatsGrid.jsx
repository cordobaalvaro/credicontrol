import { IconUsers, IconUserCheck, IconUserOff } from "@tabler/icons-react"
import StatsRow from "../../../componentes/ui/StatsRow"
const ClientesStatsGrid = ({ stats, filtroEstado, onFiltroEstadoChange }) => {
  return (
    <StatsRow
      className="stats-row mb-4 stats-row-3"
      items={[
        {
          icon: IconUsers,
          iconColor: "total",
          value: stats.total,
          label: "Total Clientes",
          onClick: () => onFiltroEstadoChange({ target: { value: "todos" } }),
          isActive: filtroEstado === "todos",
        },
        {
          icon: IconUserCheck,
          iconColor: "success",
          value: stats.activos,
          label: "Activos",
          onClick: () => onFiltroEstadoChange({ target: { value: "activo" } }),
          isActive: filtroEstado === "activo",
        },
        {
          icon: IconUserOff,
          iconColor: "warning",
          value: stats.inactivos,
          label: "Inactivos",
          onClick: () => onFiltroEstadoChange({ target: { value: "inactivo" } }),
          isActive: filtroEstado === "inactivo",
        },
      ]}
    />
  )
}
export default ClientesStatsGrid
