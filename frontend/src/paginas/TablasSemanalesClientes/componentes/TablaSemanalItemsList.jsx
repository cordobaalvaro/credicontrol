import { Button, Spinner } from "react-bootstrap"
import "./TablaSemanalItemsList.css"
import { useTablaSemanalItemsList } from "../../../hooks/useTablaSemanalItemsList"
import TablaSemanalListItem from "./TablaSemanalListItem"
const TablaSemanalItemsList = ({
  tabla,
  modoCobrador = false,
  onTablaActualizada,
  modoEdicionAdmin = false,
  onGuardarEdicionAdmin,
  onEliminarItem,
  modoTraslado = false,
  modoEliminacion = false,
  itemsSeleccionados = [],
  onSeleccionarItem,
  montos: externalMontos,
  onMontoChange: externalMontoChange,
  saving: externalSaving,
  error: externalError,
  planesDeCuotas = {},
  cuotasSeleccionadas = {},
  onCuotaSeleccionChange,
  onObtenerPlanDeCuotas,
  loadingPlanes = {},
  montosEsperados = {},
  onMontoEsperadoChange
}) => {
  const items = Array.isArray(tabla?.items) ? tabla.items : []
  const {
    montos,
    saving: hookSaving,
    error: hookError,
    cargandoItemId,
    guardandoItemId,
    handleMontoChange,
    handleGuardarItemCobrador,
    handleCerrarTablaCobrador,
    handleCargarItem
  } = useTablaSemanalItemsList({
    tabla,
    items,
    modoCobrador,
    modoEdicionAdmin,
    onTablaActualizada,
    onGuardarEdicionAdmin,
    externalMontos,
    externalMontoChange,
  })
  const saving = externalSaving || hookSaving
  const error = externalError || hookError
  const puedeEditarCobrador = modoCobrador && tabla?.estado === "enviada"
  const puedeCerrarCobrador =
    modoCobrador &&
    tabla?.estado === "enviada" &&
    items.length > 0 &&
    items.every((it) => ["reportado", "cargado"].includes(it.estado))
  const puedeCerrarAdmin =
    modoEdicionAdmin &&
    tabla?.estado === "enviada" &&
    items.length > 0 &&
    items.every((it) => ["reportado", "cargado"].includes(it.estado))
  const itemsProgramados = items.filter((it) => it.prestamo?.estado !== "vencido")
  const itemsVencidos = items.filter((it) => it.prestamo?.estado === "vencido")

  if (items.length === 0) {
    return (
      <div className="tabla-semanal-empty text-center p-4">
        <p className="text-muted small mb-0">Esta tabla no tiene items de préstamos activos ni vencidos.</p>
      </div>
    )
  }

  const renderItem = (it) => {
    const prestamoId = it.prestamo?._id || it.prestamo
    return (
      <TablaSemanalListItem
        key={it._id}
        item={it}
        editable={false}
        editableMonto={(puedeEditarCobrador && it.estado !== "cargado") || modoEdicionAdmin}
        montoValor={montos[it._id] !== undefined ? montos[it._id] : it.montoCobrado ?? 0}
        onMontoChange={(valor) => handleMontoChange(it._id, valor)}
        showGuardarItem={puedeEditarCobrador && it.estado !== "cargado"}
        onGuardarItem={() => handleGuardarItemCobrador(it)}
        guardandoItem={guardandoItemId === it._id}
        showCargar={!modoCobrador && tabla.estado === "cerrada" && it.estado !== "cargado"}
        onCargar={() => handleCargarItem(it)}
        cargando={cargandoItemId === it._id}
        showEliminar={modoEliminacion}
        onEliminar={onEliminarItem}
        modoTraslado={modoTraslado}
        modoEliminacion={modoEliminacion}
        seleccionado={itemsSeleccionados.includes(it._id)}
        onSeleccionar={onSeleccionarItem}
        planDeCuotas={planesDeCuotas[prestamoId] || null}
        cuotaSeleccionada={cuotasSeleccionadas[it._id] || null}
        onCuotaSeleccionChange={onCuotaSeleccionChange}
        onObtenerPlanDeCuotas={onObtenerPlanDeCuotas}
        loadingPlan={loadingPlanes[prestamoId] || false}
        montosEsperados={montosEsperados}
        onMontoEsperadoChange={onMontoEsperadoChange}
      />
    )
  }

  return (
    <div className="tabla-semanal-items-list">
      {error && <p className="text-danger small mb-2">{error}</p>}

      {itemsProgramados.length > 0 && (
        <div className="mb-4">
          <h6 className="text-primary mb-3 d-flex align-items-center">
            <i className="bi bi-calendar-check me-2"></i>
            Cuotas de esta semana
          </h6>
          {itemsProgramados.map(renderItem)}
        </div>
      )}

      {itemsVencidos.length > 0 && (
        <div className="mb-4">
          <h6 className="text-danger mb-3 d-flex align-items-center">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Préstamos Vencidos (Recordatorio)
          </h6>
          <div className="vencidos-warning-banner mb-3 p-2 bg-danger bg-opacity-10 text-danger rounded border border-danger border-opacity-20 small">
            Estos préstamos están vencidos. Puedes cargar cobros parciales o totales que se aplicarán al saldo pendiente.
          </div>
          {itemsVencidos.map(renderItem)}
        </div>
      )}

      {(modoCobrador || modoEdicionAdmin) && tabla?.estado === "enviada" ? (
        <div className="mt-3 d-flex justify-content-end gap-2">
          <Button
            variant={(modoCobrador ? puedeCerrarCobrador : puedeCerrarAdmin) ? "success" : "secondary"}
            size="sm"
            onClick={handleCerrarTablaCobrador}
            disabled={saving || (modoCobrador ? !puedeCerrarCobrador : !puedeCerrarAdmin)}
            className="d-flex align-items-center"
            title={(modoCobrador ? !puedeCerrarCobrador : !puedeCerrarAdmin) ? "Guardá todos los items antes de cerrar" : ""}
          >
            {saving ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            Cerrar tabla
          </Button>
        </div>
      ) : null}
    </div>
  )
}
export default TablaSemanalItemsList
