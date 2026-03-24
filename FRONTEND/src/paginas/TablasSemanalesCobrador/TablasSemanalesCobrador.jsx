"use client"
import { Container, Row, Col, Alert, Button } from "react-bootstrap"
import { IconRefresh } from "@tabler/icons-react"
import PageHeader from "../../componentes/layout/PageHeader"
import PageLoading from "../../componentes/ui/PageLoading"
import useTablasSemanalesCobrador from "../../hooks/useTablasSemanalesCobrador"
import CobradorStatsRow from "./componentes/CobradorStatsRow"
import CobradorFilterCard from "./componentes/CobradorFilterCard"
import CobradorTablasList from "./componentes/CobradorTablasList"
const TablasSemanalesCobrador = () => {
  const {
    tablas,
    loading,
    error,
    busqueda,
    estadoFiltro,
    mesFiltro,
    setMesFiltro,
    stats,
    handleTablaActualizada,
    handleEstadoStatClick,
    handleRefreshClick
  } = useTablasSemanalesCobrador();
  if (loading) {
    return <PageLoading message="Cargando tablas semanales..." />
  }
  return (
    <div className="tablas-semanales-container">
      <PageHeader
        iconClass="bi bi-calendar-week"
        title="Mis Tablas Semanales"
        subtitle="Consulta y carga los cobros de tus tablas semanales."
        showBackButton={true}
        onBackClick={() => window.history.back()}
        rightContent={
          <Button
            variant="outline-success"
            onClick={handleRefreshClick}
            className="d-flex align-items-center"
          >
            <IconRefresh size={18} className="me-1" />
            Actualizar
          </Button>
        }
      />
      <Container className="mt-3">
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        <CobradorStatsRow
          stats={stats}
          estadoFiltro={estadoFiltro}
          onStatClick={handleEstadoStatClick}
        />
        <CobradorFilterCard
          mesFiltro={mesFiltro}
          setMesFiltro={setMesFiltro}
        />
        <CobradorTablasList
          tablas={tablas}
          hasFilters={!!(busqueda || estadoFiltro || mesFiltro)}
          onTablaActualizada={handleTablaActualizada}
        />
      </Container>
    </div>
  )
}
export default TablasSemanalesCobrador
