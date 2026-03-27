"use client"
import { Modal, Button, Spinner } from "react-bootstrap"
import PropTypes from "prop-types"
import { IconUsers, IconMessageCircle } from "@tabler/icons-react"
import StatsRow from "../../../componentes/ui/StatsRow"
import UnifiedListItem from "../../../componentes/ui/UnifiedListItem/UnifiedListItem"
import useModalTiposClientes, { getTipoData } from "../../../hooks/useModalTiposClientes"
import "./ModalTiposClientes.css"
const ModalTiposClientes = ({ show, onHide, onAfterRecalcular }) => {
  const {
    tipoSeleccionado,
    loadingRecalcular,
    loadingClientes,
    clientesPorTipo,
    error,
    razonLoadingId,
    stats,
    handleRecalcularTipos,
    handleTipoChange,
    fetchRazonTipo
  } = useModalTiposClientes(show, onAfterRecalcular)
  const statsItems = [
    {
      icon: IconUsers,
      iconColor: "total",
      value: stats.total,
      label: "Total",
      onClick: () => handleTipoChange("todos"),
      isActive: tipoSeleccionado === "todos",
    },
    {
      icon: getTipoData("bueno").icon,
      iconColor: "bueno",
      value: stats.bueno,
      label: "Bueno",
      onClick: () => handleTipoChange("bueno"),
      isActive: tipoSeleccionado === "bueno",
    },
    {
      icon: getTipoData("regular").icon,
      iconColor: "regular",
      value: stats.regular,
      label: "Regular",
      onClick: () => handleTipoChange("regular"),
      isActive: tipoSeleccionado === "regular",
    },
    {
      icon: getTipoData("malo").icon,
      iconColor: "malo",
      value: stats.malo,
      label: "Malo",
      onClick: () => handleTipoChange("malo"),
      isActive: tipoSeleccionado === "malo",
    },
    {
      icon: getTipoData("neutro").icon,
      iconColor: "neutro",
      value: stats.neutro,
      label: "Neutro",
      onClick: () => handleTipoChange("neutro"),
      isActive: tipoSeleccionado === "neutro",
    },
  ]
  return (
    <Modal show={show} onHide={onHide} size="xl" centered dialogClassName="modal-tipos-clientes">
      <Modal.Header closeButton className="modal-header-tipos">
        <Modal.Title className="modal-title-tipos">
          <IconUsers size={24} className="me-2" />
          Tipos de Clientes
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-tipos">
        <StatsRow items={statsItems} className="stats-row mb-4 stats-row-5" />
        <div className="mb-3 d-flex gap-2 justify-content-between align-items-center">
          <span className="text-muted">
            Mostrando <strong>{clientesPorTipo.length}</strong> cliente
            {clientesPorTipo.length !== 1 ? "s" : ""}
          </span>
          <Button
            variant="outline-success"
            size="sm"
            onClick={handleRecalcularTipos}
            disabled={loadingRecalcular}
            className="d-flex align-items-center"
          >
            {loadingRecalcular ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Recalculando...
              </>
            ) : (
              <>
                Recalcular tipos
              </>
            )}
          </Button>
        </div>
        {error && (
          <div className="alert alert-danger py-2 mb-3" role="alert">
            {error}
          </div>
        )}
        <div className="clientes-list-tipos">
          {loadingClientes ? (
            <div className="text-center py-4">
              <Spinner animation="border" size="sm" className="me-2" />
              Cargando clientes...
            </div>
          ) : clientesPorTipo.length === 0 ? (
            <div className="text-center py-4 text-muted">No hay clientes para el tipo seleccionado.</div>
          ) : (
            clientesPorTipo.map((cliente) => {
              const acciones = [
                {
                  icon: razonLoadingId === cliente._id ? Spinner : IconMessageCircle,
                  title: "Ver razón del tipo",
                  onClick: () => fetchRazonTipo(cliente._id),
                  color: "white",
                  backgroundColor: "var(--verde-principal)", 
                  isSpecial: true 
                }
              ]
              return (
                <div key={cliente._id} className="cliente-list-item-wrapper">
                  <UnifiedListItem
                    tipo="cliente"
                    data={cliente}
                    showCheckbox={false}
                    acciones={acciones}
                  />
                </div>
              )
            })
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
ModalTiposClientes.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onAfterRecalcular: PropTypes.func,
}
export default ModalTiposClientes
