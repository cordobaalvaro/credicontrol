"use client"
import { useNavigate, useParams } from "react-router-dom"
import { Container, Alert, Row, Col, Card, Form, Button, Badge, Tabs, Tab } from "react-bootstrap"
import "./PaginaZona.css"
import PageHeader from "../../componentes/layout/PageHeader"
import ZonaCobradoresSection from "./componentes/ZonaCobradoresSection"
import ModalAsignarCobrador from "./modales/ModalAsignarCobrador"
import usePaginaZona from "../../hooks/usePaginaZona"
import ZonaClientesTab from "./componentes/ZonaClientesTab"
import ZonaPrestamosTab from "./componentes/ZonaPrestamosTab"
import ZonaResumenMetricas from "./componentes/ZonaResumenMetricas"
import ZonaRankingSection from "./componentes/ZonaRankingSection"
const PaginaZona = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    loading,
    error,
    overview,
    clientesData,
    setClientesData,
    prestamosData,
    setPrestamosData,
    qClientes,
    setQClientes,
    qPrestamos,
    setQPrestamos,
    estadoPrestamos,
    setEstadoPrestamos,
    showCobradorModal,
    setShowCobradorModal,
    cobradores,
    cobradorSeleccionado,
    setCobradorSeleccionado,
    loadingCobradores,
    asignandoCobrador,
    usuario,
    cargarTodo,
    fetchClientes,
    fetchPrestamos,
    fetchCobradoresDisponibles,
    asignarCobradorAZona,
    eliminarCobradorDeZona
  } = usePaginaZona(id);
  const zona = overview?.zona
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    )
  }
  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    )
  }
  if (!zona) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">Zona no encontrada</Alert>
      </Container>
    )
  }
  const metricas = overview?.metricas || {}
  const rankingTipos = overview?.rankingTiposClientes || {}
  const topBuenos = overview?.topClientes?.buenos || []
  const topMalos = overview?.topClientes?.malos || []
  const rankingZona = overview?.rankingZona || {}
  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "activo":
        return "badge-activo"
      case "cancelado":
        return "badge-cancelado"
      case "vencido":
        return "badge-vencido"
      case "desactivado":
      default:
        return "badge-desactivado"
    }
  }
  return (
    <div className="zona-container">
      <PageHeader
        title={zona.nombre || "Zona"}
        subtitle={`Bienvenido/a, ${usuario.nombre}. Vista y control de la zona`}
        iconClass="bi bi-geo-alt"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
        breadcrumbs={[]}
      />
      <Container>
        <Tabs defaultActiveKey="resumen" id="zona-tabs" className="mb-3">
          <Tab eventKey="resumen" title="Resumen">
            <div className="tab-content-wrapper mt-3">
              <ZonaResumenMetricas metricas={metricas} onRecargar={cargarTodo} />
              <Row className="g-3 mt-1">
                <Col md={12}>
                  <ZonaCobradoresSection
                    zona={zona}
                    onOpenAsignar={() => {
                      setCobradorSeleccionado("")
                      fetchCobradoresDisponibles()
                      setShowCobradorModal(true)
                    }}
                    onEliminarCobrador={eliminarCobradorDeZona}
                  />
                </Col>
              </Row>
              <ZonaRankingSection
                rankingZona={rankingZona}
                rankingTipos={rankingTipos}
                topBuenos={topBuenos}
                topMalos={topMalos}
              />
            </div>
          </Tab>
          <Tab eventKey="clientes" title={`Clientes (${clientesData.total || 0})`}>
            <div className="tab-content-wrapper mt-3">
              <ZonaClientesTab
                clientesData={clientesData}
                qClientes={qClientes}
                setQClientes={setQClientes}
                fetchClientes={fetchClientes}
                setClientesData={setClientesData}
                navigate={navigate}
                zonaId={zona._id}
              />
            </div>
          </Tab>
          <Tab eventKey="prestamos" title={`Préstamos (${prestamosData.total || 0})`}>
            <div className="tab-content-wrapper mt-3">
              <ZonaPrestamosTab
                prestamosData={prestamosData}
                qPrestamos={qPrestamos}
                setQPrestamos={setQPrestamos}
                estadoPrestamos={estadoPrestamos}
                setEstadoPrestamos={setEstadoPrestamos}
                fetchPrestamos={fetchPrestamos}
                setPrestamosData={setPrestamosData}
                navigate={navigate}
                getEstadoBadge={getEstadoBadge}
              />
            </div>
          </Tab>
        </Tabs>
        <ModalAsignarCobrador
          show={showCobradorModal}
          onHide={() => {
            setShowCobradorModal(false)
            setCobradorSeleccionado("")
          }}
          loading={loadingCobradores}
          cobradores={cobradores}
          selected={cobradorSeleccionado}
          onChange={setCobradorSeleccionado}
          onSubmit={asignarCobradorAZona}
          submitting={asignandoCobrador}
        />
      </Container>
    </div>
  )
}
export default PaginaZona
