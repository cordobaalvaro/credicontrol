import UnifiedListItem from '../../../componentes/ui/UnifiedListItem/UnifiedListItem'
import { IconToggleLeft, IconToggleRight, IconMapPin, IconSearch, IconTrash } from '@tabler/icons-react'
const ClientesListView = ({
  clientesFiltrados,
  seleccionados,
  handleSeleccion,
  navigate,
  cambiarEstadoCliente,
  eliminarCliente
}) => {
  if (clientesFiltrados.length === 0) {
    return (
      <div className="no-results-premium">
        <div className="no-results-icon-container">
          <IconSearch size={40} />
        </div>
        <h5 className="no-results-title">No se encontraron clientes</h5>
        <p className="no-results-text">Intenta ajustar los filtros de búsqueda o el texto ingresado</p>
      </div>
    )
  }
  return (
    <div className="unified-clientes-list mt-3">
      <div className="unified-list-items">
        {clientesFiltrados.map((cliente) => {
          const acciones = [
          ]
          if (cliente.zona) {
            acciones.push({
              icon: IconMapPin,
              title: "Ver zona",
              onClick: () => navigate(`/zona/${cliente.zona._id}`),
              color: "var(--azul-info)"
            })
          }
          const dropdownAcciones = [
            {
              icon: cliente.estado === "inactivo" ? IconToggleRight : IconToggleLeft,
              label: cliente.estado === "inactivo" ? "Activar" : "Inactivar",
              onClick: () => cambiarEstadoCliente(cliente, cliente.estado === "inactivo" ? "activo" : "inactivo")
            },
            {
              icon: IconTrash,
              label: "Eliminar",
              onClick: () => eliminarCliente(cliente._id),
              variant: "danger"
            }
          ]
          return (
            <UnifiedListItem
              key={cliente._id}
              tipo="cliente"
              data={cliente}
              isSelected={seleccionados.includes(cliente._id)}
              onToggleSelected={() => handleSeleccion(cliente._id)}
              onClick={() => navigate(`/cliente/${cliente._id}`)}
              acciones={acciones}
              dropdownAcciones={dropdownAcciones}
            />
          )
        })}
      </div>
    </div>
  )
}
export default ClientesListView
