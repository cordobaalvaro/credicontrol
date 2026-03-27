import { useState } from "react";
import Swal from "sweetalert2";
import pdfService from "../services/pdf.service";
import { generarPDFResumenCliente } from "../componentes/pdf/generarPDFResumenCliente";
import { generarPDFPlanillaCobrador } from "../componentes/pdf/generarPDFPlanillaCobrador";
import { generarPDFTablaSemanal } from "../componentes/pdf/generarPDFTablaSemanal";
import { generarPDFPrestamo } from "../componentes/pdf/generarPDFPrestamo";
import { exportarTablaPDF } from "../componentes/pdf/exportarTablaPDF";
const useReportesPDF = () => {
  const [cargando, setCargando] = useState(false);
  const mostrarCargando = (titulo = "Generando PDF...", texto = "Por favor espere...") => {
    Swal.fire({
      title: titulo,
      text: texto,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };
  const cerrarCargando = () => {
    Swal.close();
  };
  const mostrarError = (mensaje = "No se pudo generar el PDF.") => {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: mensaje,
      confirmButtonColor: "#198754",
    });
  };
  const mostrarExito = (titulo = "¡PDF Generado!", texto = "El reporte se ha descargado correctamente") => {
    Swal.fire({
      icon: "success",
      title: titulo,
      text: texto,
      timer: 2000,
      showConfirmButton: false,
    });
  };
  
  const reporteResumenCliente = async (clienteId) => {
    setCargando(true);
    mostrarCargando("Obteniendo datos del cliente...");
    try {
      const response = await pdfService.getResumenCliente(clienteId);
      if (response && response.data) {
        generarPDFResumenCliente(response.data);
        mostrarExito();
      } else {
        mostrarError("No se obtuvieron datos válidos para el resumen.");
      }
    } catch (error) {
      console.error("Error al generar resumen cliente PDF:", error);
      mostrarError(error.msg || "Hubo un problema al obtener los datos del resumen.");
    } finally {
      setCargando(false);
    }
  };
  
  const reporteRegistrosCobros = async (prestamoId) => {
    setCargando(true);
    mostrarCargando("Obteniendo registros de cobros...");
    try {
      const response = await pdfService.getReporteCobros(prestamoId);
      if (response && response.data) {
        
        const { pdf } = await import("@react-pdf/renderer");
        const DocumentoRegistrosCobros = (await import("../componentes/pdf/DocumentoRegistrosCobros")).default;
        const { prestamo: prestamoData, registrosCobros, estadisticas } = response.data;
        const blob = await pdf(
          <DocumentoRegistrosCobros
            prestamoData={prestamoData}
            registrosCobros={registrosCobros}
            estadisticas={estadisticas}
          />
        ).toBlob();
        const clienteNombre = prestamoData?.cliente?.nombre?.replace(/\s+/g, "-") || "cliente";
        const prestamoNombre = prestamoData?.nombre?.replace(/\s+/g, "-") || "prestamo";
        const nombreArchivo = `registros-cobros-${clienteNombre}-${prestamoNombre}-${Date.now()}.pdf`;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = nombreArchivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        mostrarExito();
      } else {
        mostrarError("No se obtuvieron datos válidos para el reporte.");
      }
    } catch (error) {
      console.error("Error al generar registros cobros PDF:", error);
      mostrarError(error.msg || "Hubo un problema al obtener los registros de cobros.");
    } finally {
      setCargando(false);
    }
  };
  
  const reportePlanillaCobrador = async (tablaId) => {
    setCargando(true);
    mostrarCargando("Obteniendo datos de la tabla semanal...");
    try {
      const response = await pdfService.getDatosTablaSemanal(tablaId);
      if (response && response.data) {
        generarPDFPlanillaCobrador(response.data);
        mostrarExito();
      } else {
        mostrarError("No se obtuvieron datos válidos de la tabla.");
      }
    } catch (error) {
      console.error("Error al generar planilla cobrador PDF:", error);
      mostrarError(error.msg || "Hubo un problema al obtener la tabla semanal.");
    } finally {
      setCargando(false);
    }
  };
  
  const reporteTablaSemanal = async (tablaId) => {
    setCargando(true);
    mostrarCargando("Obteniendo datos de la tabla semanal...");
    try {
      const response = await pdfService.getDatosTablaSemanal(tablaId);
      if (response && response.data) {
        generarPDFTablaSemanal(response.data);
        mostrarExito();
      } else {
        mostrarError("No se obtuvieron datos válidos de la tabla.");
      }
    } catch (error) {
      console.error("Error al generar tabla semanal PDF:", error);
      mostrarError(error.msg || "Hubo un problema al obtener la tabla semanal.");
    } finally {
      setCargando(false);
    }
  };
  
  const reporteDetallePrestamo = async (prestamoId) => {
    setCargando(true);
    mostrarCargando("Obteniendo detalle del préstamo...");
    try {
      const response = await pdfService.getDatosPrestamo(prestamoId);
      if (response && response.data) {
        generarPDFPrestamo(response.data);
        mostrarExito();
      } else {
        mostrarError("No se obtuvieron datos válidos del préstamo.");
      }
    } catch (error) {
      console.error("Error al generar detalle préstamo PDF:", error);
      mostrarError(error.msg || "Hubo un problema al obtener el préstamo.");
    } finally {
      setCargando(false);
    }
  };
  
  const reportePlanes = async (tipoTabla) => {
    setCargando(true);
    mostrarCargando("Obteniendo planes...");
    try {
      const response = await pdfService.getPlanes(tipoTabla);
      if (response && response.data) {
        
        const planes = response.data.items || response.data;
        exportarTablaPDF(planes, tipoTabla);
        mostrarExito();
      } else {
        mostrarError("No se obtuvieron planes.");
      }
    } catch (error) {
      console.error("Error al exportar planes PDF:", error);
      mostrarError(error.msg || "Hubo un problema al obtener los planes.");
    } finally {
      setCargando(false);
    }
  };
  return {
    cargando,
    reporteResumenCliente,
    reporteRegistrosCobros,
    reportePlanillaCobrador,
    reporteTablaSemanal,
    reporteDetallePrestamo,
    reportePlanes
  };
};
export default useReportesPDF;
