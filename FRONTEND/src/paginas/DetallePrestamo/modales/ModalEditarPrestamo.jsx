import { Modal, Form, Row, Col } from "react-bootstrap";
import LoadingButton from "../../../componentes/ui/LoadingButton";
const obtenerFrecuenciaTexto = (frecuencia) => {
  switch (frecuencia) {
    case "semanal":
      return "semanal";
    case "quincenal":
      return "quincenal";
    case "mensual":
      return "mensual";
    default:
      return "mensual";
  }
};
const ModalEditarPrestamo = ({
  show,
  onHide,
  errores,
  prestamoEditado,
  onChange,
  usarCuotaPersonalizada,
  toggleModoCuota,
  montoCuotaPersonalizada,
  onChangeCuotaPersonalizada,
  onSubmit,
  submitting = false,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-pencil-square me-2"></i>
          Editar Préstamo
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {}
          <h6 className="text-secondary mb-3 border-bottom pb-2">
            <i className="bi bi-file-earmark-text me-2"></i>
            Configuración General
          </h6>
          <Row>
            <Col md={6} sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <i className="bi bi-tag me-2"></i>
                  Nombre del Préstamo *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={prestamoEditado.nombre}
                  onChange={onChange}
                  placeholder="Ingrese el nombre del préstamo"
                  required
                  isInvalid={!!errores.nombre}
                />
                {errores.nombre && (
                  <Form.Control.Feedback type="invalid">
                    {errores.nombre}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col md={6} sm={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <i className="bi bi-calendar-event me-2"></i>
                  Fecha de Inicio *
                </Form.Label>
                <Form.Control
                  type="date"
                  name="fechaInicio"
                  value={prestamoEditado.fechaInicio}
                  onChange={onChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          {}
          <h6 className="text-secondary mt-2 mb-3 border-bottom pb-2">
            <i className="bi bi-gear me-2"></i>
            Modalidad y Frecuencia
          </h6>
          <Row className="align-items-start">
            <Col md={4} sm={12}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <i className="bi bi-calendar-week me-2"></i>
                  Frecuencia de Pago *
                </Form.Label>
                <Form.Select
                  name="frecuencia"
                  value={prestamoEditado.frecuencia}
                  onChange={onChange}
                  required
                  isInvalid={!!errores.frecuencia}
                >
                  <option value="semanal">Semanal</option>
                  <option value="quincenal">Quincenal</option>
                  <option value="mensual">Mensual</option>
                </Form.Select>
                {errores.frecuencia && (
                  <Form.Control.Feedback type="invalid">
                    {errores.frecuencia}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col md={4} sm={6}>
              <Form.Group className="mb-3 p-2 border rounded bg-light">
                <Form.Label className="mb-1 d-block fw-bold modal-editar-prestamo-label">
                  <i className="bi bi-calculator me-2"></i>
                  Modo de Cálculo
                </Form.Label>
                <Form.Check
                  type="switch"
                  id="custom-switch-edit"
                  checked={usarCuotaPersonalizada}
                  onChange={toggleModoCuota}
                  label={usarCuotaPersonalizada ? "Fijar Cuota" : "Interés Auto"}
                />
              </Form.Group>
            </Col>
            <Col md={4} sm={6}>
              <div className="mb-3 p-2 border rounded modal-editar-prestamo-warning">
                <small className="modal-editar-prestamo-warning-text">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Al editar, el plan de cuotas se regenerará pero <b>los pagos realizados se mantendrán</b>.
                </small>
              </div>
            </Col>
          </Row>
          {}
          <h6 className="text-secondary mt-2 mb-3 border-bottom pb-2">
            <i className="bi bi-cash-coin me-2"></i>
            Detalles Financieros
          </h6>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <i className="bi bi-currency-dollar me-2"></i>
                  Monto Inicial *
                </Form.Label>
                <Form.Control
                  type="number"
                  name="montoInicial"
                  value={prestamoEditado.montoInicial}
                  onChange={onChange}
                  placeholder="Monto a prestar"
                  min="0"
                  step="0.01"
                  required
                  isInvalid={!!errores.montoInicial}
                />
                {errores.montoInicial && (
                  <Form.Control.Feedback type="invalid">
                    {errores.montoInicial}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col md={4}>
              {usarCuotaPersonalizada ? (
                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="bi bi-currency-dollar me-2"></i>
                    Monto por Cuota *
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={montoCuotaPersonalizada}
                    onChange={onChangeCuotaPersonalizada}
                    placeholder="Monto exacto"
                    min="0"
                    step="0.01"
                    required
                    isInvalid={!!errores.montoCuotaPersonalizadaEdit}
                  />
                  {errores.montoCuotaPersonalizadaEdit && (
                    <Form.Control.Feedback type="invalid">
                      {errores.montoCuotaPersonalizadaEdit}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              ) : (
                <Form.Group className="mb-3">
                  <Form.Label>
                    <i className="bi bi-percent me-2"></i>
                    Interés (%) *
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="interes"
                    value={prestamoEditado.interes}
                    onChange={onChange}
                    placeholder="Porcentaje (ej. 20)"
                    min="0"
                    step="0.1"
                    required
                    isInvalid={!!errores.interes}
                  />
                  {errores.interes && (
                    <Form.Control.Feedback type="invalid">
                      {errores.interes}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              )}
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <i className="bi bi-calendar-check me-2"></i>
                  Cantidad Cuotas *
                </Form.Label>
                <Form.Control
                  type="number"
                  name="cantidadCuotas"
                  value={prestamoEditado.cantidadCuotas}
                  onChange={onChange}
                  placeholder="Total"
                  min="1"
                  max="36"
                  required
                  isInvalid={!!errores.cantidadCuotas}
                />
                {errores.cantidadCuotas && (
                  <Form.Control.Feedback type="invalid">
                    {errores.cantidadCuotas}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>
          {}
          {prestamoEditado.montoInicial &&
            prestamoEditado.cantidadCuotas &&
            ((usarCuotaPersonalizada && montoCuotaPersonalizada) ||
              (!usarCuotaPersonalizada && prestamoEditado.interes)) && (
              <div className="mt-3 p-3 shadow-sm modal-editar-prestamo-resumen">
                <h6 className="mb-3 modal-editar-prestamo-resumen-title">
                  <i className="bi bi-calculator me-2"></i>
                  Resumen del Préstamo Editado
                </h6>
                <Row className="g-3">
                  <Col md={3} xs={6}>
                    <div className="text-center p-2 bg-white rounded border">
                      <small className="text-muted text-uppercase fw-bold modal-editar-prestamo-metric-label">Monto Inicial</small>
                      <div className="fw-bold modal-editar-prestamo-metric-value modal-editar-prestamo-metric-value--green">
                        ${parseFloat(prestamoEditado.montoInicial || 0).toLocaleString()}
                      </div>
                    </div>
                  </Col>
                  <Col md={3} xs={6}>
                    <div className="text-center p-2 bg-white rounded border">
                      <small className="text-muted text-uppercase fw-bold modal-editar-prestamo-metric-label">Monto Total</small>
                      <div className="fw-bold modal-editar-prestamo-metric-value modal-editar-prestamo-metric-value--red">
                        $
                        {
                          usarCuotaPersonalizada && montoCuotaPersonalizada
                            ? (
                              parseFloat(montoCuotaPersonalizada) *
                              parseInt(prestamoEditado.cantidadCuotas)
                            ).toLocaleString()
                            : (
                              parseFloat(prestamoEditado.montoInicial || 0) *
                              (1 + parseFloat(prestamoEditado.interes || 0) / 100)
                            ).toLocaleString()}
                      </div>
                    </div>
                  </Col>
                  <Col md={3} xs={6}>
                    <div className="text-center p-2 bg-white rounded border">
                      <small className="text-muted text-uppercase fw-bold modal-editar-prestamo-metric-label">Cuotas</small>
                      <div className="fw-bold modal-editar-prestamo-metric-value modal-editar-prestamo-metric-value--blue">
                        {prestamoEditado.cantidadCuotas}
                      </div>
                    </div>
                  </Col>
                  <Col md={3} xs={6}>
                    <div className="text-center p-2 bg-white rounded border">
                      <small className="text-muted text-uppercase fw-bold modal-editar-prestamo-metric-label">Frecuencia</small>
                      <div className="fw-bold text-capitalize modal-editar-prestamo-metric-value modal-editar-prestamo-metric-value--orange">
                        {obtenerFrecuenciaTexto(prestamoEditado.frecuencia)}
                      </div>
                    </div>
                  </Col>
                </Row>
                <div className="mt-3 text-center p-2 rounded modal-editar-prestamo-cuota-info">
                  {usarCuotaPersonalizada && montoCuotaPersonalizada ? (
                    <div className="d-flex justify-content-center gap-4 flex-wrap">
                      <span><strong className="modal-editar-prestamo-cuota-value">Valor Cuota:</strong> ${parseFloat(montoCuotaPersonalizada).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      <span><small className="modal-editar-prestamo-cuota-interest">Interés equivalente: {(((parseFloat(montoCuotaPersonalizada) * parseInt(prestamoEditado.cantidadCuotas) - parseFloat(prestamoEditado.montoInicial)) / parseFloat(prestamoEditado.montoInicial)) * 100).toFixed(2)}%</small></span>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-center gap-4 flex-wrap">
                      <span><strong className="modal-editar-prestamo-cuota-value">Valor Cuota:</strong> ${((parseFloat(prestamoEditado.montoInicial) * (1 + parseFloat(prestamoEditado.interes) / 100)) / parseFloat(prestamoEditado.cantidadCuotas)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <LoadingButton
          variant="secondary"
          onClick={onHide}
          loading={false}
          disabled={submitting}
        >
          <i className="bi bi-x-circle me-2"></i>
          Cancelar
        </LoadingButton>
        <LoadingButton
          variant="success"
          type="submit"
          onClick={onSubmit}
          loading={submitting}
        >
          <i className="bi bi-check-circle me-2"></i>
          Guardar Cambios
        </LoadingButton>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalEditarPrestamo;
