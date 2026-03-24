import { useParams, useNavigate } from "react-router-dom";
import { Container, Spinner, Alert } from "react-bootstrap";
import "./DetallePrestamo.css";
import ModalRegistrosCobros from "./modales/ModalRegistrosCobros";
import ModalEditarRegistroCobro from "./modales/ModalEditarRegistroCobro";
import ModalCrearRegistroCobro from "./modales/ModalCrearRegistroCobro";
import ModalEditarPrestamo from "./modales/ModalEditarPrestamo";
import DetallePrestamoHeaderActions from "./componentes/DetallePrestamoHeaderActions";
import DetallePrestamoInfoCard from "./componentes/DetallePrestamoInfoCard";
import DetallePrestamoCuotasTable from "./componentes/DetallePrestamoCuotasTable";
import useDetallePrestamo from "../../hooks/useDetallePrestamo";
import useReportesPDF from "../../hooks/useReportesPDF.jsx";
import PageLoading from "../../componentes/ui/PageLoading";
import PageHeader from "../../componentes/layout/PageHeader";
const DetallePrestamo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    prestamo,
    loading,
    error,
    rol,
    registrosCobro,
    showRegistroCobrosModal,
    showCrearRegistroCobroModal,
    showEditRegistroCobroModal,
    datosNuevoRegistroCobro,
    datosEditRegistroCobro,
    creatingRegistro,
    updatingRegistro,
    deletingRegistro,
    showEditPrestamoModal,
    prestamoEditado,
    erroresValidacionEdit,
    usarCuotaPersonalizadaEdit,
    montoCuotaPersonalizadaEdit,
    updatingPrestamo,
    deletingPrestamo,
    togglingPrestamo,
    abrirModalRegistroCobros,
    cerrarModalRegistroCobros,
    abrirModalCrearRegistroCobro,
    cerrarModalCrearRegistroCobro,
    handleInputChangeNuevoRegistroCobro,
    abrirModalEditRegistroCobro,
    cerrarModalEditRegistroCobro,
    handleInputChangeEditRegistroCobro,
    guardarNuevoRegistroCobro,
    guardarCambiosRegistroCobro,
    eliminarRegistroCobro,
    abrirModalEditarPrestamo,
    cerrarModalEditarPrestamo,
    handleEditPrestamoChange,
    handleCuotaPersonalizadaEditChange,
    toggleModoCuotaEdit,
    editarPrestamo,
    eliminarPrestamo,
    activarPrestamo,
    desactivarPrestamo,
  } = useDetallePrestamo({ id, navigate });
  const { reporteRegistrosCobros, reporteDetallePrestamo } = useReportesPDF();
  const handleDescargarPDF = () => {
    if (prestamo?._id) {
      reporteDetallePrestamo(prestamo._id);
    }
  };
  if (loading) return <PageLoading message="Cargando detalles del préstamo..." />;
  if (error)
    return (
      <Alert variant="danger" className="mt-3">
        {error}
      </Alert>
    );
  return (
    <>
      <PageHeader
        iconClass="bi bi-bank"
        title={`${prestamo?.nombre || "Préstamo"} ${prestamo?.numero ? `Â· NÂ° ${prestamo.numero}` : ""}`.trim()}
        subtitle={`Cliente: ${prestamo?.cliente?.nombre || "-"}`}
        showBackButton={true}
        onBackClick={() => navigate(-1)}
      />
      <Container>
        <DetallePrestamoHeaderActions
          prestamo={prestamo}
          rol={rol}
          deletingPrestamo={deletingPrestamo}
          togglingPrestamo={togglingPrestamo}
          onVerRegistros={abrirModalRegistroCobros}
          onEditar={abrirModalEditarPrestamo}
          onEliminar={eliminarPrestamo}
          onDesactivar={desactivarPrestamo}
          onActivar={activarPrestamo}
          prestamoId={id}
        />
        <DetallePrestamoInfoCard
          prestamo={prestamo}
          onDescargarPDF={handleDescargarPDF}
        />
        <DetallePrestamoCuotasTable planDeCuotas={prestamo.planDeCuotas} />
        <ModalRegistrosCobros
          show={showRegistroCobrosModal}
          onHide={cerrarModalRegistroCobros}
          registros={registrosCobro}
          prestamo={prestamo}
          abrirModalCrear={abrirModalCrearRegistroCobro}
          onEditar={(reg) => abrirModalEditRegistroCobro(reg)}
          onEliminar={eliminarRegistroCobro}
        />
        <ModalEditarRegistroCobro
          show={showEditRegistroCobroModal}
          onHide={cerrarModalEditRegistroCobro}
          datos={datosEditRegistroCobro}
          onChange={handleInputChangeEditRegistroCobro}
          prestamo={prestamo}
          onGuardar={guardarCambiosRegistroCobro}
          submitting={updatingRegistro}
        />
        <ModalCrearRegistroCobro
          show={showCrearRegistroCobroModal}
          onHide={cerrarModalCrearRegistroCobro}
          datos={datosNuevoRegistroCobro}
          onChange={handleInputChangeNuevoRegistroCobro}
          prestamo={prestamo}
          onGuardar={guardarNuevoRegistroCobro}
          submitting={creatingRegistro}
        />
        <ModalEditarPrestamo
          show={showEditPrestamoModal}
          onHide={cerrarModalEditarPrestamo}
          errores={erroresValidacionEdit}
          prestamoEditado={prestamoEditado}
          onChange={handleEditPrestamoChange}
          usarCuotaPersonalizada={usarCuotaPersonalizadaEdit}
          toggleModoCuota={toggleModoCuotaEdit}
          montoCuotaPersonalizada={montoCuotaPersonalizadaEdit}
          onChangeCuotaPersonalizada={handleCuotaPersonalizadaEditChange}
          onSubmit={editarPrestamo}
          submitting={updatingPrestamo}
        />
      </Container>
    </>
  );
};
export default DetallePrestamo;
