import { Row, Col, Form } from "react-bootstrap";
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
const FormNuevoPrestamoDetallesFinancieros = ({
    nuevoPrestamo,
    onChange,
    usarPlan,
    planesTabla,
    loadingPlanes,
    planIndex,
    montoPlanSeleccionado,
    onChangeMontoPlan,
    onChangePlanIndex,
    usarCuotaPersonalizada,
    montoCuotaPersonalizada,
    onChangeCuotaPersonalizada,
    errores,
    tablaPlanesSeleccionada,
    onChangeTablaPlanes,
}) => {
    return (
        <>
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
                        {usarPlan ? (
                            <Form.Select
                                name="montoInicialPlan"
                                value={montoPlanSeleccionado}
                                onChange={onChangeMontoPlan}
                                required
                                isInvalid={!!errores.montoInicial}
                                disabled={loadingPlanes}
                            >
                                <option value="">Seleccione un monto</option>
                                {(planesTabla?.montos || []).map((m, idx) => (
                                    <option key={idx} value={String(m)}>
                                        ${Number(m).toLocaleString()}
                                    </option>
                                ))}
                            </Form.Select>
                        ) : (
                            <Form.Control
                                type="number"
                                name="montoInicial"
                                value={nuevoPrestamo.montoInicial}
                                onChange={onChange}
                                placeholder="Monto a prestar"
                                min="0"
                                step="0.01"
                                required
                                isInvalid={!!errores.montoInicial}
                            />
                        )}
                        {errores.montoInicial && (
                            <Form.Control.Feedback type="invalid">
                                {errores.montoInicial}
                            </Form.Control.Feedback>
                        )}
                    </Form.Group>
                </Col>
                {usarPlan ? (
                    <>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <i className="bi bi-table me-2"></i>
                                    Tabla de Planes
                                </Form.Label>
                                <Form.Select
                                    name="tablaPlanes"
                                    value={tablaPlanesSeleccionada || ""}
                                    onChange={onChangeTablaPlanes}
                                    disabled={loadingPlanes}
                                >
                                    <option value="">Seleccione tabla...</option>
                                    <option value="ACTIVA SEMANAL">Tabla Semanal</option>
                                    <option value="ACTIVA QUINCENAL">Tabla Quincenal</option>
                                    <option value="ACTIVA MENSUAL">Tabla Mensual</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <i className="bi bi-list-check me-2"></i>
                                    Plan
                                </Form.Label>
                                <Form.Select
                                    name="planIndex"
                                    value={String(planIndex)}
                                    onChange={onChangePlanIndex}
                                    disabled={loadingPlanes || !(planesTabla?.planes?.length > 0)}
                                >
                                    {(planesTabla?.planes || []).map((p, idx) => (
                                        <option key={idx} value={String(idx)}>
                                            {p?.nombre || `Plan ${idx + 1}`}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </>
                ) : (
                    <>
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
                                        isInvalid={!!errores.montoCuotaPersonalizada}
                                    />
                                    {errores.montoCuotaPersonalizada && (
                                        <Form.Control.Feedback type="invalid">
                                            {errores.montoCuotaPersonalizada}
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
                                        value={nuevoPrestamo.interes}
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
                                    value={nuevoPrestamo.cantidadCuotas}
                                    onChange={onChange}
                                    placeholder="Total"
                                    min="1"
                                    max="36"
                                    required
                                    isInvalid={!!errores.cantidadCuotas}
                                    readOnly={usarPlan}
                                />
                                {errores.cantidadCuotas && (
                                    <Form.Control.Feedback type="invalid">
                                        {errores.cantidadCuotas}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>
                        </Col>
                    </>
                )}
            </Row>
            {}
            {nuevoPrestamo.montoInicial &&
                nuevoPrestamo.cantidadCuotas &&
                ((usarCuotaPersonalizada && montoCuotaPersonalizada) ||
                    (!usarCuotaPersonalizada && nuevoPrestamo.interes)) && (
                    <div className="mt-3 p-3 shadow-sm form-nuevo-prestamo-resumen">
                        <h6 className="mb-3 form-nuevo-prestamo-resumen-title">
                            <i className="bi bi-calculator me-2"></i>
                            Resumen del Préstamo
                        </h6>
                        <Row className="g-3">
                            <Col md={3} xs={6}>
                                <div className="text-center p-2 bg-white rounded border">
                                    <small className="text-muted text-uppercase fw-bold form-nuevo-prestamo-metric-label">Monto Inicial</small>
                                    <div className="fw-bold form-nuevo-prestamo-metric-value form-nuevo-prestamo-metric-value--green">
                                        ${parseFloat(nuevoPrestamo.montoInicial || 0).toLocaleString()}
                                    </div>
                                </div>
                            </Col>
                            <Col md={3} xs={6}>
                                <div className="text-center p-2 bg-white rounded border">
                                    <small className="text-muted text-uppercase fw-bold form-nuevo-prestamo-metric-label">Monto Total</small>
                                    <div className="fw-bold form-nuevo-prestamo-metric-value form-nuevo-prestamo-metric-value--red">
                                        $
                                        {
                                            usarCuotaPersonalizada && montoCuotaPersonalizada
                                                ? (
                                                    parseFloat(montoCuotaPersonalizada) *
                                                    parseInt(nuevoPrestamo.cantidadCuotas)
                                                ).toLocaleString()
                                                : (
                                                    parseFloat(nuevoPrestamo.montoInicial || 0) *
                                                    (1 + parseFloat(nuevoPrestamo.interes || 0) / 100)
                                                ).toLocaleString()}
                                    </div>
                                </div>
                            </Col>
                            <Col md={3} xs={6}>
                                <div className="text-center p-2 bg-white rounded border">
                                    <small className="text-muted text-uppercase fw-bold form-nuevo-prestamo-metric-label">Cuotas</small>
                                    <div className="fw-bold form-nuevo-prestamo-metric-value form-nuevo-prestamo-metric-value--blue">
                                        {nuevoPrestamo.cantidadCuotas}
                                    </div>
                                </div>
                            </Col>
                            <Col md={3} xs={6}>
                                <div className="text-center p-2 bg-white rounded border">
                                    <small className="text-muted text-uppercase fw-bold form-nuevo-prestamo-metric-label">Frecuencia</small>
                                    <div className="fw-bold text-capitalize form-nuevo-prestamo-metric-value form-nuevo-prestamo-metric-value--orange">
                                        {obtenerFrecuenciaTexto(nuevoPrestamo.frecuencia)}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div className="mt-3 text-center p-2 rounded form-nuevo-prestamo-cuota-info">
                            {usarCuotaPersonalizada && montoCuotaPersonalizada ? (
                                <div className="d-flex justify-content-center gap-4 flex-wrap">
                                    <span><strong className="form-nuevo-prestamo-cuota-value">Valor Cuota:</strong> ${parseFloat(montoCuotaPersonalizada).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    <span><small className="form-nuevo-prestamo-cuota-interest">Interés real: {`${(((parseFloat(montoCuotaPersonalizada) * parseInt(nuevoPrestamo.cantidadCuotas) - parseFloat(nuevoPrestamo.montoInicial)) / parseFloat(nuevoPrestamo.montoInicial)) * 100).toFixed(2)}%`}</small></span>
                                </div>
                            ) : (
                                <div className="d-flex justify-content-center gap-4 flex-wrap">
                                    <span><strong className="form-nuevo-prestamo-cuota-value">Valor Cuota:</strong> ${((parseFloat(nuevoPrestamo.montoInicial) * (1 + parseFloat(nuevoPrestamo.interes) / 100)) / parseFloat(nuevoPrestamo.cantidadCuotas)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
        </>
    );
};
export default FormNuevoPrestamoDetallesFinancieros;
