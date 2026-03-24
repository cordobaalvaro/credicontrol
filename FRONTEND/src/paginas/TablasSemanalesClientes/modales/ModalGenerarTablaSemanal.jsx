"use client"
import { Modal, Button, Form, Spinner } from "react-bootstrap"
import useModalGenerarTablaSemanal from "../../../hooks/useModalGenerarTablaSemanal"
const ModalGenerarTablaSemanal = ({ show, onHide, onTablaCreada }) => {
  const {
    cobradores,
    cobradorId,
    setCobradorId,
    fechaInicio,
    fechaFin,
    loadingCobradores,
    saving,
    error,
    handleClose,
    handleFechaInicioChange,
    handleSubmit
  } = useModalGenerarTablaSemanal({ show, onHide, onTablaCreada })
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Generar tabla semanal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <Form.Label>Cobrador</Form.Label>
            <Form.Select
              value={cobradorId}
              onChange={(e) => setCobradorId(e.target.value)}
              disabled={loadingCobradores || saving}
            >
              <option value="">Selecciona un cobrador</option>
              {cobradores.map((cobrador) => (
                <option key={cobrador._id} value={cobrador._id}>
                  {cobrador.nombre || cobrador.email}
                </option>
              ))}
            </Form.Select>
          </div>
          <div className="mb-3 d-flex gap-2">
            <div className="flex-fill">
              <Form.Label>Fecha inicio</Form.Label>
              <Form.Control
                type="date"
                value={fechaInicio}
                onChange={handleFechaInicioChange}
                disabled={saving}
              />
              <div className="text-muted small mt-1">Solo se permiten semanas que comienzan lunes.</div>
            </div>
            <div className="flex-fill">
              <Form.Label>Fecha fin</Form.Label>
              <Form.Control
                type="date"
                value={fechaFin}
                onChange={() => { }}
                disabled={true}
              />
              <div className="text-muted small mt-1">Se calcula automáticamente (domingo).</div>
            </div>
          </div>
          {error && <div className="text-danger small mt-1">{error}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={saving}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            Generar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
export default ModalGenerarTablaSemanal
