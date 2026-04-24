import {
  IconHash,
  IconId,
  IconPhone,
  IconCalendar,
  IconMapPin,
  IconBuildingStore,
  IconHome,
  IconBuilding,
  IconMap2,
  IconCash,
  IconMap,
  IconShoppingBag,
} from "@tabler/icons-react"
const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="cliente-info-card">
    <div className="cliente-info-card-icon">
      <Icon size={20} stroke={1.5} />
    </div>
    <div className="cliente-info-card-content">
      <span className="cliente-info-card-label">{label}</span>
      <span className="cliente-info-card-value">{value || "No especificado"}</span>
    </div>
  </div>
)
const ClienteInfoReadOnly = ({ cliente }) => {
  const infoItems = [
    { icon: IconHash, label: "N° Cliente", value: cliente.numero },
    { icon: IconId, label: "DNI", value: cliente.dni },
    { icon: IconPhone, label: "Teléfono", value: cliente.telefono },
    {
      icon: IconCalendar,
      label: "Fecha de Nacimiento",
      value: cliente.fechaNacimiento ? new Date(cliente.fechaNacimiento).toLocaleDateString() : null,
    },
    { icon: IconMapPin, label: "Localidad", value: cliente.localidad },
    { icon: IconBuildingStore, label: "Dirección Comercial", value: cliente.direccionComercial },
    { icon: IconHome, label: "Dirección", value: cliente.direccion },
    { icon: IconBuilding, label: "Barrio", value: cliente.barrio },
    { icon: IconMap2, label: "Ciudad", value: cliente.ciudad },
    {
      icon: IconCash,
      label: "Dirección de Cobro",
      value:
        cliente.direccionCobroValor ||
        (cliente.direccionCobro === "direccionComercial"
          ? cliente.direccionComercial
          : cliente.direccion),
    },
    { icon: IconMap, label: "Zona", value: cliente.zona?.nombre || "Sin zona asignada" },
    { icon: IconShoppingBag, label: "Tipo de Comercio", value: cliente.tipoDeComercio },
  ]

  return (
    <div className="cliente-info-grid">
      {infoItems.map((item, idx) => (
        <InfoCard key={idx} {...item} />
      ))}
    </div>
  )
}
export default ClienteInfoReadOnly
