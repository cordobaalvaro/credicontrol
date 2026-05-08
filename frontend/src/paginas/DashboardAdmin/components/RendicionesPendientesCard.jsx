"use client"
import { Card, Button, Badge } from "react-bootstrap"
import { IconBell, IconChevronRight, IconChecklist } from "@tabler/icons-react"
import { useNavigate } from "react-router-dom"
import "../DashboardAdmin.css"

const RendicionesPendientesCard = ({ count }) => {
  const navigate = useNavigate()

  if (count === 0) return null

  return (
    <Card className="border-0 shadow-sm mb-4 bg-primary text-white">
      <Card.Body className="p-4">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div className="me-3 bg-white bg-opacity-20 p-2 rounded-circle">
              <IconBell size={24} />
            </div>
            <div>
              <h5 className="mb-0 fw-bold">Rendiciones Diarias Pendientes</h5>
              <p className="mb-0 opacity-75">Hay {count} reportes diarios de cobradores esperando ser procesados.</p>
            </div>
          </div>
          <Button 
            variant="light" 
            className="d-flex align-items-center fw-semibold text-primary"
            onClick={() => navigate("/tablas-semanales-clientes")}
          >
            Ver Tablas
            <IconChevronRight size={18} className="ms-1" />
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}

export default RendicionesPendientesCard
