"use client"
import { useMemo } from "react"
import { Button, Spinner, Container, Alert } from "react-bootstrap"
import { useLocation, useParams } from "react-router-dom"
import { IconX, IconEdit, IconPlus, IconArrowRight, IconTrash, IconCheck, IconLock, IconLockOpen, IconClipboardList } from "@tabler/icons-react"
import "./DetalleTablaSemanal.css"
import PageLoading from "../../componentes/ui/PageLoading"
import TablaSemanalInfoSection from "./componentes/TablaSemanalInfoSection"
import TablaSemanalItemsList from "./componentes/TablaSemanalItemsList"
import ModalAgregarItem from "./modales/ModalAgregarItem"
import ModalTrasladoItems from "./modales/ModalTrasladoItems"
import { useDetalleTablaSemanal } from "../../hooks/useDetalleTablaSemanal"
import { useAuth } from "../../context/AuthContext"
import useReportesPDF from "../../hooks/useReportesPDF.jsx"
const DetalleTablaSemanal = () => {
  const location = useLocation()
  const { user } = useAuth()
  const { id } = useParams()
  const { reporteTablaSemanal, reportePlanillaCobrador } = useReportesPDF()
  const modoCobrador = useMemo(() => {
    const fromState = location?.state?.modoCobrador
    if (typeof fromState === "boolean") return fromState
    return user?.rol === "cobrador"
  }, [location?.state?.modoCobrador, user?.rol])
  const {
    tablaLocal,
    loading,
    saving,
    error,
    modoEdicionAdmin,
    setModoEdicionAdmin,
    showModalAgregarItem,
    setShowModalAgregarItem,
    modoTraslado,
    setModoTraslado,
    itemsSeleccionados,
    showModalTraslado,
    setShowModalTraslado,
    modoEliminacion,
    montos,
    planesDeCuotas,
    cuotasSeleccionadas,
    loadingPlanes,
    montosEsperados,
    forceUpdate,
    handleTablaActualizada,
    handleMontoChange,
    handleMontoEsperadoChange,
    obtenerPlanDeCuotas,
    handleCuotaSeleccionChange,
    handleGuardarEdicionAdmin,
    handleCerrarTablaAdmin,
    handleAbrirTablaAdmin,
    handleItemAgregado,
    handleEliminarItem,
    handleToggleTraslado,
    handleToggleEliminacion,
    handleSeleccionarItem,
    handleListoTraslado,
    handleEliminarSeleccionados,
    handleTrasladoCompleto,
    handleActualizarTablas
  } = useDetalleTablaSemanal(id)
  const handleDescargarPDF = () => reporteTablaSemanal(id)
  const handleDescargarPlanilla = () => reportePlanillaCobrador(id)
  if (loading) return <PageLoading message="Cargando detalles de la tabla..." />
  if (error) return <Alert variant="danger">{error}</Alert>
  return (
    <Container fluid className="px-0">
      <div className="modal-detalles-tabla detalle-tabla-semanal-page">
        <div className="modal-detalles-header d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <h5 className="mb-0 d-flex align-items-center gap-2">
              <span className="d-none d-md-inline">Detalles de la Tabla Semanal </span>
              {tablaLocal?.numeroTabla && <span className="text-success fw-bold">#{tablaLocal.numeroTabla}</span>}
              {tablaLocal?.cobrador && (
                <span className="badge detalle-tabla-cobrador-badge px-3 py-2 ms-2">
                  {tablaLocal.cobrador.nombre || tablaLocal.cobrador.email}
                </span>
              )}
            </h5>
          </div>
          <div className="d-flex align-items-center gap-2">
            {modoEdicionAdmin && (
              <>
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleGuardarEdicionAdmin}
                  disabled={saving}
                  className="modal-header-button btn-guardar"
                >
                  {saving ? <Spinner animation="border" size="sm" className="me-2" /> : <IconCheck size={14} />}
                  <span className="btn-text d-none d-md-inline ms-1">Guardar cambios</span>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setModoEdicionAdmin(false)}
                  className="modal-header-button btn-cancelar"
                >
                  <span className="btn-icon"><IconX size={14} /></span>
                  <span className="btn-text d-none d-md-inline ms-1">Cancelar</span>
                </Button>
              </>
            )}
            {modoTraslado && (
              <Button variant="info" size="sm" onClick={handleToggleTraslado} className="modal-header-button btn-trasladar">
                <span className="btn-icon"><IconArrowRight size={14} /></span>
                <span className="btn-text d-none d-md-inline ms-1">Cancelar</span>
              </Button>
            )}
            {modoEliminacion && (
              <Button variant="danger" size="sm" onClick={handleToggleEliminacion} className="modal-header-button btn-eliminar">
                <span className="btn-icon"><IconTrash size={14} /></span>
                <span className="btn-text d-none d-md-inline ms-1">Cancelar</span>
              </Button>
            )}
            {!modoCobrador && !modoEdicionAdmin && !modoTraslado && !modoEliminacion && (
              <>
                <Button variant="primary" size="sm" onClick={() => setModoEdicionAdmin(true)} className="modal-header-button btn-editar">
                  <span className="btn-icon"><IconEdit size={14} /></span>
                  <span className="btn-text d-none d-md-inline ms-1">Editar</span>
                </Button>
                <Button variant="success" size="sm" onClick={() => setShowModalAgregarItem(true)} className="modal-header-button btn-agregar-header">
                  <span className="btn-icon"><IconPlus size={14} /></span>
                  <span className="btn-text d-none d-md-inline ms-1">Agregar</span>
                </Button>
                <Button variant="info" size="sm" onClick={handleToggleTraslado} className="modal-header-button btn-trasladar">
                  <span className="btn-icon"><IconArrowRight size={14} /></span>
                  <span className="btn-text d-none d-md-inline ms-1">Trasladar</span>
                </Button>
                <Button variant="danger" size="sm" onClick={handleToggleEliminacion} className="modal-header-button btn-eliminar">
                  <span className="btn-icon"><IconTrash size={14} /></span>
                  <span className="btn-text d-none d-md-inline ms-1">Eliminar</span>
                </Button>
                <Button
                  variant="light"
                  size="sm"
                  onClick={tablaLocal?.estado === "cerrada" ? handleAbrirTablaAdmin : handleCerrarTablaAdmin}
                  disabled={saving}
                  className="modal-header-button btn-cerrar"
                >
                  <span className="btn-icon">
                    {tablaLocal?.estado === "cerrada" ? <IconLockOpen size={14} /> : <IconLock size={14} />}
                  </span>
                  {saving ? <Spinner animation="border" size="sm" className="me-2" /> : null}
                  <span className="btn-text d-none d-md-inline ms-1">
                    {tablaLocal?.estado === "cerrada" ? "Abrir tabla" : "Cerrar tabla"}
                  </span>
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="modal-detalles-body">
          <TablaSemanalInfoSection tabla={tablaLocal} />
          <TablaSemanalItemsList
            key={forceUpdate}
            tabla={tablaLocal}
            modoCobrador={modoCobrador}
            onTablaActualizada={handleTablaActualizada}
            modoEdicionAdmin={modoEdicionAdmin}
            onGuardarEdicionAdmin={() => { }}
            onEliminarItem={handleEliminarItem}
            modoTraslado={modoTraslado}
            modoEliminacion={modoEliminacion}
            itemsSeleccionados={itemsSeleccionados}
            onSeleccionarItem={handleSeleccionarItem}
            montos={montos}
            onMontoChange={handleMontoChange}
            saving={saving}
            error={error}
            planesDeCuotas={planesDeCuotas}
            cuotasSeleccionadas={cuotasSeleccionadas}
            onCuotaSeleccionChange={handleCuotaSeleccionChange}
            onObtenerPlanDeCuotas={obtenerPlanDeCuotas}
            loadingPlanes={loadingPlanes}
            montosEsperados={montosEsperados}
            onMontoEsperadoChange={handleMontoEsperadoChange}
          />
        </div>
        <div className="modal-detalles-footer d-flex align-items-center gap-2">
          {modoTraslado && (
            <Button variant="success" onClick={handleListoTraslado} disabled={itemsSeleccionados.length === 0} className="d-flex align-items-center">
              Listo ({itemsSeleccionados.length})
            </Button>
          )}
          {modoEliminacion && (
            <Button variant="danger" onClick={handleEliminarSeleccionados} disabled={itemsSeleccionados.length === 0} className="d-flex align-items-center">
              Eliminar ({itemsSeleccionados.length})
            </Button>
          )}
          <Button variant="outline-secondary" onClick={handleDescargarPlanilla} className="d-flex align-items-center ms-auto">
            <IconClipboardList size={16} className="me-1" />
            Planilla Cobrador
          </Button>
          <Button variant="success" onClick={handleDescargarPDF} className="d-flex align-items-center">
            <IconCheck size={16} className="me-1" />
            Descargar PDF
          </Button>
        </div>
        <ModalAgregarItem
          show={showModalAgregarItem}
          onHide={() => setShowModalAgregarItem(false)}
          tabla={tablaLocal}
          onItemAgregado={handleItemAgregado}
        />
        <ModalTrasladoItems
          show={showModalTraslado}
          onHide={() => setShowModalTraslado(false)}
          itemsSeleccionados={itemsSeleccionados}
          tablaOrigen={tablaLocal}
          onTrasladoCompleto={handleTrasladoCompleto}
          onActualizarTablas={handleActualizarTablas}
        />
      </div>
    </Container>
  )
}
export default DetalleTablaSemanal
