import React, { useState } from "react";
import {
  Container,
  Card,
  Alert,
  Row,
  Col,
  Form,
  Tabs,
  Tab,
} from "react-bootstrap";
import LoadingButton from "../../componentes/ui/LoadingButton";
import { useParams, useNavigate } from "react-router-dom";
import ReporteResumenCliente from "../../componentes/pdf/ReporteResumenCliente";
import useClienteDatos from "../../hooks/useClienteDatos";
import useClienteEdicion from "../../hooks/useClienteEdicion";
import useDocumentosCliente from "../../hooks/useDocumentosCliente";
import useNuevoPrestamoCliente from "../../hooks/useNuevoPrestamoCliente";
import ClienteFormDatosPersonales from "./componentes/ClienteFormDatosPersonales";
import ClienteFormDireccion from "./componentes/ClienteFormDireccion";
import ClienteFormComercial from "./componentes/ClienteFormComercial";
import ClienteInfoReadOnly from "./componentes/ClienteInfoReadOnly";
import ClienteResumenPrestamos from "./componentes/ClienteResumenPrestamos";
import ClientePrestamosSection from "./componentes/ClientePrestamosSection";
import ClienteDocumentosTab from "./componentes/ClienteDocumentosTab";
import "./PaginaCliente.css";
import PageLoading from "../../componentes/ui/PageLoading";
import ModalNuevoPrestamo from "./modales/ModalNuevoPrestamo";
const PaginaCliente = () => {
  const [activeTab, setActiveTab] = useState("informacion");
  const { id } = useParams();
  const {
    cliente,
    setCliente,
    loading,
    error,
    zonas,
    resumenCliente,
    obtenerResumenCliente,
    userRole,
  } = useClienteDatos(id);
  const {
    editMode,
    clienteEditado,
    erroresValidacion,
    savingCliente,
    iniciarEdicion,
    cancelarEdicion,
    handleInputChange,
    guardarCambios,
  } = useClienteEdicion({ id, cliente, setCliente });
  const {
    documentos,
    nuevoDocumento,
    archivoImagen,
    showDocumentoModal,
    showPreviewModal,
    imagenPreview,
    showEditarModal,
    documentoEditar,
    nombreEditado,
    uploadingDoc,
    updatingDoc,
    abrirModalDocumento,
    cerrarModalDocumento,
    handleDocumentoNombreChange,
    handleArchivoChange,
    obtenerDocumentoCliente,
    verDocumento,
    cerrarPreviewModal,
    abrirModalEditar,
    cerrarModalEditar,
    eliminarDocumento,
    crearDocumentoCliente,
    editarDocumento,
    setNombreEditado,
    setArchivoImagen,
  } = useDocumentosCliente(id);
  const {
    showPrestamoModal,
    nuevoPrestamo,
    usarPlan,
    toggleUsarPlan,
    planesTabla,
    loadingPlanes,
    planIndex,
    montoPlanSeleccionado,
    usarCuotaPersonalizada,
    montoCuotaPersonalizada,
    erroresPrestamo,
    creatingPrestamo,
    abrirModalPrestamo,
    cerrarModalPrestamo,
    handlePrestamoChange,
    handleMontoPlanChange,
    handlePlanIndexChange,
    handleCuotaPersonalizadaChange,
    handleTablaPlanesChange,
    toggleModoCuota,
    crearPrestamo,
    tablaPlanesSeleccionada,
  } = useNuevoPrestamoCliente(id, setCliente);
  const navigate = useNavigate();
  if (loading) return <PageLoading message="Cargando información del cliente..." />;
  if (error)
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  if (!cliente)
    return (
      <Container className="mt-4">
        <Alert variant="warning">Cliente no encontrado</Alert>
      </Container>
    );
  return (
    <div className="cliente-container">
      <div className="cliente-header">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center">
                <button
                  className="page-header-back-btn me-3"
                  onClick={() => navigate(-1)}
                  aria-label="Volver"
                >
                  <i className="bi bi-arrow-left"></i>
                </button>
                <div>
                  <h1 className="cliente-title">
                    <i className="bi bi-person-circle me-3"></i>
                    {cliente.nombre}
                  </h1>
                  <p className="cliente-subtitle">
                    Información detallada del cliente y sus préstamos
                  </p>
                </div>
              </div>
            </Col>
            <Col md={4} className="text-end">
              <div className="d-flex gap-2 justify-content-end align-items-center flex-wrap">
                {(userRole === "admin" || userRole === "cobrador") && (
                  <ReporteResumenCliente
                    datosResumen={resumenCliente}
                    onRequestData={obtenerResumenCliente}
                  />
                )}
                {userRole === "admin" && activeTab === "informacion" &&
                  (!editMode ? (
                    <LoadingButton
                      variant="outline-success"
                      size="sm"
                      onClick={iniciarEdicion}
                      loading={false}
                    >
                      <i className="bi bi-pencil-square me-2"></i>
                      Editar
                    </LoadingButton>
                  ) : (
                    <>
                      <LoadingButton
                        variant="success"
                        size="sm"
                        onClick={guardarCambios}
                        loading={savingCliente}
                      >
                        <i className="bi bi-check-circle me-2"></i>
                        Guardar
                      </LoadingButton>
                      <LoadingButton
                        variant="outline-secondary"
                        size="sm"
                        onClick={cancelarEdicion}
                        loading={false}
                        disabled={savingCliente}
                      >
                        <i className="bi bi-x-circle me-2"></i>
                        Cancelar
                      </LoadingButton>
                    </>
                  ))}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Container>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          id="cliente-tabs"
          className="mb-4"
        >
          <Tab
            eventKey="informacion"
            title={
              <span>
                <i className="bi bi-person-vcard me-2"></i>Información del
                Cliente
              </span>
            }
          >
            <Row>
              <Col lg={8}>
                <Card className="cliente-card">
                  <div className="info-section">
                    <h5>
                      <i className="bi bi-person-vcard"></i>Información Personal
                    </h5>
                    {editMode ? (
                      <Form>
                        <Row>
                          <ClienteFormDatosPersonales
                            cliente={clienteEditado}
                            errores={erroresValidacion}
                            onChange={handleInputChange}
                          />
                          <ClienteFormDireccion
                            cliente={clienteEditado}
                            errores={erroresValidacion}
                            onChange={handleInputChange}
                          />
                          <ClienteFormComercial
                            cliente={clienteEditado}
                            errores={erroresValidacion}
                            onChange={handleInputChange}
                            zonas={zonas}
                          />
                        </Row>
                      </Form>
                    ) : (
                      <ClienteInfoReadOnly cliente={cliente} />
                    )}
                  </div>
                </Card>
              </Col>
              <ClienteResumenPrestamos resumenCliente={resumenCliente} cliente={cliente} />
            </Row>
            <ClientePrestamosSection
              cliente={cliente}
              userRole={userRole}
              onNuevoPrestamo={abrirModalPrestamo}
              navigate={navigate}
            />
            <ModalNuevoPrestamo
              show={showPrestamoModal}
              onHide={cerrarModalPrestamo}
              nuevoPrestamo={nuevoPrestamo}
              onChange={handlePrestamoChange}
              usarPlan={usarPlan}
              toggleUsarPlan={toggleUsarPlan}
              planesTabla={planesTabla}
              loadingPlanes={loadingPlanes}
              planIndex={planIndex}
              montoPlanSeleccionado={montoPlanSeleccionado}
              onChangeMontoPlan={handleMontoPlanChange}
              onChangePlanIndex={handlePlanIndexChange}
              usarCuotaPersonalizada={usarCuotaPersonalizada}
              toggleModoCuota={toggleModoCuota}
              montoCuotaPersonalizada={montoCuotaPersonalizada}
              onChangeCuotaPersonalizada={handleCuotaPersonalizadaChange}
              errores={erroresPrestamo}
              onSubmit={crearPrestamo}
              clienteNombre={cliente?.nombre}
              submitting={creatingPrestamo}
              tablaPlanesSeleccionada={tablaPlanesSeleccionada}
              onChangeTablaPlanes={handleTablaPlanesChange}
            />
          </Tab>
          <Tab
            eventKey="documentos"
            title={
              <span>
                <i className="bi bi-file-earmark-text me-2"></i>Documentos y
                Archivos
              </span>
            }
            onEnter={obtenerDocumentoCliente}
          >
            <ClienteDocumentosTab
              userRole={userRole}
              documentos={documentos}
              showDocumentoModal={showDocumentoModal}
              cerrarModalDocumento={cerrarModalDocumento}
              nuevoDocumento={nuevoDocumento}
              handleDocumentoNombreChange={handleDocumentoNombreChange}
              handleArchivoChange={handleArchivoChange}
              crearDocumentoCliente={crearDocumentoCliente}
              uploadingDoc={uploadingDoc}
              showPreviewModal={showPreviewModal}
              cerrarPreviewModal={cerrarPreviewModal}
              imagenPreview={imagenPreview}
              showEditarModal={showEditarModal}
              cerrarModalEditar={cerrarModalEditar}
              nombreEditado={nombreEditado}
              setNombreEditado={setNombreEditado}
              documentoEditar={documentoEditar}
              editarDocumento={editarDocumento}
              updatingDoc={updatingDoc}
              abrirModalDocumento={abrirModalDocumento}
              verDocumento={verDocumento}
              eliminarDocumento={eliminarDocumento}
            />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};
export default PaginaCliente;
