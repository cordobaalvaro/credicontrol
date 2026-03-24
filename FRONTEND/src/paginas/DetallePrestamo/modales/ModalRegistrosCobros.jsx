import { Modal, Button } from "react-bootstrap";
import { useAuth } from "../../../context/AuthContext";
import "./ModalRegistrosCobros.css";
const fmtMoney = (n) =>
  `$${Number(n || 0).toLocaleString("es-AR", { maximumFractionDigits: 0 })}`;
const fmtFecha = (fechaStr) => {
  if (!fechaStr) return "Sin fecha";
  
  
  if (fechaStr.includes("T")) {
    const d = new Date(fechaStr);
    const day = d.getDate();
    const month = d.getMonth(); 
    const year = d.getFullYear();
    const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    return `${day} ${meses[month]} ${year}`;
  }
  
  const [year, month, day] = fechaStr.split("-");
  if (!year || !month || !day) return fechaStr;
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${parseInt(day)} ${meses[parseInt(month) - 1]} ${year}`;
};
const ModalRegistrosCobros = ({
  show,
  onHide,
  registros,
  prestamo,
  abrirModalCrear,
  onEditar,
  onEliminar,
}) => {
  const { user } = useAuth();
  const puedeGestionar = user?.rol === "admin";
  const totalCobrado = (registros || []).reduce(
    (sum, reg) => sum + (reg.monto || 0),
    0
  );
  const progreso = prestamo?.montoTotal
    ? Math.min(100, Math.round((totalCobrado / prestamo.montoTotal) * 100))
    : 0;
  const progresoClass = progreso >= 100 ? "progreso-completado" : "progreso-text";
  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="modal-registros-cobros">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="d-flex align-items-center gap-2 fs-5 fw-bold">
          <i className="bi bi-journal-text text-success" />
          Registros de Cobros
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-2">
        {registros && registros.length > 0 && (
          <div className="registros-stats-bar rounded-3 mb-4 p-2 p-md-3 d-flex flex-row align-items-center text-center">
            {}
            <div className="flex-fill registros-stat-item">
              <div className="stat-label">Registros</div>
              <div className="stat-value fs-4 text-primary">{registros.length}</div>
            </div>
            <div className="registros-divider" />
            {}
            <div className="flex-fill px-1 registros-stat-item">
              <div className="stat-label">Total cobrado</div>
              <div className="stat-value fs-5 text-success">{fmtMoney(totalCobrado)}</div>
            </div>
            <div className="registros-divider" />
            {}
            <div className="flex-fill d-none d-sm-block registros-stat-item">
              <div className="stat-label">Progreso</div>
              <div className={`stat-value fs-4 ${progresoClass}`}>
                {progreso}%
              </div>
            </div>
            <div className="flex-fill d-sm-none registros-stat-item">
              <div className="stat-label">%</div>
              <div className={`stat-value fs-5 ${progresoClass}`}>
                {progreso}
              </div>
            </div>
          </div>
        )}
        {(!registros || registros.length === 0) && (
          <div className="text-center py-5 px-3">
            <i className="bi bi-inbox empty-state-icon" />
            <p className="text-muted mt-3 mb-1 fw-semibold">Sin registros de cobros</p>
            <small className="text-muted">
              Los pagos aparecerán aquí cuando se realicen cobros
            </small>
          </div>
        )}
        {registros && registros.length > 0 && (
          <div className="d-flex flex-column gap-2">
            {registros.map((registro, index) => (
              <div
                key={index}
                className="registro-list-item d-flex align-items-center rounded-3 p-2 p-md-3"
              >
                {}
                <div className="registro-numero-badge d-none d-sm-flex">
                  {index + 1}
                </div>
                {}
                <div className="flex-fill overflow-hidden text-truncate">
                  <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-0 gap-sm-3">
                    <span className="registro-monto">
                      {fmtMoney(registro.monto)}
                    </span>
                    <div className="d-flex align-items-center gap-1 registro-meta">
                      <i className="bi bi-calendar3" />
                      <span>{fmtFecha(registro.fechaPago)}</span>
                    </div>
                  </div>
                  {registro.registroCompleto?.createdAt && (
                    <div className="registro-id-timestamp d-none d-md-block">
                      ID: #{index + 1} â€¢ {new Date(registro.registroCompleto.createdAt).toLocaleString("es-AR")}
                    </div>
                  )}
                </div>
                {}
                {puedeGestionar && (
                  <div className="d-flex gap-1 flex-shrink-0">
                    <button
                      className="btn-action-minimal edit"
                      title="Editar"
                      onClick={() => onEditar(registro.registroCompleto)}
                    >
                      <i className="bi bi-pencil-square" />
                    </button>
                    <button
                      className="btn-action-minimal delete"
                      title="Eliminar"
                      onClick={() =>
                        onEliminar(prestamo._id, registro.registroCompleto._id)
                      }
                    >
                      <i className="bi bi-trash3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Modal.Body>
      {puedeGestionar && (
        <Modal.Footer className="border-0 pt-0 flex-column flex-sm-row gap-2">
          <Button
            variant="success"
            onClick={abrirModalCrear}
            className="d-flex align-items-center justify-content-center gap-2 w-100 w-sm-auto"
          >
            <i className="bi bi-plus-circle" />
            Nuevo Registro
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};
export default ModalRegistrosCobros;
