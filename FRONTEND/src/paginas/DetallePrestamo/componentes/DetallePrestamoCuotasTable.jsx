import { Table, Alert, Badge } from "react-bootstrap";
import "./DetallePrestamoCuotasTable.css";
const DetallePrestamoCuotasTable = ({ planDeCuotas }) => {
  const getBadgeClass = (estado) => {
    switch (estado?.toLowerCase()) {
      case "pendiente": return "cuota-estado-pendiente";
      case "completo": return "cuota-estado-completo";
      case "cobrado": return "cuota-estado-cobrado";
      default: return "cuota-estado-pendiente";
    }
  };
  const getEstadoLabel = (estado) => {
    switch (estado?.toLowerCase()) {
      case "pendiente": return "PENDIENTE";
      case "completo": return "COMPLETO";
      case "cobrado": return "COBRADO";
      default: return estado?.toUpperCase() || "DESCONOCIDO";
    }
  };
  return (
    <div className="mt-4">
      <div className="d-flex align-items-center mb-3">
        <h5 className="text-success fw-bold mb-0 flex-grow-1">
          <i className="bi bi-calendar-check me-2"></i>
          Cronograma de Cuotas
        </h5>
        {planDeCuotas?.length > 0 && (
          <Badge bg="light" text="dark" className="border">
            {planDeCuotas.length} {planDeCuotas.length === 1 ? "CUOTA" : "CUOTAS"}
          </Badge>
        )}
      </div>
      {planDeCuotas?.length > 0 ? (
        <div className="cuotas-table-container">
          <Table
            borderless
            hover
            responsive
            className="cuotas-table m-0"
          >
            <thead>
              <tr className="text-center align-middle">
                <th>#</th>
                <th className="text-start">Monto de Cuota</th>
                <th className="text-start">Vencimiento</th>
                <th className="text-start">Total Pagado</th>
                <th className="text-end">Estado</th>
              </tr>
            </thead>
            <tbody>
              {planDeCuotas.map((cuota, i) => (
                <tr key={cuota._id} className="text-center align-middle">
                  <td className="cuota-numero">{cuota.numero || i + 1}</td>
                  <td className="text-start cuota-monto">
                    ${(cuota.monto || 0).toLocaleString()}
                  </td>
                  <td className="text-start cuota-fecha">
                    {cuota.fechaVencimiento ? new Date(cuota.fechaVencimiento).toLocaleDateString() : "-"}
                  </td>
                  <td className="text-start cuota-pagado">
                    ${(cuota.pagado || 0).toLocaleString()}
                  </td>
                  <td className="text-end">
                    <span className={`cuota-badge ${getBadgeClass(cuota.estado)}`}>
                      {getEstadoLabel(cuota.estado)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <Alert variant="info" className="border-0 bg-light rounded-4">
          <div className="d-flex align-items-center">
            <i className="bi bi-info-circle-fill me-3 fs-4 text-info opacity-50"></i>
            <div>
              <strong>No hay cuotas.</strong> Este préstamo no tiene un cronograma de cuotas registrado.
            </div>
          </div>
        </Alert>
      )}
    </div>
  );
};
export default DetallePrestamoCuotasTable;
