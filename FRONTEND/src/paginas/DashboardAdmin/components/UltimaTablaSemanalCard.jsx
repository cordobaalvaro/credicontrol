import { Card, Button, Spinner, Form } from "react-bootstrap"
import { IconTable, IconFilter, IconPlus, IconListDetails } from "@tabler/icons-react"
import TablaSemanalCard from "../../TablasSemanalesClientes/componentes/TablaSemanalCard"
import ModalGenerarTablaSemanal from "../../TablasSemanalesClientes/modales/ModalGenerarTablaSemanal"
import useUltimaTablaSemanalCard from "../../../hooks/useUltimaTablaSemanalCard"
import "../DashboardAdmin.css"
const UltimaTablaSemanalCard = ({ dashboardData, loading, onDashboardRefresh }) => {
  const {
    cobradores,
    cobradorSeleccionado,
    ultimaTablaFiltrada,
    showModalGenerar,
    setShowModalGenerar,
    handleCobradorChange,
    handleTablaCreada,
    handleTablaActualizada,
    handleTablaEliminada
  } = useUltimaTablaSemanalCard(dashboardData, onDashboardRefresh)
  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <Card.Body className="text-center py-4">
          <Spinner animation="border" className="mb-3" />
          <span>Cargando última tabla semanal...</span>
        </Card.Body>
      </Card>
    )
  }
  return (
    <Card className="ultima-tabla-card-main shadow-sm border-0">
      <Card.Body className="p-4">
        {}
        <div className="ultima-tabla-header">
          <div className="d-flex align-items-center gap-3 flex-grow-1">
            <div className="ultima-tabla-icon">
              <IconTable size={22} />
            </div>
            <div className="ultima-tabla-title">
              <h6 className="mb-0 fw-semibold ultima-tabla-title">
                Última Tabla Semanal
              </h6>
              <small className="text-muted ultima-tabla-subtitle">
                Tabla más reciente registrada en el sistema
              </small>
            </div>
          </div>
          <div className="ultima-tabla-actions">
            <Button
              variant="light"
              size="sm"
              onClick={() => setShowModalGenerar(true)}
              className="ultima-tabla-action-btn ultima-tabla-action-btn--success"
              title="Generar tabla"
              aria-label="Generar tabla"
            >
              <IconPlus size={18} />
            </Button>
            <Button
              variant="light"
              size="sm"
              onClick={() => (window.location.href = "/#/tablas-semanales-clientes")}
              className="ultima-tabla-action-btn"
              title="Ver todas"
              aria-label="Ver todas"
            >
              <IconListDetails size={18} />
            </Button>
          </div>
        </div>
        {}
        <div className="mb-4">
          <div className="ultima-tabla-filter">
            <IconFilter size={16} className="ultima-tabla-filter-icon" />
            <Form.Select
              size="sm"
              value={cobradorSeleccionado}
              onChange={handleCobradorChange}
              className="ultima-tabla-filter-select"
            >
              <option value="">Todos los cobradores</option>
              {cobradores.map(cobrador => (
                <option key={cobrador._id} value={cobrador._id}>
                  {cobrador.nombre} {cobrador.apellido || ""}
                </option>
              ))}
            </Form.Select>
          </div>
        </div>
        <div className="ultima-tabla-content">
          {ultimaTablaFiltrada ? (
            <TablaSemanalCard
              tabla={ultimaTablaFiltrada}
              onTablaActualizada={handleTablaActualizada}
              onTablaEliminada={handleTablaEliminada}
              onActualizarTablas={onDashboardRefresh}
              modoCobrador={false}
            />
          ) : (
            <div className="text-center py-5 rounded-4 bg-light border border-dashed">
              <div className="mb-2 ultima-tabla-empty-icon-container">
                <IconTable size={48} className="ultima-tabla-empty-icon" />
              </div>
              <h6 className="mb-2 ultima-tabla-empty-title">
                No hay tablas semanales registradas
              </h6>
              <p className="text-muted ultima-tabla-empty-text mb-0">
                {cobradorSeleccionado
                  ? "Este cobrador no tiene tablas registradas"
                  : "No se encontraron tablas semanales en el sistema."}
              </p>
            </div>
          )}
        </div>
        <ModalGenerarTablaSemanal
          show={showModalGenerar}
          onHide={() => setShowModalGenerar(false)}
          onTablaCreada={handleTablaCreada}
        />
      </Card.Body>
    </Card>
  )
}
export default UltimaTablaSemanalCard
