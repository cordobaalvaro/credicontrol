import { Modal, Form } from "react-bootstrap";
import LoadingButton from "../../../componentes/ui/LoadingButton";
import FormNuevoPrestamoConfiguracionGeneral from "../componentes/FormNuevoPrestamoConfiguracionGeneral";
import FormNuevoPrestamoConfiguracionFrecuencia from "../componentes/FormNuevoPrestamoConfiguracionFrecuencia";
import FormNuevoPrestamoDetallesFinancieros from "../componentes/FormNuevoPrestamoDetallesFinancieros";
const ModalNuevoPrestamo = ({
  show,
  onHide,
  nuevoPrestamo,
  onChange,
  usarPlan,
  toggleUsarPlan,
  planesTabla,
  loadingPlanes,
  planIndex,
  montoPlanSeleccionado,
  onChangeMontoPlan,
  onChangePlanIndex,
  usarCuotaPersonalizada,
  toggleModoCuota,
  montoCuotaPersonalizada,
  onChangeCuotaPersonalizada,
  errores,
  onSubmit,
  clienteNombre,
  submitting = false,
  tablaPlanesSeleccionada,
  onChangeTablaPlanes,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-cash-stack me-2"></i>
          Nuevo Préstamo para {clienteNombre}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <FormNuevoPrestamoConfiguracionGeneral
            nuevoPrestamo={nuevoPrestamo}
            onChange={onChange}
            errores={errores}
          />
          <FormNuevoPrestamoConfiguracionFrecuencia
            nuevoPrestamo={nuevoPrestamo}
            onChange={onChange}
            usarPlan={usarPlan}
            toggleUsarPlan={toggleUsarPlan}
            loadingPlanes={loadingPlanes}
            usarCuotaPersonalizada={usarCuotaPersonalizada}
            toggleModoCuota={toggleModoCuota}
            errores={errores}
          />
          <FormNuevoPrestamoDetallesFinancieros
            nuevoPrestamo={nuevoPrestamo}
            onChange={onChange}
            usarPlan={usarPlan}
            planesTabla={planesTabla}
            loadingPlanes={loadingPlanes}
            planIndex={planIndex}
            montoPlanSeleccionado={montoPlanSeleccionado}
            onChangeMontoPlan={onChangeMontoPlan}
            onChangePlanIndex={onChangePlanIndex}
            usarCuotaPersonalizada={usarCuotaPersonalizada}
            montoCuotaPersonalizada={montoCuotaPersonalizada}
            onChangeCuotaPersonalizada={onChangeCuotaPersonalizada}
            errores={errores}
            tablaPlanesSeleccionada={tablaPlanesSeleccionada}
            onChangeTablaPlanes={onChangeTablaPlanes}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <LoadingButton
          variant="secondary"
          onClick={onHide}
          loading={false}
          disabled={submitting}
        >
          <i className="bi bi-x-circle me-2"></i>
          Cancelar
        </LoadingButton>
        <LoadingButton
          variant="success"
          type="submit"
          onClick={onSubmit}
          loading={submitting}
        >
          <i className="bi bi-check-circle me-2"></i>
          Crear Préstamo
        </LoadingButton>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalNuevoPrestamo;
