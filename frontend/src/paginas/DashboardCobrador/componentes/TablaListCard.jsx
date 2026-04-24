import { Card, Button } from "react-bootstrap"
import { IconMapPin, IconDeviceFloppy } from "@tabler/icons-react"
import { useNavigate } from "react-router-dom"
import "./TablaListCard.css"

const TablaListCard = ({
    title,
    count,
    montoTotal,
    items,
    icon: IconType,
    variant,
    emptyMessage,
    emptyIcon: EmptyIconType,
    getDireccionCobroFinal,
    montosInline,
    handleMontoInlineChange,
    handleGuardarMontoInline,
    savingInline,
    tablaId
}) => {
    const navigate = useNavigate();

    const handleNavigateToPrestamo = (prestamoId) => {
        if (prestamoId) {
            navigate(`/prestamo/${prestamoId}`);
        }
    };

    return (
        <Card className={`border-0 shadow-sm tabla-list-card ${variant ? `tabla-list-card--${variant}` : ""}`}>
            <Card.Header className="border-0 bg-transparent py-3">
                <div className="d-flex align-items-center">
                    <div
                        className="me-3 tabla-list-iconbox"
                    >
                        <IconType size={20} className="tabla-list-iconbox__svg" />
                    </div>
                    <div className="flex-grow-1">
                        <h6 className="mb-0 fw-semibold tabla-list-title">
                            {title}
                        </h6>
                        <small className="text-muted tabla-list-subtitle">
                            {count || 0} items
                        </small>
                    </div>
                </div>
                {montoTotal > 0 && (
                    <div className="mt-3 pt-3 border-top tabla-list-total">
                        <div className="text-center">
                            <div className="h5 mb-1 fw-bold tabla-list-total-value">
                                ${montoTotal.toLocaleString()}
                            </div>
                            <small className="text-muted tabla-list-total-label">
                                Total {title.toLowerCase()}
                            </small>
                        </div>
                    </div>
                )}
            </Card.Header>
            <Card.Body className="pt-0">
                {items?.length > 0 ? (
                    <div className="tabla-list-scroll">
                        {items.map((item, index) => (
                            <div key={index} className="d-flex align-items-start p-2 rounded-2 mb-2 tabla-list-item">
                                <div className="flex-grow-1 pe-2" style={{ minWidth: 0 }}>
                                    <div 
                                        className="d-flex justify-content-between align-items-start"
                                        onClick={() => handleNavigateToPrestamo(item.prestamo?._id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="flex-grow-1">
                                            <div className="fw-medium text-truncate tabla-list-item-title">
                                                {item.cliente?.nombre || "Cliente"}
                                            </div>
                                            <div className="small text-muted tabla-list-item-meta">
                                                Préstamo {item.prestamo?.numero || "N/A"} • {item.zona?.nombre || "N/A"}
                                            </div>
                                            <div className="small text-muted tabla-list-item-location">
                                                <IconMapPin size={12} className="tabla-list-map-pin" />
                                                {getDireccionCobroFinal(item.cliente)}
                                            </div>
                                            <div className="d-flex gap-2 mb-1 flex-wrap">
                                                {item.deudaArrastrada > 0 && (
                                                    <span className="badge bg-danger text-white border tabla-list-pill">Atrasado: ${item.deudaArrastrada?.toLocaleString()}</span>
                                                )}
                                                <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle tabla-list-pill">Saldo: ${item.saldoPendiente?.toLocaleString() || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-2 mt-1">
                                        <input
                                            type="number"
                                            className="form-control form-control-sm tabla-list-inline-input"
                                            value={montosInline[item.prestamo?._id] ?? item.montoCobrado ?? ""}
                                            onChange={(e) => handleMontoInlineChange(item.prestamo?._id, e.target.value)}
                                        />
                                        <Button
                                            size="sm"
                                            variant="primary"
                                            className="p-1 d-flex align-items-center justify-content-center tabla-list-inline-btn"
                                            disabled={!tablaId || !item.prestamo?._id || savingInline[item.prestamo?._id]}
                                            onClick={() => handleGuardarMontoInline(item.prestamo?._id)}
                                        >
                                            <IconDeviceFloppy size={16} />
                                        </Button>
                                    </div>
                                </div>
                                <div 
                                    className="text-end ms-2 tabla-list-right"
                                    onClick={() => handleNavigateToPrestamo(item.prestamo?._id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {title === "Vencidos" ? (
                                        <>
                                            <div className="fw-bold text-danger tabla-list-right-amount" style={{ fontSize: '1rem' }}>
                                                ${item.saldoPendienteVencimiento?.toLocaleString() || 0}
                                            </div>
                                            <div className="small text-muted fw-medium tabla-list-right-cuota" style={{ color: '#94a3b8' }}>
                                                Cuota: ${item.montoCuota?.toLocaleString() || 0}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="fw-semibold tabla-list-right-amount">
                                                ${item.monto?.toLocaleString() || 0}
                                            </div>
                                            <div className="small text-muted tabla-list-right-date">
                                                {item.fechaVencimiento ? new Date(item.fechaVencimiento).toLocaleDateString() : "-"}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <div className="mb-2 tabla-list-empty-icon">
                            <EmptyIconType size={32} className="tabla-list-empty-icon__svg" />
                        </div>
                        <small className="text-muted tabla-list-empty-text">
                            {emptyMessage}
                        </small>
                    </div>
                )}
            </Card.Body>
        </Card>
    )
}
export default TablaListCard
