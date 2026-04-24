"use client"
import { Container, Row, Col, Button, Alert } from "react-bootstrap"
import {
  IconTrendingUp,
  IconAlertTriangle,
  IconExclamationCircle,
  IconCalendarEvent,
  IconCircleCheck
} from "@tabler/icons-react"
import PageHeader from "../../componentes/layout/PageHeader"
import useDashboardCobrador from "../../hooks/useDashboardCobrador"
import { useNavigate } from "react-router-dom"
import "./DashboardCobrador.css"
import MisZonasCard from "./componentes/MisZonasCard"
import NovedadesCard from "./componentes/NovedadesCard"
import TablaListCard from "./componentes/TablaListCard"
import UltimaTablaSemanalCard from "./componentes/UltimaTablaSemanalCard"
import PageLoading from "../../componentes/ui/PageLoading"
const DashboardCobrador = () => {
  const navigate = useNavigate()
  const {
    dashboardData,
    loading,
    error,
    refreshData,
    lastUpdated,
    fetchMisZonas,
    fetchNovedades,
    fetchPrestamosActivos,
    fetchPrestamosVencidos,
    montosInline,
    savingInline,
    zonasData,
    novedadesData,
    loadingZonas,
    loadingNovedades,
    tablaId,
    handleMontoInlineChange,
    handleGuardarMontoInline,
    handleCerrarTablaInline,
    getDireccionCobroFinal,
    hasData
  } = useDashboardCobrador()
  const handleVerDetalles = () => {
    if (tablaId) {
      navigate(`/tablas-semanal/${tablaId}`, { state: { modoCobrador: true } })
    }
  }
  if (loading) {
    return <PageLoading message="Cargando dashboard..." />
  }
  if (error) {
    return (
      <Container fluid className="py-4">
        <Alert variant="danger" className="text-center">
          <IconAlertTriangle size={24} className="me-2" />
          {error}
        </Alert>
      </Container>
    )
  }
  if (!hasData) {
    return (
      <Container fluid className="py-4">
        <Alert variant="warning" className="text-center">
          No hay datos disponibles para mostrar
        </Alert>
      </Container>
    )
  }
  const { cobrador, metricasDia, alertas } = dashboardData
  return (
    <>
      <PageHeader
        title={`Dashboard - ${cobrador?.nombre || "Cobrador"}`}
        subtitle="Resumen de tu actividad"
        iconClass="bi bi-speedometer2"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
        rightContent={
          <Button variant="outline-success" onClick={refreshData} className="d-flex align-items-center">
            <IconTrendingUp size={16} className="me-2" />
            Actualizar
          </Button>
        }
      />
      <Container fluid className="py-4">
        {}
        {}
        <Row className="g-4 mb-4">
          <Col md={6}>
            <MisZonasCard
              zonasData={zonasData}
              loading={loadingZonas}
              fetchPrestamosActivos={fetchPrestamosActivos}
              fetchPrestamosVencidos={fetchPrestamosVencidos}
            />
          </Col>
          <Col md={6}>
            <NovedadesCard
              novedadesData={novedadesData}
              loading={loadingNovedades}
            />
          </Col>
        </Row>
        <UltimaTablaSemanalCard
          metricasDia={metricasDia}
          onCerrarTabla={handleCerrarTablaInline}
          onVerDetalles={handleVerDetalles}
        />
        {}
        <Row className="g-3 mb-4">
          <Col md={4}>
            <TablaListCard
              title="Vencidos"
              count={metricasDia?.itemsTabla?.vencidos?.cantidad}
              montoTotal={metricasDia?.itemsTabla?.vencidos?.monto}
              items={metricasDia?.itemsTabla?.vencidos?.detalles}
              icon={IconAlertTriangle}
              variant="danger"
              emptyMessage="No hay items vencidos"
              emptyIcon={IconExclamationCircle}
              getDireccionCobroFinal={getDireccionCobroFinal}
              montosInline={montosInline}
              handleMontoInlineChange={handleMontoInlineChange}
              handleGuardarMontoInline={handleGuardarMontoInline}
              savingInline={savingInline}
              tablaId={tablaId}
            />
          </Col>
          <Col md={4}>
            <TablaListCard
              title="Activos"
              count={metricasDia?.itemsTabla?.activos?.cantidad}
              montoTotal={metricasDia?.itemsTabla?.activos?.monto}
              items={metricasDia?.itemsTabla?.activos?.detalles}
              icon={IconCalendarEvent}
              variant="warning"
              emptyMessage="No hay próximos items"
              emptyIcon={IconCalendarEvent}
              getDireccionCobroFinal={getDireccionCobroFinal}
              montosInline={montosInline}
              handleMontoInlineChange={handleMontoInlineChange}
              handleGuardarMontoInline={handleGuardarMontoInline}
              savingInline={savingInline}
              tablaId={tablaId}
            />
          </Col>
          <Col md={4}>
            <TablaListCard
              title="Ya Reportados"
              count={metricasDia?.itemsTabla?.reportados?.cantidad}
              montoTotal={metricasDia?.itemsTabla?.reportados?.monto}
              items={metricasDia?.itemsTabla?.reportados?.detalles}
              icon={IconCircleCheck}
              variant="success"
              emptyMessage="No hay items reportados"
              emptyIcon={IconCircleCheck}
              getDireccionCobroFinal={getDireccionCobroFinal}
              montosInline={montosInline}
              handleMontoInlineChange={handleMontoInlineChange}
              handleGuardarMontoInline={handleGuardarMontoInline}
              savingInline={savingInline}
              tablaId={tablaId}
            />
          </Col>
        </Row>
      </Container>
    </>
  )
}
export default DashboardCobrador
