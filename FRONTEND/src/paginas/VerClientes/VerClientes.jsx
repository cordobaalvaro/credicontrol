"use client"
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import {
  IconArrowLeft,
  IconSearch,
  IconMapPin,
} from "@tabler/icons-react"
import PageHeader from "../../componentes/layout/PageHeader"
import PageLoading from "../../componentes/ui/PageLoading"
import useVerClientes from "../../hooks/useVerClientes"
import ResumenGeneralCard from "./components/ResumenGeneralCard"
import ZonaListItemCard from "./components/ZonaListItemCard"
import ModalClientesZona from "./components/ModalClientesZona"
import "./VerClientes.css"
const VerClientes = () => {
  const navigate = useNavigate()
  const {
    zonas,
    loading,
    busqueda,
    setBusqueda,
    modalClientes,
    busquedaModal,
    setBusquedaModal,
    estadisticasGenerales,
    abrirModalClientes,
    cerrarModalClientes,
    clientesFiltradosModal,
    zonasFiltradas
  } = useVerClientes()
  if (loading) {
    return <PageLoading message="Cargando clientes..." />
  }
  return (
    <div className="clientes-container">
      <PageHeader
        iconClass="bi bi-people-fill"
        title="Ver Clientes"
        subtitle="Gestiona los clientes de tus zonas asignadas"
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />
      <Container className="px-2">
        {}
        <ResumenGeneralCard 
          zonasCount={zonas.length} 
          estadisticas={estadisticasGenerales} 
        />
        {}
        <div className="search-card">
          <Row className="align-items-center">
            <Col md={8}>
              <InputGroup>
                <InputGroup.Text className="search-icon">
                  <IconSearch size={20} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Buscar zona por nombre o localidad..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="search-input"
                />
              </InputGroup>
            </Col>
            <Col md={4} className="d-flex justify-content-md-end mt-3 mt-md-0">
              <span className="info-badge">
                <IconMapPin size={16} className="me-2" />
                {zonas.length} zona(s) a cargo
              </span>
            </Col>
          </Row>
        </div>
        {}
        {zonasFiltradas.length > 0 ? (
          zonasFiltradas.map((zona) => (
            <ZonaListItemCard 
              key={zona._id} 
              zona={zona} 
              onVerClientes={abrirModalClientes} 
            />
          ))
        ) : (
          <div className="estado-vacio">
            <IconMapPin size={64} className="empty-icon mb-3" />
            <h3 className="text-muted mb-3">{busqueda ? "No se encontraron zonas" : "No tienes zonas asignadas"}</h3>
            <p className="text-muted mb-4">
              {busqueda
                ? "Intenta con otros términos de búsqueda"
                : "Contacta al administrador para que te asigne zonas de trabajo."}
            </p>
            {!busqueda && (
              <button
                className="btn-volver-dashboard"
                onClick={() => navigate(-1)}
              >
                <IconArrowLeft size={18} className="me-2" />
                Volver al Dashboard
              </button>
            )}
          </div>
        )}
      </Container>
      {}
      <ModalClientesZona 
        show={modalClientes.show}
        onHide={cerrarModalClientes}
        zona={modalClientes.zona}
        clientes={modalClientes.clientes}
        busqueda={busquedaModal}
        onBusquedaChange={setBusquedaModal}
        clientesFiltrados={clientesFiltradosModal}
      />
    </div>
  )
}
export default VerClientes
