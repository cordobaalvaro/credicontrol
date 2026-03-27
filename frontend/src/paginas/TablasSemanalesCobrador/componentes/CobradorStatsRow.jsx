import { IconCalendarWeek } from "@tabler/icons-react";
import StatsRow from "../../../componentes/ui/StatsRow";
const CobradorStatsRow = ({ stats, estadoFiltro, onStatClick }) => {
  const items = [
    {
      icon: IconCalendarWeek,
      iconColor: "total",
      value: stats.total,
      label: "Total Tablas",
      onClick: () => onStatClick(""),
      isActive: !estadoFiltro,
    },
    {
      icon: IconCalendarWeek,
      iconColor: "secondary",
      value: stats.enviada,
      label: "Enviadas",
      onClick: () => onStatClick("enviada"),
      isActive: estadoFiltro === "enviada",
    },
    {
      icon: IconCalendarWeek,
      iconColor: "success",
      value: stats.cerrada,
      label: "Cerradas",
      onClick: () => onStatClick("cerrada"),
      isActive: estadoFiltro === "cerrada",
    },
  ];
  return (
    <StatsRow
      className="stats-row mb-4 stats-row-3"
      items={items}
    />
  );
};
export default CobradorStatsRow;
