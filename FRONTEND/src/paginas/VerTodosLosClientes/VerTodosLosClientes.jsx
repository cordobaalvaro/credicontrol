"use client"
import { useNavigate } from "react-router-dom"
import { Container, Alert } from "react-bootstrap"
import PageHeader from "../../componentes/layout/PageHeader"
import PageLoading from "../../componentes/ui/PageLoading"
import ClientesActionsBar from "./components/ClientesActionsBar"
import ClientesStatsGrid from "./components/ClientesStatsGrid"
import ClientesSeleccionBar from "./components/ClientesSeleccionBar"
import ClientesCardsView from "./components/ClientesCardsView"
import ClientesListView from "./components/ClientesListView"
import ModalAgregarCliente from "./modales/ModalAgregarCliente"
import ModalTiposClientes from "./modales/ModalTiposClientes"
import useClientesTotales from "../../hooks/useClientesTotales"
import useVerTodosLosClientes from "../../hooks/useVerTodosLosClientes"
import "./VerTodosLosClientes.css"
import ListFilterBar from "../../componentes/ui/ListFilterBar"
import ListSectionHeader from "../../componentes/ui/ListSectionHeader"
const VerTodosLosClientes = () => {
  const navigate = useNavigate()
  const {
    clientesFiltrados,
    loading,
    error,
    busqueda,
    filtroZona,
    filtroEstado,
    seleccionados,
    seleccionarTodos,
    handleBusquedaChange,
    handleFiltroZonaChange,
    handleFiltroEstadoChange,
    handleSeleccion,
    handleSeleccionarTodos,
    eliminarCliente,
    eliminarSeleccionados,
    cambiarEstadoCliente,
    stats,
    fetchClientes,
  } = useClientesTotales()
  const {
    zonas,
    showModal,
    setShowModal,
    showModalTipos,
    setShowModalTipos,
    savingCliente,
    viewMode,
    setViewMode,
    nuevoCliente,
    erroresValidacion,
    handleNuevoClienteChange,
    handleGuardarCliente,
    handleCerrarModal,
  } = useVerTodosLosClientes(fetchClientes)
  if (loading) {
    return <PageLoading message="Cargando clientes..." />
  }
  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    )
  }
  return (
    <div className="clientes-container">
      <PageHeader
        iconClass="bi bi-people"
        title="Todos los Clientes"
        subtitle="Gestiona y visualiza todos los clientes del sistema"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
        rightContent={
          <ClientesActionsBar
            onShowModalTipos={() => setShowModalTipos(true)}
            onShowModal={() => setShowModal(true)}
          />
        }
      />
      <Container className="py-3">
        <ClientesStatsGrid
          stats={stats}
          filtroEstado={filtroEstado}
          onFiltroEstadoChange={handleFiltroEstadoChange}
        />
        <ListFilterBar
          busqueda={busqueda}
          onBusquedaChange={handleBusquedaChange}
          filtroZona={filtroZona}
          onFiltroZonaChange={handleFiltroZonaChange}
          stats={stats}
          showCobradoresFilter={false}
        />
        {seleccionados.length > 0 && (
          <ClientesSeleccionBar
            totalFiltrados={clientesFiltrados.length}
            seleccionarTodosChecked={seleccionarTodos}
            onSeleccionarTodos={handleSeleccionarTodos}
            seleccionadosCount={seleccionados.length}
            onEliminarSeleccionados={eliminarSeleccionados}
          />
        )}
        <div className="clientes-section mt-4">
          <ListSectionHeader
            total={clientesFiltrados.length}
            label="Lista de Clientes"
            showViewToggle={true}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          {viewMode === "cards" ? (
            <ClientesCardsView
              clientesFiltrados={clientesFiltrados}
              seleccionados={seleccionados}
              handleSeleccion={handleSeleccion}
              navigate={navigate}
              eliminarCliente={eliminarCliente}
              cambiarEstadoCliente={cambiarEstadoCliente}
            />
          ) : (
            <ClientesListView
              clientesFiltrados={clientesFiltrados}
              seleccionados={seleccionados}
              handleSeleccion={handleSeleccion}
              navigate={navigate}
              cambiarEstadoCliente={cambiarEstadoCliente}
              eliminarCliente={eliminarCliente}
            />
          )}
        </div>
      </Container>
      <ModalAgregarCliente
        show={showModal}
        onHide={handleCerrarModal}
        zonas={zonas}
        nuevoCliente={nuevoCliente}
        erroresValidacion={erroresValidacion}
        onChange={handleNuevoClienteChange}
        onSubmit={handleGuardarCliente}
        saving={savingCliente}
      />
      <ModalTiposClientes
        show={showModalTipos}
        onHide={() => setShowModalTipos(false)}
        onAfterRecalcular={fetchClientes}
      />
    </div>
  )
}
export default VerTodosLosClientes
