"use client"
import { Container, Row, Col, Alert, Button, Form, Card } from "react-bootstrap"
import { IconCalendarWeek, IconRefresh, IconPlus } from "@tabler/icons-react"
import PageHeader from "../../componentes/layout/PageHeader"
import StatsRow from "../../componentes/ui/StatsRow"
import ListSectionHeader from "../../componentes/ui/ListSectionHeader"
import TablaSemanalCard from "./componentes/TablaSemanalCard"
import ModalGenerarTablaSemanal from "./modales/ModalGenerarTablaSemanal"
import PageLoading from "../../componentes/ui/PageLoading"
import useTablasSemanalesClientes from "../../hooks/useTablasSemanalesClientes"
import "./TablasSemanalesClientes.css"
const TablasSemanalesClientes = () => {
  const {
    tablas,
    loading,
    error,
    viewMode,
    setViewMode,
    showModalGenerar,
    setShowModalGenerar,
    busqueda,
    setBusqueda,
    estadoFiltro,
    mesFiltro,
    setMesFiltro,
    cobradorFiltro,
    setCobradorFiltro,
    tablasBase,
    stats,
    handleEstadoStatClick,
    handleRefreshClick,
    handleActualizarTablas,
    handleTablaActualizada,
    handleTablaCreada,
    handleEliminarTabla
  } = useTablasSemanalesClientes();
  if (loading) {
    return <PageLoading message="Cargando tablas semanales..." />
  }
  return (
    <div className="tablas-semanales-container">
      <PageHeader
        iconClass="bi bi-calendar-week"
        title="Tablas Semanales de Clientes"
        subtitle="Genera y administra las tablas semanales por cobrador."
        showBackButton={true}
        onBackClick={() => navigate(-1)}
        rightContent={
          <div className="d-flex gap-2 flex-wrap justify-content-end">
            <Button
              variant="outline-success"
              onClick={handleRefreshClick}
              className="d-flex align-items-center"
            >
              <IconRefresh size={18} className="me-2" />
              Actualizar
            </Button>
            <Button
              variant="success"
              onClick={() => setShowModalGenerar(true)}
              className="d-flex align-items-center"
            >
              <IconPlus size={18} className="me-2" />
              Generar tabla
            </Button>
          </div>
        }
      />
      <Container className="mt-3">
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        <StatsRow
          className="stats-row mb-4 stats-row-4"
          items={[
            {
              icon: IconCalendarWeek,
              iconColor: "total",
              value: stats.total,
              label: "Total Tablas",
              onClick: () => handleEstadoStatClick(""),
              isActive: !estadoFiltro,
            },
            {
              icon: IconCalendarWeek,
              iconColor: "secondary",
              value: stats.borrador,
              label: "Borrador",
              onClick: () => handleEstadoStatClick("borrador"),
              isActive: estadoFiltro === "borrador",
            },
            {
              icon: IconCalendarWeek,
              iconColor: "secondary",
              value: stats.enviada,
              label: "Enviadas",
              onClick: () => handleEstadoStatClick("enviada"),
              isActive: estadoFiltro === "enviada",
            },
            {
              icon: IconCalendarWeek,
              iconColor: "success",
              value: stats.cerrada,
              label: "Cerradas",
              onClick: () => handleEstadoStatClick("cerrada"),
              isActive: estadoFiltro === "cerrada",
            },
          ]}
        />
        <Card className="filter-card mb-4">
          <Card.Body className="p-3 p-md-4">
            <Row className="g-3 align-items-center">
              <Col md={4} className="d-flex align-items-center">
                <Form.Label className="me-2 mb-0">Mes</Form.Label>
                <Form.Control
                  type="month"
                  value={mesFiltro}
                  onChange={(e) => setMesFiltro(e.target.value)}
                  className="filter-month-input"
                />
              </Col>
              <Col md={8} className="d-flex align-items-center justify-content-md-end">
                <Form.Select
                  value={cobradorFiltro}
                  onChange={(e) => setCobradorFiltro(e.target.value)}
                  className="filter-select-cobrador"
                >
                  <option value="">Filtrar por cobrador</option>
                  {Array.from(
                    new Set(
                      tablas
                        .map((t) =>
                          typeof t.cobrador === "object" ? t.cobrador?.nombre || t.cobrador?.email : t.cobrador,
                        )
                        .filter(Boolean),
                    ),
                  ).map((nombre) => (
                    <option key={nombre} value={nombre}>
                      {nombre}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <div className="tablas-semanales-section">
          <ListSectionHeader
            total={tablas.length}
            label="Tablas Semanales Filtradas"
            showViewToggle={true}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          {tablas.length === 0 ? (
            <Row className="mt-3">
              <Col>
                <div className="empty-state-card">
                  <IconCalendarWeek size={40} className="text-muted mb-2" />
                  <h5 className="text-muted">
                    {tablasBase.length === 0 && !busqueda && !estadoFiltro && !mesFiltro && !cobradorFiltro
                      ? "No hay tablas semanales generadas"
                      : "No hay tablas que coincidan con los filtros"}
                  </h5>
                  <p className="text-muted mb-0">
                    {tablasBase.length === 0 && !busqueda && !estadoFiltro && !mesFiltro && !cobradorFiltro
                      ? "Usa el botón 'Generar tabla' para crear la primera tabla semanal."
                      : "Intenta ajustar los filtros para ver más resultados."}
                  </p>
                </div>
              </Col>
            </Row>
          ) : (
            <Row className="mt-3">
              {tablas.map((tabla) => (
                <Col key={tabla._id} md={6} lg={4} className="mb-3">
                  <TablaSemanalCard
                    tabla={tabla}
                    onTablaActualizada={handleTablaActualizada}
                    onTablaEliminada={handleEliminarTabla}
                    onActualizarTablas={handleActualizarTablas}
                  />
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Container>
      <ModalGenerarTablaSemanal
        show={showModalGenerar}
        onHide={() => setShowModalGenerar(false)}
        onTablaCreada={handleTablaCreada}
      />
    </div>
  )
}
export default TablasSemanalesClientes
