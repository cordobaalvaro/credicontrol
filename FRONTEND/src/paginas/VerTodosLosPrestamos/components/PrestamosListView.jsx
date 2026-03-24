import UnifiedListItem from '../../../componentes/ui/UnifiedListItem/UnifiedListItem'
import { IconEye, IconSearch } from '@tabler/icons-react'
const PrestamosListView = ({
  prestamosFiltrados,
  onVerDetalle,
  getEstadoBadge
}) => {
  return (
    <div className="unified-prestamos-list">
      {prestamosFiltrados.length === 0 ? (
        <div className="no-results-premium">
          <div className="no-results-icon-container">
            <IconSearch size={32} />
          </div>
          <h5 className="no-results-title">No se encontraron préstamos</h5>
          <p className="no-results-text">
            No hay préstamos que coincidan con los filtros seleccionados. Intenta ajustar tu búsqueda.
          </p>
        </div>
      ) : (
        <div className="unified-list-items">
          {prestamosFiltrados.map((prestamo) => {
            const data = {
              ...prestamo,
              estadoBadge: getEstadoBadge(prestamo.estado)
            }
            const acciones = [
              {
                icon: IconEye,
                title: "Ver detalles",
                onClick: () => onVerDetalle(prestamo._id),
                color: "var(--verde-principal)"
              }
            ]
            return (
              <UnifiedListItem
                key={prestamo._id}
                tipo="prestamo"
                data={data}
                showCheckbox={false}
                onClick={() => onVerDetalle(prestamo._id)}
                acciones={acciones}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
export default PrestamosListView
