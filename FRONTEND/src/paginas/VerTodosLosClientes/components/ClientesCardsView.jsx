"use client"
import ClienteCard from './ClienteCard'
import { IconSearch } from '@tabler/icons-react'
const ClientesCardsView = ({
  clientesFiltrados,
  seleccionados,
  handleSeleccion,
  navigate,
  eliminarCliente,
  cambiarEstadoCliente
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
    <div className="clientes-grid">
      {clientesFiltrados.map((cliente) => (
        <ClienteCard
          key={cliente._id}
          cliente={cliente}
          isSelected={seleccionados.includes(cliente._id)}
          onToggleSelected={() => handleSeleccion(cliente._id)}
          onVer={() => navigate(`/cliente/${cliente._id}`)}
          onEliminar={() => eliminarCliente(cliente)}
          onCambiarEstado={() =>
            cambiarEstadoCliente(cliente, cliente.estado === "inactivo" ? "activo" : "inactivo")
          }
          onVerZona={cliente.zona ? () => navigate(`/zona/${cliente.zona._id}`) : undefined}
        />
      ))}
    </div>
  )
}
export default ClientesCardsView
