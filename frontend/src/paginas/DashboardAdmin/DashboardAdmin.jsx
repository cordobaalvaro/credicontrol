"use client"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col, Alert, Form, Button, Spinner } from "react-bootstrap"
import { IconRefresh } from "@tabler/icons-react"
import PageHeader from "../../componentes/layout/PageHeader"
import PageLoading from "../../componentes/ui/PageLoading"
import "./DashboardAdmin.css"
import ModalCobradores from "./components/ModalCobradores"
import ModalCrearZona from "./modales/ModalCrearZona"
import ModalEditarZona from "./modales/ModalEditarZona"
import UltimaTablaSemanalCard from "./components/UltimaTablaSemanalCard"
import MetricasOperativasCard from "./components/MetricasOperativasCard"
import AlertasPrestamosCard from "./components/AlertasPrestamosCard"
import CobradosMesModal from "./components/CobradosMesModal"
import PrestadosMesModal from "./components/PrestadosMesModal"
import GestionZonasModal from "./components/GestionZonasModal"
import useDashboardAdmin from "../../hooks/useDashboardAdmin"
import useZonas from "../../hooks/useZonas"
const DashboardAdmin = () => {
  const navigate = useNavigate()
  const {
    dashboardData,
    loading,
    error,
    filtroMes,
    setFiltroMes,
    filtroAnio,
    setFiltroAnio,
    showCobradoresModal,
    setShowCobradoresModal,
    showCobradosMesModal,
    setShowCobradosMesModal,
    showPrestadosMesModal,
    setShowPrestadosMesModal,
    showZonasModal,
    setShowZonasModal,
    cobradosMesData,
    loadingCobradosMes,
    prestadosMesData,
    loadingPrestadosMes,
    actualizandoPrestamos,
    fetchDashboardData,
    handleActualizarPrestamos
  } = useDashboardAdmin()
  const {
    zonasData,
    loadingZonas,
    fetchZonasData,
    showCrearZonaModal,
    showEditarZonaModal,
    nuevaZona,
    setNuevaZona,
    nuevaLocalidad,
    setNuevaLocalidad,
    zonaEditando,
    setZonaEditando,
    nuevaLocalidadEdit,
    setNuevaLocalidadEdit,
    creatingZona,
    updatingZona,
    deletingZona,
    abrirModalCrearZona,
    cerrarModalCrearZona,
    handleInputChangeZona,
    agregarLocalidad,
    eliminarLocalidad,
    crearZona,
    abrirModalEditarZona,
    cerrarModalEditarZona,
    handleInputChangeEdit,
    agregarLocalidadEdit,
    eliminarLocalidadEdit,
    actualizarZona,
    eliminarZona,
  } = useZonas(() => {
    fetchDashboardData()
  })
  useEffect(() => {
    fetchZonasData(filtroMes, filtroAnio)
  }, [filtroMes, filtroAnio])
  useEffect(() => {
    if (showZonasModal) {
      fetchZonasData(filtroMes, filtroAnio)
    }
  }, [showZonasModal, filtroMes, filtroAnio])
  if (loading) {
    return <PageLoading message="Cargando dashboard..." />
  }
  if (error) {
    return (
      <Container className="dashboard-container">
        <Alert variant="danger" className="mt-4">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    )
  }
  return (
    <>
      <PageHeader
        title="Dashboard Administrativo"
        subtitle="Vista general de métricas y alertas del sistema"
        iconClass="bi bi-graph-up-arrow"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
        breadcrumbs={[
          { label: "Inicio", path: "/admin" },
          { label: "Dashboard", path: "/dashboard" },
        ]}
        rightContent={
          <div className="d-flex align-items-center gap-3 flex-wrap justify-content-end">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleActualizarPrestamos}
              disabled={actualizandoPrestamos}
              className="d-flex align-items-center"
            >
              {actualizandoPrestamos ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Actualizando...
                </>
              ) : (
                <>
                  <IconRefresh size={18} className="me-2" />
                  Actualizar Préstamos
                </>
              )}
            </Button>
          </div>
        }
      />
      <Container fluid className="dashboard-container">

        {}
        <MetricasOperativasCard
          dashboardData={dashboardData}
          onShowZonas={() => setShowZonasModal(true)}
          onShowCobradores={() => setShowCobradoresModal(true)}
        />

        {}

        <Row className="g-3 mb-4">
          <Col md={6}>
            <AlertasPrestamosCard
              dashboardData={dashboardData}
              onGoPrestamo={(id) => navigate(`/prestamo/${id}`)}
            />
          </Col>
          <Col md={6}>
            <UltimaTablaSemanalCard dashboardData={dashboardData} loading={loading} onDashboardRefresh={fetchDashboardData} />
          </Col>
        </Row>
        <ModalCobradores show={showCobradoresModal} onHide={() => setShowCobradoresModal(false)} onCobradorActualizado={fetchDashboardData} />
        <CobradosMesModal
          show={showCobradosMesModal}
          onHide={() => setShowCobradosMesModal(false)}
          loading={loadingCobradosMes}
          cobradosMesData={cobradosMesData}
        />
        <PrestadosMesModal
          show={showPrestadosMesModal}
          onHide={() => setShowPrestadosMesModal(false)}
          loading={loadingPrestadosMes}
          prestadosMesData={prestadosMesData}
        />
        <GestionZonasModal
          show={showZonasModal}
          onHide={() => setShowZonasModal(false)}
          loadingZonas={loadingZonas}
          zonasData={zonasData}
          onNuevaZona={abrirModalCrearZona}
          onEditarZona={abrirModalEditarZona}
          onEliminarZona={eliminarZona}
          onZonaClick={(zonaId) => {
            setShowZonasModal(false)
            navigate(`/zona/${zonaId}`)
          }}
        />
        <ModalCrearZona
          show={showCrearZonaModal}
          onHide={cerrarModalCrearZona}
          nuevaZona={nuevaZona}
          nuevaLocalidad={nuevaLocalidad}
          setNuevaLocalidad={setNuevaLocalidad}
          onInputChange={handleInputChangeZona}
          onAgregarLocalidad={agregarLocalidad}
          onEliminarLocalidad={eliminarLocalidad}
          onSubmit={() => crearZona(filtroMes, filtroAnio)}
          submitting={creatingZona}
        />
        <ModalEditarZona
          show={showEditarZonaModal}
          onHide={cerrarModalEditarZona}
          zonaEditando={zonaEditando}
          nuevaLocalidadEdit={nuevaLocalidadEdit}
          setNuevaLocalidadEdit={setNuevaLocalidadEdit}
          onInputChange={handleInputChangeEdit}
          onAgregarLocalidad={agregarLocalidadEdit}
          onEliminarLocalidad={eliminarLocalidadEdit}
          onSubmit={() => actualizarZona(filtroMes, filtroAnio)}
          submitting={updatingZona}
        />
      </Container>
    </>
  )
}
export default DashboardAdmin
