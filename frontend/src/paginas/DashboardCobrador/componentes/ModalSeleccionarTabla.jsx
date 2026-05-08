"use client"
import { useState, useEffect } from "react"
import { Modal, Button, Form, Table, Badge, Spinner, Row, Col } from "react-bootstrap"
import { IconCalendar, IconSearch, IconCheck, IconAlertCircle } from "@tabler/icons-react"
import { tablaSemanalService } from "../../../services"

const ModalSeleccionarTabla = ({ show, onHide, onSelect, currentTablaId }) => {
  const [tablas, setTablas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Filtros
  const [mes, setMes] = useState(new Date().toISOString().substring(0, 7)) // YYYY-MM
  const [busqueda, setBusqueda] = useState("")

  const fetchTablas = async () => {
    try {
      setLoading(true)
      setError(null)
      // Usamos el servicio existente para traer las tablas del cobrador
      const response = await tablaSemanalService.getMisTablas({ 
        mes, 
        busqueda 
      })
      if (response && response.data) {
        setTablas(response.data)
      } else {
        setError(response?.msg || "Error al cargar las tablas")
      }
    } catch (err) {
      setError("Error de conexión al servidor")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (show) {
      fetchTablas()
    }
  }, [show, mes])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchTablas()
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold d-flex align-items-center">
          <IconCalendar size={24} className="me-2 text-primary" />
          Seleccionar Tabla Semanal
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="pt-3">
        <Row className="mb-4 g-2">
          <Col md={4}>
            <Form.Group>
              <Form.Label className="small fw-bold text-muted">Filtrar por Mes</Form.Label>
              <Form.Control 
                type="month" 
                value={mes} 
                onChange={(e) => setMes(e.target.value)}
                className="rounded-pill"
              />
            </Form.Group>
          </Col>
          <Col md={8}>
            <Form.Label className="small fw-bold text-muted">Buscar por nombre o fecha</Form.Label>
            <Form.Group className="d-flex gap-2">
              <Form.Control 
                type="text" 
                placeholder="Ej: Semana 12..." 
                value={busqueda} 
                onChange={(e) => setBusqueda(e.target.value)}
                className="rounded-pill"
              />
              <Button 
                variant="primary" 
                onClick={fetchTablas} 
                className="rounded-circle p-2 d-flex align-items-center justify-content-center"
              >
                <IconSearch size={18} />
              </Button>
            </Form.Group>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Buscando tablas...</p>
          </div>
        ) : error ? (
          <div className="text-center py-5 text-danger">
            <IconAlertCircle size={48} className="mb-2" />
            <p>{error}</p>
            <Button variant="outline-danger" size="sm" onClick={fetchTablas}>Reintentar</Button>
          </div>
        ) : tablas.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <IconCalendar size={48} className="mb-2 opacity-25" />
            <p>No se encontraron tablas para los filtros seleccionados</p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 small text-muted">TABLA</th>
                  <th className="border-0 small text-muted">PERIODO</th>
                  <th className="border-0 small text-muted text-center">ESTADO</th>
                  <th className="border-0 small text-muted text-end">ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {tablas.map((tabla) => (
                  <tr key={tabla._id} className={currentTablaId === tabla._id ? "bg-primary bg-opacity-10" : ""}>
                    <td>
                      <div className="fw-bold">{tabla.nombre || `Tabla #${tabla.numeroTabla || '?'}`}</div>
                      <div className="d-flex flex-column">
                        <small className="text-muted">
                          {tabla.numeroTabla ? `ID: #${tabla.numeroTabla}` : `Semana ${tabla.semana || '?'}`}
                        </small>
                        {tabla.zonas && tabla.zonas.length > 0 && (
                          <small className="text-success fw-medium">
                            Zonas: {tabla.zonas.map(z => z.nombre || z).join(", ")}
                          </small>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="small">
                        {new Date(tabla.fechaInicio).toLocaleDateString()} - {new Date(tabla.fechaFin).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="text-center">
                      <Badge 
                        bg={tabla.estado === "cerrada" ? "secondary" : "success"} 
                        className="rounded-pill"
                      >
                        {tabla.estado.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="text-end">
                      {currentTablaId === tabla._id ? (
                        <Badge bg="primary" className="rounded-pill p-2">
                          <IconCheck size={16} className="me-1" /> Actual
                        </Badge>
                      ) : (
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          className="rounded-pill px-3"
                          onClick={() => onSelect(tabla._id)}
                        >
                          Visualizar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Modal.Body>
      
      <Modal.Footer className="border-0">
        <Button variant="secondary" onClick={onHide} className="rounded-pill px-4">
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalSeleccionarTabla
