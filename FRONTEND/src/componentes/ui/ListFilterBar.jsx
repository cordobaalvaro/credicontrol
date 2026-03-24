"use client"
import { Card, Row, Col, InputGroup, Form, ButtonGroup, Button } from "react-bootstrap"
import "./ListFilterBar.css"
const ListFilterBar = ({
  busqueda,
  onBusquedaChange,
  filtroZona,
  onFiltroZonaChange,
  filtroEstado,
  onFiltroEstadoChange,
  stats,
  placeholder = "Buscar por nombre, DNI, teléfono, barrio, ciudad o zona...",
  showZonaFilters = true,
  estadoOptions,
  bottomContent,
}) => {
  return (
    <Card className="filter-card mb-4">
      <Card.Body className="p-3 p-md-4">
        <Row className="align-items-center g-3">
          <Col xl={6}>
            <InputGroup className="search-input">
              <InputGroup.Text className="search-icon-wrapper">
                <i className="bi bi-search"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder={placeholder}
                value={busqueda}
                onChange={onBusquedaChange}
                className="search-input-field"
              />
            </InputGroup>
          </Col>
          <Col xl={6}>
            <div className="d-flex flex-column flex-xl-row justify-content-xl-end align-items-stretch gap-2 flex-wrap w-100">
              {showZonaFilters && (
                <ButtonGroup className="filter-btn-group">
                  <Button
                    variant={filtroZona === "todos" ? "success" : "outline-success"}
                    onClick={() => onFiltroZonaChange("todos")}
                    className="filter-btn"
                  >
                    <i className="bi bi-list me-2"></i>Todos ({stats?.total || 0})
                  </Button>
                  <Button
                    variant={filtroZona === "conZona" ? "success" : "outline-success"}
                    onClick={() => onFiltroZonaChange("conZona")}
                    className="filter-btn"
                  >
                    <i className="bi bi-geo-alt me-2"></i>Con Zona ({stats?.conZona || 0})
                  </Button>
                  <Button
                    variant={filtroZona === "sinZona" ? "success" : "outline-success"}
                    onClick={() => onFiltroZonaChange("sinZona")}
                    className="filter-btn"
                  >
                    <i className="bi bi-exclamation-triangle me-2"></i>Sin Zona ({stats?.sinZona || 0})
                  </Button>
                </ButtonGroup>
              )}
              {typeof onFiltroEstadoChange === "function" && typeof filtroEstado !== "undefined" && (
                <ButtonGroup className="filter-btn-group">
                  {(estadoOptions && estadoOptions.length
                    ? estadoOptions
                    : [
                        { value: "todos", label: "Estado: Todos" },
                        { value: "activo", label: "Activos" },
                        { value: "inactivo", label: "Inactivos" },
                      ]
                  ).map((opt) => (
                    <Button
                      key={opt.value}
                      variant={filtroEstado === opt.value ? "success" : "outline-success"}
                      onClick={() => onFiltroEstadoChange({ target: { value: opt.value } })}
                      className="filter-btn"
                    >
                      {opt.label}
                    </Button>
                  ))}
                </ButtonGroup>
              )}
            </div>
          </Col>
        </Row>
        {bottomContent && <div className="mt-3">{bottomContent}</div>}
      </Card.Body>
    </Card>
  )
}
export default ListFilterBar
