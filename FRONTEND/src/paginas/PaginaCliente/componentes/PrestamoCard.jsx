"use client"
import { Button } from "react-bootstrap"
const PrestamoCard = ({ prestamo, onVer }) => {
  return (
    <div className="prestamo-card">
      <div className="prestamo-card-header-top">
        <span className="prestamo-card-number">
          {prestamo.numero && prestamo.nombre
            ? `#${prestamo.numero} - ${prestamo.nombre}`
            : prestamo.numero
              ? `Préstamo #${prestamo.numero}`
              : prestamo.nombre || "Préstamo sin nombre"}
        </span>
        <div className="prestamo-badges">
          {prestamo?.tipo === "refinanciado" && (
            <span className="prestamo-tipo prestamo-tipo-refinanciado">REF</span>
          )}
          <span
            className={`prestamo-estado ${prestamo.estado === "activo"
                ? "estado-pendiente"
                : prestamo.estado === "vencido"
                  ? "estado-vencido"
                  : "estado-finalizado"
              }`}
          >
            {prestamo.estado?.toUpperCase() || "ACTIVO"}
          </span>
        </div>
      </div>
      <div className="prestamo-card-amounts">
        <div className="amount-item amount-inicial">
          <span className="amount-label">Inicial</span>
          <span className="amount-value">${Number(prestamo.montoInicial || 0).toLocaleString()}</span>
        </div>
        <div className="amount-item amount-total">
          <span className="amount-label">Total</span>
          <span className="amount-value">${Number(prestamo.montoTotal || 0).toLocaleString()}</span>
        </div>
        <div className="amount-item amount-saldo">
          <span className="amount-label">Saldo</span>
          <span className="amount-value">${Number(prestamo.saldoPendiente || 0).toLocaleString()}</span>
        </div>
      </div>
      <div className="prestamo-details-compact">
        <div className="detail-item-compact">
          <span className="detail-value-compact">{prestamo.cantidadCuotas}</span>
          <span className="detail-label-compact">Cuotas</span>
        </div>
        <div className="detail-item-compact">
          <span className="detail-value-compact">
            {prestamo.planDeCuotas.filter((cuota) => cuota.estado === "completo").length || 0}
          </span>
          <span className="detail-label-compact">Pagadas</span>
        </div>
        <div className="detail-item-compact">
          <span className="detail-value-compact">{prestamo.interes || 0}%</span>
          <span className="detail-label-compact">Interés</span>
        </div>
      </div>
      <Button variant="success" size="sm" onClick={onVer} className="w-100 btn-ver-prestamo-compact mt-2">
        <i className="bi bi-eye me-1"></i>
        Ver
      </Button>
    </div>
  )
}
export default PrestamoCard
