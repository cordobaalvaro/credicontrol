import { IconSearch } from '@tabler/icons-react'
import PrestamoCard from './PrestamoCard'
const PrestamosCardsView = ({
  prestamosFiltrados,
  onVerDetalle,
  getEstadoBadge
}) => {
  return (
    <>
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
        <div className="prestamos-grid">
          {prestamosFiltrados.map((prestamo) => (
            <PrestamoCard
              key={prestamo._id}
              prestamo={prestamo}
              onVerDetalle={onVerDetalle}
              getEstadoBadge={getEstadoBadge}
            />
          ))}
        </div>
      )}
    </>
  )
}
export default PrestamosCardsView
