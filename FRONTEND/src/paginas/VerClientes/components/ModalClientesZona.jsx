import { Modal, Button, InputGroup, Form } from "react-bootstrap"
import { IconUsers, IconX, IconSearch, IconInbox, IconEye } from "@tabler/icons-react"
import UnifiedListItem from "../../../componentes/ui/UnifiedListItem/UnifiedListItem"
import { useNavigate } from "react-router-dom"
const ModalClientesZona = ({ 
  show, 
  onHide, 
  zona, 
  clientes, 
  busqueda, 
  onBusquedaChange, 
  clientesFiltrados 
}) => {
  const navigate = useNavigate()
  return (
    <Modal show={show} onHide={onHide} size="xl" centered className="modal-clientes-zona">
      <Modal.Header className="modal-clientes-header">
        <div className="modal-header-content">
          <div className="modal-header-icon">
            <IconUsers size={28} />
          </div>
          <div className="modal-header-text">
            <Modal.Title>Clientes de {zona?.nombre}</Modal.Title>
            <p className="modal-subtitle">
              {clientes.length} cliente{clientes.length !== 1 ? "s" : ""} registrado
              {clientes.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <button className="modal-close-btn" onClick={onHide}>
          <IconX size={24} />
        </button>
      </Modal.Header>
      <Modal.Body className="modal-clientes-body">
        <div className="modal-search-container">
          <InputGroup>
            <InputGroup.Text className="modal-search-icon">
              <IconSearch size={18} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar cliente por nombre, DNI o teléfono..."
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
              className="modal-search-input"
            />
          </InputGroup>
        </div>
        <div className="modal-clientes-list">
          {clientesFiltrados.length > 0 ? (
            clientesFiltrados.map((cliente) => (
              <UnifiedListItem
                key={cliente._id}
                tipo="cliente"
                data={{ ...cliente, zona: cliente.zona || zona }}
                isSelected={false}
                onToggleSelected={() => { }}
                onClick={() => navigate(`/cliente/${cliente._id}`)}
                acciones={[
                  {
                    icon: IconEye,
                    title: "Ver perfil",
                    onClick: () => navigate(`/cliente/${cliente._id}`),
                    color: "var(--azul-info)"
                  }
                ]}
              />
            ))
          ) : (
            <div className="modal-empty-state">
              <IconInbox size={48} className="empty-icon mb-3" />
              <h5 className="text-muted">
                {busqueda ? "No se encontraron clientes" : "No hay clientes en esta zona"}
              </h5>
              <p className="text-muted mb-0">
                {busqueda
                  ? "Intenta con otros términos de búsqueda"
                  : "Esta zona aún no tiene clientes asignados"}
              </p>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="modal-clientes-footer">
        <Button variant="secondary" onClick={onHide} className="btn-cerrar-modal">
          <IconX size={18} className="me-2" />
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
export default ModalClientesZona
