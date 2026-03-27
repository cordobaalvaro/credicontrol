import { Row, Col, Card } from "react-bootstrap";
import LoadingButton from "../../../componentes/ui/LoadingButton";
import ModalSubirDocumento from "../modales/ModalSubirDocumento";
import ModalPreviewDocumento from "../modales/ModalPreviewDocumento";
import ModalEditarDocumento from "../modales/ModalEditarDocumento";
const ClienteDocumentosTab = ({
  userRole,
  documentos,
  showDocumentoModal,
  cerrarModalDocumento,
  nuevoDocumento,
  handleDocumentoNombreChange,
  handleArchivoChange,
  crearDocumentoCliente,
  uploadingDoc,
  showPreviewModal,
  cerrarPreviewModal,
  imagenPreview,
  showEditarModal,
  cerrarModalEditar,
  nombreEditado,
  setNombreEditado,
  documentoEditar,
  editarDocumento,
  updatingDoc,
  abrirModalDocumento,
  verDocumento,
  eliminarDocumento,
}) => {
  return (
    <>
      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-folder2-open me-2"></i>Gestión de
                  Documentos
                </h5>
                {userRole === "admin" && (
                  <LoadingButton
                    variant="success"
                    size="sm"
                    onClick={abrirModalDocumento}
                    loading={false}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Subir Documento
                  </LoadingButton>
                )}
              </div>
            </Card.Header>
            <Card.Body>
              {documentos && documentos.length > 0 ? (
                <Row>
                  {documentos.map((documento) => (
                    <Col key={documento.id} md={6} lg={4} className="mb-3">
                      <Card className="h-100 shadow-sm border-0 rounded-3 overflow-hidden">
                        <Card.Img
                          variant="top"
                          src={documento.url}
                          className="cliente-doc-img"
                        />
                        <Card.Body className="d-flex flex-column">
                          <h6
                            className="text-truncate fw-bold mb-3"
                            title={documento.nombreArchivo || documento.nombre}
                          >
                            {documento.nombre}
                          </h6>
                          <div className="mt-auto pt-2">
                            <div className="d-flex gap-2">
                              <LoadingButton
                                variant="outline-primary"
                                size="sm"
                                className="flex-fill rounded-pill"
                                onClick={() => verDocumento(documento)}
                                loading={false}
                              >
                                <i className="bi bi-eye me-1"></i>
                                Ver
                              </LoadingButton>
                              {userRole === "admin" && (
                                <>
                                  <LoadingButton
                                    variant="outline-warning"
                                    size="sm"
                                    className="flex-fill rounded-pill"
                                    onClick={() => abrirModalEditar(documento)}
                                    loading={false}
                                  >
                                    <i className="bi bi-pencil me-1"></i>
                                    Editar
                                  </LoadingButton>
                                  <LoadingButton
                                    variant="outline-danger"
                                    size="sm"
                                    className="rounded-circle px-2"
                                    onClick={() => eliminarDocumento(documento._id)}
                                    loading={false}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </LoadingButton>
                                </>
                              )}
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-file-earmark-text display-1 text-muted opacity-25"></i>
                  <p className="mt-3 text-muted fw-semibold">No hay documentos subidos</p>
                  <small className="text-muted d-block">
                    Usa el botón "Subir Documento" para agregar archivos
                  </small>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ModalSubirDocumento
        show={showDocumentoModal}
        onHide={cerrarModalDocumento}
        nombre={nuevoDocumento.nombre}
        onNombreChange={handleDocumentoNombreChange}
        onArchivoChange={handleArchivoChange}
        onSubmit={crearDocumentoCliente}
        submitting={uploadingDoc}
      />
      <ModalPreviewDocumento
        show={showPreviewModal}
        onHide={cerrarPreviewModal}
        imagenUrl={imagenPreview}
      />
      <ModalEditarDocumento
        show={showEditarModal}
        onHide={cerrarModalEditar}
        nombreEditado={nombreEditado}
        onChangeNombre={setNombreEditado}
        onArchivoChange={handleArchivoChange}
        documento={documentoEditar}
        onGuardar={() => editarDocumento(documentoEditar._id, nombreEditado)}
        submitting={updatingDoc}
      />
    </>
  );
};
export default ClienteDocumentosTab;
