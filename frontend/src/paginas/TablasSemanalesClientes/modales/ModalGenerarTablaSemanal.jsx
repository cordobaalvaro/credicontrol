"use client"
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap"
import useModalGenerarTablaSemanal from "../../../hooks/useModalGenerarTablaSemanal"
const ModalGenerarTablaSemanal = ({ show, onHide, onTablaCreada }) => {
  const {
    cobradores,
    cobradorId,
    setCobradorId,
    zonas,
    zonaId,
    setZonaId,
    fechaInicio,
    fechaFin,
    loadingCobradores,
    loadingZonas,
    saving,
    error,
    handleClose,
    handleFechaInicioChange,
    tipoCuotas,
    setTipoCuotas,
    tipoZona,
    setTipoZona,
    esperadoModo,
    setEsperadoModo,
    montoEsperadoManual,
    setMontoEsperadoManual,
    previewData,
    loadingPreview,
    previewError,
    handleSubmit
  } = useModalGenerarTablaSemanal({ show, onHide, onTablaCreada })

  const isFieldsComplete = cobradorId && fechaInicio && (tipoZona === "todas" || zonaId);

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fw-bold">Generar tabla semanal</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="row">
            <div className="col-md-6 mb-4">
              <Form.Label className="fw-bold text-muted small text-uppercase mb-2">1. Cobrador</Form.Label>
              <Form.Select
                value={cobradorId}
                onChange={(e) => setCobradorId(e.target.value)}
                disabled={loadingCobradores || saving}
                className="form-select-lg"
              >
                <option value="">Selecciona un cobrador</option>
                {cobradores.map((cobrador) => (
                  <option key={cobrador._id} value={cobrador._id}>
                    {cobrador.nombre || cobrador.email}
                  </option>
                ))}
              </Form.Select>
            </div>

            <div className="col-md-6 mb-4">
              <Form.Label className="fw-bold text-muted small text-uppercase mb-2">2. Ámbito de Zonas</Form.Label>
              <div className="d-flex flex-column flex-sm-row gap-3 mt-1">
                <Form.Check
                  type="radio"
                  label="Todas las zonas"
                  name="tipoZona"
                  id="zona-todas"
                  checked={tipoZona === "todas"}
                  onChange={() => setTipoZona("todas")}
                  disabled={saving}
                />
                <Form.Check
                  type="radio"
                  label="Zona específica"
                  name="tipoZona"
                  id="zona-especifica"
                  checked={tipoZona === "especifica"}
                  onChange={() => setTipoZona("especifica")}
                  disabled={saving}
                />
              </div>
              
              {tipoZona === "especifica" && (
                <div className="mt-3">
                  <Form.Select
                    value={zonaId}
                    onChange={(e) => setZonaId(e.target.value)}
                    disabled={!cobradorId || loadingZonas || saving}
                  >
                    <option value="">Selecciona una zona</option>
                    {zonas.map((zona) => (
                      <option key={zona._id} value={zona._id}>
                        {zona.nombre}
                      </option>
                    ))}
                  </Form.Select>
                  {!cobradorId && <div className="text-muted small mt-1">Primero selecciona un cobrador.</div>}
                </div>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-4">
              <Form.Label className="fw-bold text-muted small text-uppercase mb-2">3. Período (Lunes a Domingo)</Form.Label>
              <div className="d-flex flex-column flex-sm-row gap-2">
                <Form.Control
                  type="date"
                  value={fechaInicio}
                  onChange={handleFechaInicioChange}
                  disabled={saving}
                />
                <Form.Control
                  type="date"
                  value={fechaFin}
                  disabled={true}
                  className="bg-light"
                />
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <Form.Label className="fw-bold text-muted small text-uppercase mb-2">4. Contenido de cuotas</Form.Label>
              <div className="d-flex flex-column gap-2">
                <Form.Check
                  type="radio"
                  label="Traer todas las pendientes"
                  name="tipoCuotas"
                  id="cuotas-todas"
                  checked={tipoCuotas === "todas"}
                  onChange={() => setTipoCuotas("todas")}
                  disabled={saving}
                />
                <Form.Check
                  type="radio"
                  label="Solo cuotas de esta semana"
                  name="tipoCuotas"
                  id="cuotas-semana"
                  checked={tipoCuotas === "semana"}
                  onChange={() => setTipoCuotas("semana")}
                  disabled={saving}
                />
              </div>
            </div>
          </div>

          <hr className="my-4" />

          {/* Sección de Previsualización y Esperado */}
          <div className={`p-4 rounded-3 border ${!isFieldsComplete ? 'bg-light text-muted' : 'bg-white'}`}>
            <Form.Label className="fw-bold text-muted small text-uppercase mb-3 d-flex align-items-center">
              5. Ajuste del Monto Esperado
              {!isFieldsComplete && <span className="ms-2 badge bg-secondary-subtle text-secondary small">Completa los pasos anteriores</span>}
            </Form.Label>

            {loadingPreview ? (
              <div className="text-center py-3">
                <Spinner animation="border" size="sm" className="me-2 text-primary" />
                <span className="small">Calculando esperado según filtros...</span>
              </div>
            ) : previewData ? (
              <div className="animate__animated animate__fadeIn">
                <div className="alert alert-info border-0 shadow-sm d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
                  <div>
                    <div className="small opacity-75">Esperado calculado (Activos):</div>
                    <div className="h4 fw-bold mb-0">
                      ${previewData.montoTotalEsperadoActivos?.toLocaleString('es-AR')}
                    </div>
                    <div className="small mt-1">
                      <i className="bi bi-info-circle me-1"></i>
                      Calculado sobre {previewData.cantidadItems} préstamos.
                    </div>
                  </div>
                  <div className="text-sm-end border-top border-info border-opacity-10 pt-2 pt-sm-0 mt-sm-0">
                    <div className="small opacity-75">Total (inc. Vencidos):</div>
                    <div className="h5 fw-bold mb-0">${previewData.montoTotalEsperado?.toLocaleString('es-AR')}</div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="d-flex flex-column flex-sm-row gap-3 gap-sm-4 mb-3">
                    <Form.Check
                      type="radio"
                      label={<strong>Usar esperado automático</strong>}
                      name="esperadoModo"
                      id="esperado-auto"
                      checked={esperadoModo === "automatico"}
                      onChange={() => setEsperadoModo("automatico")}
                      disabled={saving}
                    />
                    <Form.Check
                      type="radio"
                      label={<strong>Establecer esperado manual</strong>}
                      name="esperadoModo"
                      id="esperado-manual"
                      checked={esperadoModo === "manual"}
                      onChange={() => setEsperadoModo("manual")}
                      disabled={saving}
                    />
                  </div>

                  {esperadoModo === "manual" && (
                    <div className="p-3 bg-light rounded border animate__animated animate__slideInDown">
                      <Form.Label className="small fw-bold">Monto esperado manual para activos:</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Ingresa el monto..."
                        value={montoEsperadoManual}
                        onChange={(e) => setMontoEsperadoManual(e.target.value)}
                        disabled={saving}
                        className="form-control-lg"
                        autoFocus
                      />
                      <div className="text-muted small mt-2">
                        Este valor reemplazará los ${previewData.montoTotalEsperadoActivos?.toLocaleString('es-AR')} calculados.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : !isFieldsComplete ? (
              <div className="text-center py-3 opacity-50">
                <i className="bi bi-calculator h3 d-block mb-2"></i>
                <span className="small">Los totales se calcularán automáticamente al completar los campos.</span>
              </div>
            ) : (
              <div className="text-center py-3 text-warning small animate__animated animate__shakeX">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {previewError || "No se pudieron obtener los totales. Verifica la selección."}
              </div>
            )}
          </div>

          {error && <Alert variant="danger" className="mt-4 py-2 small shadow-sm">{error}</Alert>}
        </Modal.Body>
        <Modal.Footer className="bg-light border-top-0 px-4 pb-4">
          <Button variant="outline-secondary" onClick={handleClose} disabled={saving} className="px-4">
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={saving || !isFieldsComplete || (esperadoModo === "manual" && !montoEsperadoManual)}
            className="px-5 shadow-sm"
          >
            {saving ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            Generar Tabla Semanal
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
export default ModalGenerarTablaSemanal
