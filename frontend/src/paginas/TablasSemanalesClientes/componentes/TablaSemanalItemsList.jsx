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
  if (!items.length) {
    return (
      <div className="tabla-semanal-empty">
        <p className="text-muted small mb-0">Esta tabla no tiene items de préstamos.</p>
      </div>
    )
  }
  return (
    <div className="tabla-semanal-items-list">
      {error && <p className="text-danger small mb-2">{error}</p>}
      {items.map((it) => {
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
      })}
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
