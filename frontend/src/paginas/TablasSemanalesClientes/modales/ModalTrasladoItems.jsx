import { Modal, Button, Form, Alert } from "react-bootstrap"
import { IconX, IconCheck } from "@tabler/icons-react"
import useModalTrasladoItems from "../../../hooks/useModalTrasladoItems"
const ModalTrasladoItems = ({
  show,
  onHide,
  itemsSeleccionados,
  tablaOrigen,
  onTrasladoCompleto,
  onActualizarTablas
}) => {
  const {
    tablas,
    tablaDestino,
    setTablaDestino,
    loading,
    error,
    handleTraslado,
    handleClose
  } = useModalTrasladoItems({
    show,
    onHide,
    itemsSeleccionados,
    tablaOrigen,
    onTrasladoCompleto,
    onActualizarTablas
  })
  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Trasladar Items</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <p className="text-muted">
            Seleccionar tabla destino para trasladar <strong>{itemsSeleccionados.length}</strong> items
          </p>
        </div>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        <Form.Group>
          <Form.Label>Tabla Destino</Form.Label>
          <Form.Select
            value={tablaDestino}
            onChange={(e) => setTablaDestino(e.target.value)}
            disabled={loading}
          >
            <option value="">Seleccionar tabla...</option>
            {tablas.map((tabla) => (
              <option key={tabla._id} value={tabla._id}>
                {tabla.cobrador?.nombre || tabla.cobrador?.email} -
                {new Date(tabla.fechaInicio).toLocaleDateString()} al {new Date(tabla.fechaFin).toLocaleDateString()}
                ({tabla.estado})
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        {tablaDestino && (
          <div className="mt-3">
            <small className="text-muted">
              Items a trasladar: {itemsSeleccionados.length}
            </small>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          disabled={loading}
          className="d-flex align-items-center"
        >
          <IconX size={16} className="me-1" />
          Cancelar
        </Button>
        <Button
          variant="success"
          onClick={handleTraslado}
          disabled={loading || !tablaDestino}
          className="d-flex align-items-center"
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-1" />
              Trasladando...
            </>
          ) : (
            <>
              <IconCheck size={16} className="me-1" />
              Trasladar Items
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
export default ModalTrasladoItems
