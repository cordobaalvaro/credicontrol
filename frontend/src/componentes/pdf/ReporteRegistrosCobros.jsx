import React from "react";
import useReportesPDF from "../../hooks/useReportesPDF.jsx";
import "./ReporteRegistrosCobros.css";
const ReporteRegistrosCobros = ({ prestamoId }) => {
  const { reporteRegistrosCobros, cargando } = useReportesPDF();
  const handleGenerarPDF = (e) => {
    e.preventDefault();
    if (prestamoId) {
      reporteRegistrosCobros(prestamoId);
    }
  };
  if (!prestamoId) {
    return (
      <button className="btn btn-secondary" disabled>
        <i className="bi bi-file-earmark-pdf me-2"></i>
        PDF no disponible
      </button>
    );
  }
  return (
    <button
      className={`detalle-prestamo-btn-common detalle-prestamo-btn--pdf`}
      onClick={handleGenerarPDF}
      title="Generar PDF de Registros de Cobros"
      disabled={cargando}
    >
      <i className={`bi ${cargando ? 'bi-hourglass-split' : 'bi-file-text'} detalle-prestamo-icon`}></i>
      <span className="d-none d-md-inline">{cargando ? 'Generando...' : 'PDF Registros'}</span>
      <span className="d-md-none">{cargando ? '...' : 'PDF'}</span>
    </button>
  );
};
export default ReporteRegistrosCobros;
