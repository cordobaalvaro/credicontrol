import { Dropdown } from "react-bootstrap";
import LoadingButton from "../../../componentes/ui/LoadingButton";
import ReporteRegistrosCobros from "../../../componentes/pdf/ReporteRegistrosCobros";
const DetallePrestamoHeaderActions = ({
  prestamo,
  rol,
  deletingPrestamo,
  togglingPrestamo,
  onVerRegistros,
  onEditar,
  onEliminar,
  onDesactivar,
  onActivar,
  prestamoId,
}) => {
  const commonButtonClassName = "detalle-prestamo-btn-common"
  const mobileSquareButtonClassName = "detalle-prestamo-btn-mobile-square"
  return (
    <div className="mt-4">
      {}
      <div className="d-none d-md-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
        {}
        <div className="d-flex align-items-center gap-2">
          <LoadingButton
            variant="outline-secondary"
            onClick={onVerRegistros}
            loading={false}
            className={`d-flex align-items-center ${commonButtonClassName} detalle-prestamo-btn--records`}
          >
            <i className="bi bi-eye me-2 detalle-prestamo-icon"></i>
            Ver Registros
          </LoadingButton>
          <ReporteRegistrosCobros
            prestamoId={prestamoId}
          />
        </div>
        {}
        <div className="d-flex align-items-center gap-2 ms-auto">
          {}
          {rol === "admin" && (
            <LoadingButton
              variant="primary"
              onClick={() => onEditar(prestamo)}
              loading={false}
              className={`d-flex align-items-center ${commonButtonClassName} detalle-prestamo-btn--edit`}
            >
              <i className="bi bi-pencil me-2 detalle-prestamo-icon"></i>
              Editar
            </LoadingButton>
          )}
          {}
          {prestamo &&
            (prestamo.estado === "activo" || prestamo.estado === "vencido") &&
            rol === "admin" && (
              <LoadingButton
                variant="secondary"
                onClick={() => onDesactivar(prestamo._id)}
                loading={togglingPrestamo}
                className={`d-flex align-items-center ${commonButtonClassName} detalle-prestamo-btn--secondary`}
              >
                <i className="bi bi-pause me-2 detalle-prestamo-icon"></i>
                Desactivar
              </LoadingButton>
            )}
          {prestamo && prestamo.estado !== "activo" && rol === "admin" && (
            <LoadingButton
              variant="secondary"
              onClick={() => onActivar(prestamo._id)}
              loading={togglingPrestamo}
              className={`d-flex align-items-center ${commonButtonClassName} detalle-prestamo-btn--secondary`}
            >
              <i className="bi bi-lightning me-2 detalle-prestamo-icon"></i>
              Activar
            </LoadingButton>
          )}
          {}
          {rol === "admin" && (
            <LoadingButton
              variant="outline-danger"
              onClick={onEliminar}
              loading={deletingPrestamo}
              className={`d-flex align-items-center ${commonButtonClassName} detalle-prestamo-btn--danger`}
            >
              <i className="bi bi-trash me-2 detalle-prestamo-icon"></i>
              Eliminar
            </LoadingButton>
          )}
        </div>
      </div>
      {}
      <div className="d-md-none d-flex justify-content-between align-items-center mb-3">
        {}
        {rol === "admin" && (
          <LoadingButton
            variant="primary"
            onClick={() => onEditar(prestamo)}
            loading={false}
            className={`d-flex align-items-center justify-content-center ${mobileSquareButtonClassName} detalle-prestamo-btn--edit`}
          >
            <i className="bi bi-pencil detalle-prestamo-icon--mobile"></i>
          </LoadingButton>
        )}
        {}
        <Dropdown align="end">
          <Dropdown.Toggle
            variant="outline-secondary"
            id="dropdown-actions-mobile"
            className={`d-flex align-items-center justify-content-center ${mobileSquareButtonClassName} detalle-prestamo-btn--dropdown`}
          >
            <i className="bi bi-three-dots-vertical detalle-prestamo-icon--mobile"></i>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={onVerRegistros} className="d-flex align-items-center">
              <i className="bi bi-eye me-2 detalle-prestamo-icon"></i>
              Ver Registros
            </Dropdown.Item>
            <div className="dropdown-item p-0">
               <ReporteRegistrosCobros
                prestamoId={prestamoId}
              />
            </div>
            {prestamo &&
              (prestamo.estado === "activo" || prestamo.estado === "vencido") &&
              rol === "admin" && (
                <Dropdown.Item onClick={() => onDesactivar(prestamo._id)} className="d-flex align-items-center">
                  <i className="bi bi-pause me-2 detalle-prestamo-icon"></i>
                  Desactivar
                </Dropdown.Item>
              )}
            {prestamo && prestamo.estado !== "activo" && rol === "admin" && (
              <Dropdown.Item onClick={() => onActivar(prestamo._id)} className="d-flex align-items-center">
                <i className="bi bi-lightning me-2 detalle-prestamo-icon"></i>
                Activar
              </Dropdown.Item>
            )}
            {rol === "admin" && (
              <Dropdown.Item 
                onClick={onEliminar} 
                className="d-flex align-items-center text-danger detalle-prestamo-dropdown-item--danger"
              >
                <i className="bi bi-trash me-2 detalle-prestamo-icon"></i>
                Eliminar
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};
export default DetallePrestamoHeaderActions;
