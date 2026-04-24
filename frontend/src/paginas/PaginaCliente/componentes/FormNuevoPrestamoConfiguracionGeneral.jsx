import { Row, Col, Form } from "react-bootstrap";
const FormNuevoPrestamoConfiguracionGeneral = ({
    nuevoPrestamo,
    onChange,
    errores,
}) => {
    return (
        <>
            <h6 className="text-secondary mb-3 border-bottom pb-2">
                <i className="bi bi-file-earmark-text me-2"></i>
                Configuración General
            </h6>
            <Row>
                <Col md={4} sm={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            <i className="bi bi-currency-dollar me-2"></i>
                            Nombre *
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            value={nuevoPrestamo.nombre}
                            onChange={onChange}
                            placeholder="Ej. Préstamo personal"
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
                <Col md={4} sm={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            <i className="bi bi-tag me-2"></i>
                            Tipo de Préstamo *
                        </Form.Label>
                        <Form.Select
                            name="tipo"
                            value={nuevoPrestamo.tipo || "nuevo"}
                            onChange={onChange}
                            required
                        >
                            <option value="nuevo">Nuevo</option>
                            <option value="refinanciado">Refinanciado</option>
                        </Form.Select>
                        <Form.Text className="text-muted form-nuevo-prestamo-help-text">
                            Los refinanciados no se suman como nuevo dinero prestado en el dashboard.
                        </Form.Text>
                    </Form.Group>
                </Col>
                <Col md={4} sm={12}>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            <i className="bi bi-calendar-event me-2"></i>
                            Fecha de Inicio *
                        </Form.Label>
                        <Form.Control
                            type="date"
                            name="fechaInicio"
                            value={nuevoPrestamo.fechaInicio}
                            onChange={onChange}
                            required
                            isInvalid={!!errores.fechaInicio}
                        />
                        {errores.fechaInicio && (
                            <Form.Control.Feedback type="invalid">
                                {errores.fechaInicio}
                            </Form.Control.Feedback>
                        )}
                    </Form.Group>
                </Col>
            </Row>
        </>
    );
};
export default FormNuevoPrestamoConfiguracionGeneral;
