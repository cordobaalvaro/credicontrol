import { Modal, Spinner, Form, Alert } from "react-bootstrap";
import LoadingButton from "../../../componentes/ui/LoadingButton";
import "./ModalAsignarCobrador.css";
const ModalAsignarCobrador = ({
  show,
  onHide,
  loading,
  cobradores,
  selected,
  onChange,
  onSubmit,
  submitting,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.();
  };
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton className="modal-header">
        <Modal.Title className="modal-asignar-title">
          <i className="bi bi-person-badge me-2"></i>
          Agregar Cobrador a la Zona
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="success" />
              <p className="mt-3">Cargando cobradores...</p>
            </div>
          ) : cobradores.length === 0 ? (
            <div className="text-center py-4">
              <i
                className="bi bi-exclamation-circle modal-asignar-warning-icon"
              ></i>
              <h5 className="mt-3">No hay cobradores disponibles</h5>
              <p className="text-muted">
                Todos los cobradores ya están asignados a esta zona o no hay
                cobradores en el sistema.
              </p>
            </div>
          ) : (
            <>
              <Form.Group>
                <Form.Label>
                  <i className="bi bi-person-check me-2"></i>
                  Selecciona un cobrador para agregar a la zona:
                </Form.Label>
                <Form.Select
                  value={selected}
                  onChange={(e) => onChange(e.target.value)}
                  size="lg"
                >
                  <option value="">-- Selecciona un cobrador --</option>
                  {cobradores.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.nombre} {c.apellido || ""} - {c.usuarioLogin}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              {selected && (
                <div
                  className="mt-3 p-3 modal-asignar-selected-info"
                >
                  <h6>
                    <i className="bi bi-info-circle me-2"></i>
                    Información del cobrador:
                  </h6>
                  {(() => {
                    const co = cobradores.find((c) => c._id === selected);
                    return co ? (
                      <div>
                        <p className="mb-1">
                          <strong>Nombre:</strong> {co.nombre}{" "}
                          {co.apellido || ""}
                        </p>
                        <p className="mb-1">
                          <strong>Usuario:</strong> {co.usuarioLogin}
                        </p>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
              <Alert variant="info" className="mt-3 mb-0">
                <i className="bi bi-lightbulb me-2"></i>
                <strong>Nota:</strong> Puedes asignar múltiples cobradores a
                esta zona.
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-secondary" onClick={onHide}>
            Cancelar
          </button>
          {cobradores.length > 0 && (
            <LoadingButton
              type="submit"
              variant="success"
              loading={submitting}
              disabled={!selected}
            >
              Agregar Cobrador
            </LoadingButton>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
export default ModalAsignarCobrador;
