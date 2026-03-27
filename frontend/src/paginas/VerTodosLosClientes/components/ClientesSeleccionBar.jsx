"use client"
import { Card, Row, Col, Form, Button } from "react-bootstrap"
const ClientesSeleccionBar = ({
  totalFiltrados,
  seleccionarTodosChecked,
  onSeleccionarTodos,
  seleccionadosCount,
  onEliminarSeleccionados,
}) => {
  if (totalFiltrados <= 0 || seleccionadosCount === 0) return null
  return (
    <Card className="clientes-seleccion-bar">
      <Card.Body>
        <Row className="align-items-center">
          <Col md={6}>
            <div className="selection-controls">
              <div className="selection-checkbox-section">
                <Form.Check
                  type="checkbox"
                  className="cliente-checkbox"
                  checked={seleccionarTodosChecked}
                  onChange={onSeleccionarTodos}
                  label="Seleccionar todos"
                />
              </div>
              <div className="selection-count">
                {seleccionadosCount} de {totalFiltrados} seleccionados
              </div>
            </div>
          </Col>
          <Col md={6}>
            {seleccionadosCount > 0 && (
              <div className="bulk-actions">
                <Button variant="danger" onClick={onEliminarSeleccionados} className="btn-bulk btn-bulk-delete">
                  <i className="bi bi-trash me-2"></i>
                  Eliminar {seleccionadosCount}
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}
export default ClientesSeleccionBar
