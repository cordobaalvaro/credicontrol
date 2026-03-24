"use client"
import { useNavigate } from "react-router-dom"
import { Row, Col, Button, Spinner, Alert, Container, InputGroup, Form, ButtonGroup } from "react-bootstrap"
import PageHeader from "../../componentes/layout/PageHeader"
import ListFilterBar from "../../componentes/ui/ListFilterBar"
import ListSectionHeader from "../../componentes/ui/ListSectionHeader"
import "./VerTodosLosPrestamos.css"
import PrestamosCardsView from "./components/PrestamosCardsView"
import PrestamosListView from "./components/PrestamosListView"
import PageLoading from "../../componentes/ui/PageLoading"
import useVerTodosLosPrestamos from "../../hooks/useVerTodosLosPrestamos"
import PrestamosStatsGrid from "./components/PrestamosStatsGrid"
const VerTodosLosPrestamos = () => {
  const navigate = useNavigate()
  const {
    prestamosFiltrados,
    loading,
    error,
    filtro,
    setFiltro,
    estadoFiltro,
    viewMode,
    setViewMode,
    stats,
    handleEstadoStatClick,
    getEstadoBadge
  } = useVerTodosLosPrestamos()
  const verDetallePrestamo = (prestamoId) => {
    navigate(`/prestamo/${prestamoId}`)
  }
  if (loading) {
    return (
      <div className="prestamos-fullwidth">
        <PageLoading message="Cargando préstamos..." />
      </div>
    )
  }
  if (error) {
    return (
      <div className="prestamos-fullwidth">
        <Alert variant="danger">{error}</Alert>
      </div>
    )
  }
  return (
    <div className="prestamos-fullwidth">
      <PageHeader
        iconClass="bi bi-bank"
        title="Gestión de Préstamos"
        subtitle="Panel profesional para la administración de préstamos"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />
      <Container className="py-4">
        <PrestamosStatsGrid
          stats={stats}
          estadoFiltro={estadoFiltro}
          onEstadoStatClick={handleEstadoStatClick}
        />
        <div className="prestamos-section">
          <ListFilterBar
            busqueda={filtro}
            onBusquedaChange={(e) => setFiltro(e.target.value)}
            showZonaFilters={false}
            placeholder="Buscar por número de préstamo o nombre del cliente..."
            stats={stats}
          />
          <ListSectionHeader
            total={prestamosFiltrados.length}
            label="Lista de Préstamos"
            showViewToggle={true}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          {viewMode === "cards" ? (
            <PrestamosCardsView
              prestamosFiltrados={prestamosFiltrados}
              onVerDetalle={verDetallePrestamo}
              getEstadoBadge={getEstadoBadge}
            />
          ) : (
            <PrestamosListView
              prestamosFiltrados={prestamosFiltrados}
              onVerDetalle={verDetallePrestamo}
              getEstadoBadge={getEstadoBadge}
            />
          )}
        </div>
      </Container>
    </div>
  )
}
export default VerTodosLosPrestamos
