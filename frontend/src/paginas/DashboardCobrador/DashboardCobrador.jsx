"use client"
import { Container, Row, Col, Button, Alert } from "react-bootstrap"
import {
  IconTrendingUp,
  IconAlertTriangle,
  IconExclamationCircle,
  IconCalendarEvent,
  IconCircleCheck,
  IconCheck
} from "@tabler/icons-react"
import PageHeader from "../../componentes/layout/PageHeader"
import useDashboardCobrador from "../../hooks/useDashboardCobrador"
import { useNavigate } from "react-router-dom"
import "./DashboardCobrador.css"
import UltimaTablaSemanalCard from "./componentes/UltimaTablaSemanalCard"
import TablaListCard from "./componentes/TablaListCard"
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
    selectedTablaId,
    handleSeleccionarTabla,
    handleMontoInlineChange,
    handleGuardarMontoInline,
    handleResetItem,
    handleCerrarTablaInline,
    handleRendirJornada,
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

        <UltimaTablaSemanalCard
          metricasDia={metricasDia}
          onCerrarTabla={handleCerrarTablaInline}
          onVerDetalles={handleVerDetalles}
          onRendirJornada={handleRendirJornada}
          onSeleccionarTabla={handleSeleccionarTabla}
        />

        <Row className="g-4 mb-4">
          <Col md={4}>
            <TablaListCard
              title="Préstamos Vencidos"
              count={metricasDia?.itemsTabla?.vencidos?.cantidad}
              montoTotal={metricasDia?.itemsTabla?.vencidos?.monto}
              items={metricasDia?.itemsTabla?.vencidos?.detalles}
              icon={IconAlertTriangle}
              variant="danger"
              emptyMessage="No hay préstamos vencidos"
              emptyIcon={IconExclamationCircle}
              getDireccionCobroFinal={getDireccionCobroFinal}
              montosInline={montosInline}
              handleMontoInlineChange={handleMontoInlineChange}
              handleGuardarMontoInline={handleGuardarMontoInline}
              onResetItem={handleResetItem}
              savingInline={savingInline}
              tablaId={tablaId}
            />
          </Col>
          <Col md={4}>
            <TablaListCard
              title="Préstamos Activos"
              count={metricasDia?.itemsTabla?.activos?.cantidad}
              montoTotal={metricasDia?.itemsTabla?.activos?.monto}
              items={metricasDia?.itemsTabla?.activos?.detalles}
              icon={IconExclamationCircle}
              variant="primary"
              emptyMessage="No hay préstamos activos para hoy"
              emptyIcon={IconCalendarEvent}
              getDireccionCobroFinal={getDireccionCobroFinal}
              montosInline={montosInline}
              handleMontoInlineChange={handleMontoInlineChange}
              handleGuardarMontoInline={handleGuardarMontoInline}
              onResetItem={handleResetItem}
              savingInline={savingInline}
              tablaId={tablaId}
            />
          </Col>
          <Col md={4}>
            <TablaListCard
              title="Ya Registrados"
              count={metricasDia?.itemsTabla?.reportados?.cantidad}
              montoTotal={metricasDia?.itemsTabla?.reportados?.monto}
              items={metricasDia?.itemsTabla?.reportados?.detalles}
              icon={IconCircleCheck}
              variant="success"
              emptyMessage="Aún no has registrado cobros"
              emptyIcon={IconCheck}
              getDireccionCobroFinal={getDireccionCobroFinal}
              montosInline={montosInline}
              handleMontoInlineChange={handleMontoInlineChange}
              handleGuardarMontoInline={handleGuardarMontoInline}
              onResetItem={handleResetItem}
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
