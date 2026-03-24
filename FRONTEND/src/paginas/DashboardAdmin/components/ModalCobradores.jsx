import { Modal, Button, Form, Spinner, Dropdown, InputGroup, Row, Col } from "react-bootstrap"
import { IconUsers, IconPlus, IconEye, IconEyeOff } from "@tabler/icons-react"
import { useState, useEffect } from "react"
import "./ModalCobradores.css"
import useCobradores from "../../../hooks/useCobradores"
import CobradorItem from "./CobradorItem"
const ModalCobradores = ({ show, onHide, onCobradorActualizado }) => {
  const {
    cobradores,
    zonas,
    loading,
    savingCrear,
    savingActualizar,
    showAddModal,
    showEditModal,
    nuevoCobrador,
    cobradorEditado,
    fetchCobradores,
    fetchZonas,
    abrirModalCrear,
    cerrarModalCrear,
    handleInputChange,
    onSubmitCrear,
    abrirModalEdicion,
    cerrarModalEdicion,
    handleEditInputChange,
    onSubmitEditar,
    eliminarCobrador
  } = useCobradores(onCobradorActualizado)
  const [busqueda, setBusqueda] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showEditPassword, setShowEditPassword] = useState(false)
  const [showEditConfirmPassword, setShowEditConfirmPassword] = useState(false)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  useEffect(() => {
    if (show) {
      fetchZonas()
      fetchCobradores()
    }
  }, [show])
  const cobradoresFiltrados = cobradores.filter(cobrador =>
    cobrador.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (cobrador.usuarioLogin && cobrador.usuarioLogin.toLowerCase().includes(busqueda.toLowerCase())) ||
    (cobrador.zonaACargo?.nombre && cobrador.zonaACargo.nombre.toLowerCase().includes(busqueda.toLowerCase()))
  )
  return (
    <>
      <Modal show={show} onHide={onHide} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            <IconUsers className="me-2" />
            Gestión de Cobradores
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-cobradores-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Form.Control
              type="text"
              placeholder="Buscar cobrador por nombre, usuario o zona..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-50"
            />
            {isMobile ? (
              <Button
                variant="success"
                onClick={abrirModalCrear}
                className="d-flex align-items-center justify-content-center btn-create-cobrador btn-cobrador-mobile"
                title="Añadir Cobrador"
              >
                <IconPlus size={16} />
              </Button>
            ) : (
              <Button variant="success" onClick={abrirModalCrear} className="d-flex align-items-center btn-create-cobrador">
                <IconPlus size={16} className="me-2" />
                Añadir Cobrador
              </Button>
            )}
          </div>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
              <p className="mt-2">Cargando cobradores...</p>
            </div>
          ) : cobradoresFiltrados.length === 0 ? (
            <div className="empty-state">
              <IconUsers size={48} className="empty-icon" />
              <h5>No se encontraron cobradores</h5>
              <p>
                {busqueda ? "No hay resultados para tu búsqueda" : "No hay cobradores registrados"}
              </p>
            </div>
          ) : (
            <div className="cobradores-list">
              {cobradoresFiltrados.map((cobrador) => (
                <CobradorItem
                  key={cobrador._id}
                  cobrador={cobrador}
                  onEditar={abrirModalEdicion}
                  onEliminar={eliminarCobrador}
                />
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      {}
      <Modal show={showAddModal} onHide={cerrarModalCrear} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Añadir Nuevo Cobrador</Modal.Title>
        </Modal.Header>
        <Form onSubmit={onSubmitCrear}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={nuevoCobrador.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Usuario de Login *</Form.Label>
                  <Form.Control
                    type="text"
                    name="usuarioLogin"
                    value={nuevoCobrador.usuarioLogin}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="tel"
                    name="telefono"
                    value={nuevoCobrador.telefono}
                    onChange={handleInputChange}
                    placeholder="Ingrese el teléfono del cobrador"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña *</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="contraseña"
                      value={nuevoCobrador.contraseña}
                      onChange={handleInputChange}
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      className="btn-password-toggle"
                    >
                      {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                    </Button>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirmar Contraseña *</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmarContraseña"
                      value={nuevoCobrador.confirmarContraseña}
                      onChange={handleInputChange}
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="btn-password-toggle"
                    >
                      {showConfirmPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Zonas Asignadas</Form.Label>
                  <Form.Select
                    name="zonaACargo"
                    value={nuevoCobrador.zonaACargo}
                    onChange={handleInputChange}
                    multiple
                    className="select-zonas-multiple"
                  >
                    {zonas.map((zona) => (
                      <option key={zona._id} value={zona._id.toString()}>
                        {zona.nombre}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Mantén presionado Ctrl (Cmd en Mac) para seleccionar múltiples zonas
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cerrarModalCrear}>
              Cancelar
            </Button>
            <Button variant="success" type="submit" disabled={savingCrear} className="btn-create-cobrador">
              {savingCrear ? <Spinner animation="border" size="sm" className="me-2" /> : null}
              Crear Cobrador
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {}
      <Modal show={showEditModal} onHide={cerrarModalEdicion} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Cobrador</Modal.Title>
        </Modal.Header>
        <Form onSubmit={onSubmitEditar}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={cobradorEditado.nombre}
                    onChange={handleEditInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Usuario de Login *</Form.Label>
                  <Form.Control
                    type="text"
                    name="usuarioLogin"
                    value={cobradorEditado.usuarioLogin}
                    onChange={handleEditInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="telefono"
                    value={cobradorEditado.telefono}
                    onChange={handleEditInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Nueva Contraseña (dejar en blanco para mantener actual)</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showEditPassword ? "text" : "password"}
                      name="contraseña"
                      value={cobradorEditado.contraseña}
                      onChange={handleEditInputChange}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="btn-password-toggle"
                    >
                      {showEditPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                    </Button>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirmar Contraseña</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showEditConfirmPassword ? "text" : "password"}
                      name="confirmarContraseña"
                      value={cobradorEditado.confirmarContraseña}
                      onChange={handleEditInputChange}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowEditConfirmPassword(!showEditConfirmPassword)}
                      className="btn-password-toggle"
                    >
                      {showEditConfirmPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Zonas Asignadas</Form.Label>
                  <Form.Select
                    name="zonaACargo"
                    value={cobradorEditado.zonaACargo}
                    onChange={handleEditInputChange}
                    multiple
                    className="select-zonas-multiple"
                  >
                    {zonas.map((zona) => (
                      <option key={zona._id} value={zona._id.toString()}>
                        {zona.nombre}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Mantén presionado Ctrl (Cmd en Mac) para seleccionar múltiples zonas
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cerrarModalEdicion}>
              Cancelar
            </Button>
            <Button variant="success" type="submit" disabled={savingActualizar}>
              {savingActualizar ? <Spinner animation="border" size="sm" className="me-2" /> : null}
              Actualizar Cobrador
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}
export default ModalCobradores
