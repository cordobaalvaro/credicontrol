import { Badge, Form, Button, Spinner } from "react-bootstrap"
import {
    IconCash,
    IconMapPin,
    IconMoneybag,
    IconTrendingDown,
    IconAlertCircle,
    IconCalendar,
    IconTrash,
    IconCheck,
    IconAlertTriangle,
} from "@tabler/icons-react"

import { formatARS } from "../../../helpers/currency"
import "./TablaSemanalListItem.css"
const TablaSemanalListItem = ({
    item,
    editable = false,
    editableMonto = false,
    montoValor,
    onMontoChange,
    showGuardarItem = false,
    onGuardarItem,
    guardandoItem = false,
    showCargar = false,
    onCargar,
    cargando = false,
    showEliminar = false,
    onEliminar,
    modoTraslado = false,
    modoEliminacion = false,
    seleccionado = false,
    onSeleccionar,
    planDeCuotas = null,
    cuotaSeleccionada = null,
    onCuotaSeleccionChange = null,
    onObtenerPlanDeCuotas = null,
    loadingPlan = false,
    montosEsperados = {},
    onMontoEsperadoChange = null,
}) => {
    const formatDate = (fecha) => {
        if (!fecha) return "-";
        const d = new Date(fecha);
        return !isNaN(d.getTime()) ? d.toLocaleDateString("es-AR") : "-";
    }
    const formatMonto = (valor) => formatARS(valor)
    const getZonaName = () => item?.zona?.nombre || "Sin Zona"
    const getClienteName = () => item?.cliente?.nombre || "Cliente sin nombre"
    const getPrestamoText = () => {
        const numero = item?.prestamo?.numero
        const nombre = item?.prestamo?.nombre
        if (numero) return `#${numero}${nombre ? ` - ${nombre}` : ""}`
        if (nombre) return nombre
        return "Sin datos"
    }
    const getDireccionText = () => {
        const cliente = item?.cliente
        if (!cliente) return "-"
        if (cliente.direccionCobroFinal) return cliente.direccionCobroFinal
        if (cliente.direccionCobro) return cliente.direccionCobro
        if (cliente.direccionComercial) return cliente.direccionComercial
        if (cliente.direccion) return cliente.direccion
        return "-"
    }
    const getMontoTotal = () => (item?.montoTotalPrestamo ?? 0)
    const getSaldoPendiente = () => (item?.saldoPendiente ?? 0)
    const getSaldoVencido = () => (item?.saldoPendienteVencimiento ?? 0)
    const getEsperadoSemana = () => (item?.montoCuotasEsperadoSemana ?? 0)
    const getMontoCobrado = () => (item?.montoCobrado ?? 0)
    const esPrestamoVencido = () => {
        return item?.prestamo?.estado === "vencido"
    }
    const getEstadoClass = () => {
        const estado = item?.estado
        switch (estado) {
            case "reportado":
                return "success"
            case "cargado":
                return "primary"
            case "enviado":
                return "info"
            default:
                return "secondary"
        }
    }
    const saldoVencido = getSaldoVencido()
    const hasSaldoVencido = saldoVencido > 0
    const primeraCuota = Array.isArray(item?.cuotasSemana) ? item.cuotasSemana[0] : null
    return (
        <div className="list-item tabla-semanal-list-item">
            <div className="list-item-header">
                <div className="list-item-icon success">
                    <IconCash />
                </div>
                <div className="list-item-header-content">
                    <div className="list-item-title-row">
                        <h5 className="list-item-title">{getClienteName()}</h5>
                        {item?.estado && (
                            <Badge bg={getEstadoClass()} className="px-2 py-1 list-item-estado-badge">
                                {item.estado?.toUpperCase()}
                            </Badge>
                        )}
                    </div>
                    <div className="list-item-subtitle-row">
                        <span className="list-item-subtitle d-block">
                            <IconMapPin size={14} />
                            {getZonaName()} • {getPrestamoText()}
                        </span>
                        <span className="list-item-address">
                            <IconMapPin size={12} />
                            {getDireccionText()}
                        </span>
                    </div>
                    <div className="list-item-metrics-inline">
                        <div className="list-item-metrics-row">
                            <div className="list-item-info-item info-total">
                                <span className="list-item-info-label">
                                    <IconMoneybag size={12} />
                                    Total
                                </span>
                                <span className="list-item-info-value">{formatMonto(getMontoTotal())}</span>
                            </div>
                            <div className="list-item-info-item info-pendiente">
                                <span className="list-item-info-label">
                                    <IconTrendingDown size={12} />
                                    Pendiente
                                </span>
                                <span className="list-item-info-value">{formatMonto(getSaldoPendiente())}</span>
                            </div>
                            {!esPrestamoVencido() && (
                                <div className="list-item-info-item info-esperado">
                                    <span className="list-item-info-label">
                                        <IconCalendar size={12} />
                                        Esperado
                                    </span>
                                    <span className="list-item-info-value">{primeraCuota?.monto ? formatMonto(primeraCuota.monto) : formatMonto(getEsperadoSemana())}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="list-item-info">
                <div className="list-item-info-item info-total">
                    <span className="list-item-info-label">
                        <IconMoneybag size={14} />
                        Total
                    </span>
                    <span className="list-item-info-value">{formatMonto(getMontoTotal())}</span>
                </div>
                <div className="list-item-info-item info-pendiente">
                    <span className="list-item-info-label">
                        <IconTrendingDown size={14} />
                        Pendiente
                    </span>
                    <span className="list-item-info-value">{formatMonto(getSaldoPendiente())}</span>
                </div>
                {hasSaldoVencido && (
                    <div className="list-item-info-item info-vencido">
                        <span className="list-item-info-label">
                            <IconAlertCircle size={14} />
                            Vencido
                        </span>
                        <span className="list-item-info-value">{formatMonto(saldoVencido)}</span>
                    </div>
                )}
                {!esPrestamoVencido() && (
                    <div className="list-item-info-item info-esperado">
                        <span className="list-item-info-label">
                            <IconCalendar size={14} />
                            Esperado
                        </span>
                        {editable ? (
                            <div className="list-item-esperado-edicion">
                                <div className="d-flex gap-2 align-items-center position-relative">
                                    <Form.Select
                                        size="sm"
                                        value={cuotaSeleccionada || ""}
                                        onChange={(e) => {
                                            onCuotaSeleccionChange && onCuotaSeleccionChange(item._id, e.target.value)
                                        }}
                                        className="select-cuota-esperado"
                                    >
                                        <option value="">Seleccionar cuota</option>
                                        {planDeCuotas?.planDeCuotas?.map(cuota => {
                                            return (
                                                <option key={cuota.numeroCuota} value={cuota.numeroCuota}>
                                                    Cuota {cuota.numeroCuota} - {formatMonto(cuota.montoCuota)}
                                                </option>
                                            )
                                        })}
                                    </Form.Select>
                                    {loadingPlan && (
                                        <Spinner size="sm" animation="border" />
                                    )}
                                </div>
                                {cuotaSeleccionada && (
                                    <div className="mt-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="text-muted small">Monto esperado:</span>
                                            <span className="fw-bold text-primary">
                                                {formatMonto(montosEsperados[item._id] || 0)}
                                            </span>
                                        </div>
                                        {planDeCuotas?.planDeCuotas && (
                                            <small className="text-muted d-block mt-1">
                                                Cuota {cuotaSeleccionada}:
                                                {planDeCuotas.planDeCuotas.find(c => c.numeroCuota === cuotaSeleccionada)?.fechaVencimiento &&
                                                    ` Vence: ${formatDate(planDeCuotas.planDeCuotas.find(c => c.numeroCuota === cuotaSeleccionada).fechaVencimiento)}`}
                                            </small>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="list-item-esperado-content">
                                <span className="list-item-info-value">{primeraCuota?.monto ? formatMonto(primeraCuota.monto) : formatMonto(getEsperadoSemana())}</span>
                                {primeraCuota?.fechaVencimiento && (
                                    <span className="list-item-esperado-fecha">{formatDate(primeraCuota.fechaVencimiento)}</span>
                                )}
                            </div>
                        )}
                    </div>
                )}
                {item?.deudaArrastrada > 0 && (
                    <div className="list-item-info-item info-deuda-ant">
                        <span className="list-item-info-label">
                            <IconAlertTriangle size={14} />
                            Deuda Ant.
                        </span>
                        <span className="list-item-info-value fw-bold">
                            {formatMonto(item.deudaArrastrada)}
                        </span>
                    </div>
                )}
                <div className="list-item-info-item info-cobrado">
                    <span className="list-item-info-label text-success">
                        <IconCash size={14} />
                        Cobrado
                    </span>
                    {editableMonto ? (
                        <Form.Control
                            type="number"
                            size="sm"
                            min={0}
                            step={0.01}
                            value={montoValor}
                            onChange={(e) => onMontoChange?.(e.target.value)}
                        />
                    ) : (
                        <span className="list-item-info-value text-success fw-bold">
                            {formatMonto(getMontoCobrado())}
                        </span>
                    )}
                </div>
                {showGuardarItem && item.estado !== "cargado" ? (
                    <div className="list-item-info-item list-item-info-item-fixed">
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={onGuardarItem}
                            disabled={guardandoItem}
                            className="d-flex align-items-center"
                        >
                            {guardandoItem ? <Spinner animation="border" size="sm" className="me-2" /> : null}
                            Guardar
                        </Button>
                    </div>
                ) : null}
                {showCargar && item.estado !== "cargado" && (
                    <div className="list-item-info-item list-item-info-item-fixed">
                        <Button
                            variant="success"
                            size="sm"
                            onClick={onCargar}
                            disabled={cargando}
                            className="d-flex align-items-center"
                        >
                            {cargando ? <Spinner animation="border" size="sm" className="me-2" /> : null}
                            Cargar
                        </Button>
                    </div>
                )}
                {showEliminar && (
                    <div className="list-item-info-item list-item-info-item-fixed">
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => onEliminar?.(item._id)}
                            className="d-flex align-items-center"
                        >
                            <IconTrash size={14} className="me-1" />
                            Eliminar
                        </Button>
                    </div>
                )}
                {modoEliminacion && (
                    <div className="list-item-info-item list-item-info-item-fixed">
                        <Button
                            variant={seleccionado ? "danger" : "outline-secondary"}
                            size="sm"
                            onClick={() => onSeleccionar?.(item._id)}
                            className="d-flex align-items-center"
                        >
                            <IconCheck size={14} className="me-1" />
                            {seleccionado ? "Seleccionado" : "Seleccionar"}
                        </Button>
                    </div>
                )}
                {modoTraslado && (
                    <div className="list-item-info-item list-item-info-item-fixed">
                        <Button
                            variant={seleccionado ? "success" : "outline-secondary"}
                            size="sm"
                            onClick={() => onSeleccionar?.(item._id)}
                            className="d-flex align-items-center"
                        >
                            <IconCheck size={14} className="me-1" />
                            {seleccionado ? "Seleccionado" : "Seleccionar"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
export default TablaSemanalListItem
