import { Row, Col, Form } from "react-bootstrap";
const FormNuevoPrestamoConfiguracionFrecuencia = ({
    nuevoPrestamo,
    onChange,
    usarPlan,
    toggleUsarPlan,
    loadingPlanes,
    usarCuotaPersonalizada,
    toggleModoCuota,
    errores,
}) => {
    return (
        <>
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
                            value={nuevoPrestamo.frecuencia}
                            onChange={onChange}
                            required
                            isInvalid={!!errores.frecuencia}
                            disabled={usarPlan}
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
                        <Form.Label className="mb-1 d-block fw-bold form-nuevo-prestamo-switch-label">
                            <i className="bi bi-diagram-3 me-2"></i>
                            ¿Usar Plan Predefinido?
                        </Form.Label>
                        <Form.Check
                            type="switch"
                            id="modo-plan-switch"
                            checked={!!usarPlan}
                            onChange={toggleUsarPlan}
                            label={usarPlan ? "Sí, tabla de planes" : "No, personalizado"}
                            disabled={loadingPlanes}
                        />
                    </Form.Group>
                </Col>
                <Col md={4} sm={6}>
                    <Form.Group className="mb-3 p-2 border rounded bg-light">
                        <Form.Label className="mb-1 d-block fw-bold form-nuevo-prestamo-switch-label">
                            <i className="bi bi-calculator me-2"></i>
                            Modo de Cálculo
                        </Form.Label>
                        <Form.Check
                            type="switch"
                            id="modo-cuota-switch"
                            checked={usarCuotaPersonalizada}
                            onChange={toggleModoCuota}
                            label={usarCuotaPersonalizada ? "Fijar Cuota" : "Interés Auto"}
                            disabled={usarPlan}
                        />
                    </Form.Group>
                </Col>
            </Row>
        </>
    );
};
export default FormNuevoPrestamoConfiguracionFrecuencia;
