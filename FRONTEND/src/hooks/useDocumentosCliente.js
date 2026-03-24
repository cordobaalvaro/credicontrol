import { useState } from "react";
import Swal from "sweetalert2";
import { documentoService } from "../services";

const useDocumentosCliente = (id) => {
  const [documentos, setDocumentos] = useState([]);
  const [nuevoDocumento, setNuevoDocumento] = useState({ nombre: "", archivo: "url" });
  const [archivoImagen, setArchivoImagen] = useState(null);

  const [showDocumentoModal, setShowDocumentoModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [imagenPreview, setImagenPreview] = useState("");
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [documentoEditar, setDocumentoEditar] = useState(null);
  const [nombreEditado, setNombreEditado] = useState("");

  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [updatingDoc, setUpdatingDoc] = useState(false);

  const abrirModalDocumento = () => setShowDocumentoModal(true);

  const cerrarModalDocumento = () => {
    setShowDocumentoModal(false);
    setNuevoDocumento({ nombre: "" });
    setArchivoImagen(null);
  };

  const handleDocumentoNombreChange = (value) => setNuevoDocumento({ nombre: value });

  const handleArchivoChange = (file) => {
    if (!file) {
      setArchivoImagen(null);
      return;
    }
    const formatosPermitidos = ["image/jpeg", "image/jpg", "image/png"];
    const extensionesPermitidas = [".jpg", ".jpeg", ".png"];
    const tipoValido = formatosPermitidos.includes(file.type);
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf("."));
    const extensionValida = extensionesPermitidas.includes(extension);

    if (!tipoValido || !extensionValida) {
      Swal.fire({
        icon: "error",
        title: "Formato no válido",
        text: "Solo se permiten archivos JPG, JPEG y PNG",
        confirmButtonColor: "#dc3545",
      });
      const input = document.querySelector('input[type="file"]');
      if (input) input.value = "";
      setArchivoImagen(null);
      return;
    }

    const tamañoMaximo = 5 * 1024 * 1024;
    if (file.size > tamañoMaximo) {
      Swal.fire({
        icon: "error",
        title: "Archivo muy grande",
        text: "El archivo no puede superar los 5MB",
        confirmButtonColor: "#dc3545",
      });
      const input = document.querySelector('input[type="file"]');
      if (input) input.value = "";
      setArchivoImagen(null);
      return;
    }

    setArchivoImagen(file);
  };

  const obtenerDocumentoCliente = async () => {
    try {
      const res = await documentoService.getDocumentos(id);
      setDocumentos(res.data);
    } catch {
      
    }
  };

  const verDocumento = (documento) => {
    setImagenPreview(documento.url);
    setShowPreviewModal(true);
  };

  const cerrarPreviewModal = () => {
    setShowPreviewModal(false);
    setImagenPreview("");
  };

  const abrirModalEditar = (documento) => {
    setDocumentoEditar(documento);
    setNombreEditado(documento.nombre);
    setArchivoImagen(null);
    setShowEditarModal(true);
  };

  const cerrarModalEditar = () => {
    setShowEditarModal(false);
    setDocumentoEditar(null);
    setNombreEditado("");
    setArchivoImagen(null);
  };

  const eliminarDocumento = async (documentoId) => {
    const result = await Swal.fire({
      title: "¿Eliminar documento?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;

    try {
      await documentoService.eliminarDocumento(documentoId);
      obtenerDocumentoCliente();
      Swal.fire({
        title: "Eliminado",
        text: "El documento ha sido eliminado correctamente",
        icon: "success",
        confirmButtonColor: "#198754",
      });
    } catch {
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el documento",
        icon: "error",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  const crearDocumentoCliente = async () => {
    if (uploadingDoc) return;
    try {
      setUploadingDoc(true);
      const res = await documentoService.crearDocumento(id, nuevoDocumento.nombre);
      
      cerrarModalDocumento();
      Swal.fire({
        icon: "success",
        title: "¡Documento creado!",
        text: "El documento se ha creado correctamente.",
        confirmButtonColor: "#198754",
      });

      if (archivoImagen) {
        const formData = new FormData();
        formData.append("imagen", archivoImagen);
        await documentoService.subirImagen(res.documentoId, formData);
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
      obtenerDocumentoCliente();
    } catch {
      
    } finally {
      setUploadingDoc(false);
    }
  };

  const editarDocumento = async (documentoId, nuevoNombre) => {
    if (updatingDoc) return;
    try {
      setUpdatingDoc(true);
      await documentoService.actualizarDocumento(documentoId, nuevoNombre);
      
      Swal.fire({
        title: "¡Documento actualizado!",
        text: "El documento se ha actualizado correctamente.",
        icon: "success",
        confirmButtonColor: "#198754",
      });
      cerrarModalEditar();

      if (archivoImagen) {
        const formData = new FormData();
        formData.append("imagen", archivoImagen);
        await documentoService.subirImagen(documentoId, formData, true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      obtenerDocumentoCliente();
    } catch {
      Swal.fire({
        title: "Error",
        text: "No se pudo editar el documento",
        icon: "error",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setUpdatingDoc(false);
    }
  };

  return {
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
  };
};

export default useDocumentosCliente;
