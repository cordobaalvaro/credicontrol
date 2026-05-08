import React, { useState } from "react";
import { Table, Button, Badge, Spinner } from "react-bootstrap";
import { IconCheck, IconClock, IconUser, IconCalendar, IconEye } from "@tabler/icons-react";
import ModalDetalleRendicion from "../modales/ModalDetalleRendicion";
import "./TablaSemanalRendiciones.css";

const TablaSemanalRendiciones = ({ rendiciones, onCargarRendicion, modoCobrador, saving }) => {
  const [showModal, setShowModal] = useState(false);
  const [rendicionSeleccionada, setRendicionSeleccionada] = useState(null);

  if (!rendiciones || rendiciones.length === 0) return null;

  const handleVerDetalle = (rend) => {
    setRendicionSeleccionada(rend);
    setShowModal(true);
  };

  return (
    <div className="tabla-semanal-rendiciones mt-4">
      <h6 className="section-title d-flex align-items-center gap-2 mb-3">
        <IconClock size={18} />
        Historial de Rendiciones (Cobros Diarios)
      </h6>
      
      <div className="table-responsive">
        <Table hover className="rendiciones-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cobros</th>
              <th>Monto Total</th>
              <th>Estado</th>
              <th className="text-center">Detalle</th>
              {!modoCobrador && <th>Administración</th>}
            </tr>
          </thead>
          <tbody>
            {rendiciones.map((rendicion, index) => {
              const totalMonto = rendicion.items.reduce((sum, it) => sum + (it.montoCobrado || 0), 0);
              const isCargada = rendicion.estado === "cargada";

              return (
                <tr key={rendicion._id || index}>
                  <td>
                    <div className="d-flex flex-column">
                      <span className="date-main">
                        {new Date(rendicion.fechaRendicion).toLocaleDateString("es-AR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric"
                        })}
                      </span>
                      <small className="text-muted">
                        {new Date(rendicion.fechaRendicion).toLocaleTimeString("es-AR", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })} hs
                      </small>
                    </div>
                  </td>
                  <td>
                    <Badge bg="info" className="rounded-pill px-2">
                      {rendicion.items.length} items
                    </Badge>
                  </td>
                  <td className="fw-bold text-success">
                    ${totalMonto.toLocaleString("es-AR")}
                  </td>
                  <td>
                    {isCargada ? (
                      <div className="d-flex flex-column">
                        <Badge bg="success" className="d-flex align-items-center gap-1 w-fit">
                          <IconCheck size={12} /> Cargada
                        </Badge>
                        <small className="text-muted mt-1 d-flex align-items-center gap-1">
                          <IconUser size={10} /> {rendicion.cargadoPor?.nombre || "Admin"}
                        </small>
                      </div>
                    ) : (
                      <Badge bg="warning" className="d-flex align-items-center gap-1 w-fit text-dark">
                        <IconClock size={12} /> Pendiente
                      </Badge>
                    )}
                  </td>
                  <td className="text-center">
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => handleVerDetalle(rendicion)}
                      className="rounded-circle p-1"
                      title="Ver detalle de cobros"
                    >
                      <IconEye size={18} />
                    </Button>
                  </td>
                  {!modoCobrador && (
                    <td>
                      {!isCargada && (
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => onCargarRendicion(rendicion._id)}
                          disabled={saving}
                          className="d-flex align-items-center gap-1"
                        >
                          {saving ? <Spinner animation="border" size="sm" /> : <IconCheck size={14} />}
                          Cargar cobros
                        </Button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      <ModalDetalleRendicion 
        show={showModal}
        onHide={() => setShowModal(false)}
        rendicion={rendicionSeleccionada}
      />
    </div>
  );
};

export default TablaSemanalRendiciones;
