import React from "react";
import useReportesPDF from "../../hooks/useReportesPDF.jsx";
const ReporteResumenCliente = ({ clienteId }) => {
  const { reporteResumenCliente, cargando } = useReportesPDF();
  const handleGenerarPDF = (e) => {
    e.preventDefault();
    if (clienteId) {
      reporteResumenCliente(clienteId);
    }
  };
  return (
    <button
      onClick={handleGenerarPDF}
      className="btn btn-outline-success btn-sm me-2"
      title="Generar reporte PDF del resumen del cliente"
      disabled={!clienteId || cargando}
    >
      <i className={`bi ${cargando ? 'bi-hourglass-split' : 'bi-file-earmark-pdf'} me-2`}></i>
      {cargando ? 'Generando...' : 'Resumen Cliente'}
    </button>
  );
};
export default ReporteResumenCliente;
