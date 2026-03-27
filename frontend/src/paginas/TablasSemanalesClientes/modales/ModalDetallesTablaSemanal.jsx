"use client"
import { Modal, Button, Spinner } from "react-bootstrap"
      <Modal.Header closeButton className="modal-detalles-header">
        <Modal.Title className="d-flex align-items-center gap-2">
          <span className="d-none d-md-inline">Detalles de la Tabla Semanal</span>
          {tabla.cobrador && (
            <span className="badge bg-white text-success px-3 py-2">
              {tabla.cobrador.nombre || tabla.cobrador.email}
            </span>
          )}
          {modoEdicionAdmin && (
            <div className="d-flex align-items-center gap-2 ms-auto">
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
            </div>
          )}
          {modoTraslado && (
            <div className="d-flex align-items-center gap-2 ms-auto">
              <Button
                variant="info"
                size="sm"
                onClick={handleToggleTraslado}
                className="modal-header-button btn-trasladar"
              >
                <span className="btn-icon"><IconArrowRight size={14} /></span>
                <span className="btn-text d-none d-md-inline ms-1">Cancelar</span>
              </Button>
            </div>
          )}
          {modoEliminacion && (
            <div className="d-flex align-items-center gap-2 ms-auto">
              <Button
                variant="danger"
                size="sm"
                onClick={handleToggleEliminacion}
                className="modal-header-button btn-eliminar"
              >
                <span className="btn-icon"><IconTrash size={14} /></span>
                <span className="btn-text d-none d-md-inline ms-1">Cancelar</span>
              </Button>
            </div>
          )}
          {!modoCobrador && !modoEdicionAdmin && !modoTraslado && !modoEliminacion && (
            <div className="d-flex align-items-center gap-2 ms-auto">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setModoEdicionAdmin(true)}
                className="modal-header-button btn-editar"
              >
                <span className="btn-icon"><IconEdit size={14} /></span>
                <span className="btn-text d-none d-md-inline ms-1">Editar</span>
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={() => setShowModalAgregarItem(true)}
                className="modal-header-button btn-agregar"
              >
                <span className="btn-icon"><IconPlus size={14} /></span>
                <span className="btn-text d-none d-md-inline ms-1">Agregar</span>
              </Button>
              <Button
                variant="info"
                size="sm"
                onClick={handleToggleTraslado}
                className="modal-header-button btn-trasladar"
              >
                <span className="btn-icon"><IconArrowRight size={14} /></span>
                <span className="btn-text d-none d-md-inline ms-1">Trasladar</span>
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleToggleEliminacion}
                className="modal-header-button btn-eliminar"
              >
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
            </div>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-detalles-body">
        <TablaSemanalInfoSection tabla={tablaLocal} />
        <TablaSemanalItemsList
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
      </Modal.Body>
      <Modal.Footer className="modal-detalles-footer">
        {modoTraslado && (
          <Button
            variant="success"
            onClick={handleListoTraslado}
            disabled={itemsSeleccionados.length === 0}
            className="d-flex align-items-center"
          >
            Listo ({itemsSeleccionados.length})
          </Button>
        )}
        {modoEliminacion && (
          <Button
            variant="danger"
            onClick={handleEliminarSeleccionados}
            disabled={itemsSeleccionados.length === 0}
            className="d-flex align-items-center"
          >
            Eliminar ({itemsSeleccionados.length})
          </Button>
        )}
        <Button
          variant="outline-secondary"
          onClick={handleDescargarPlanilla}
          className="d-flex align-items-center ms-auto"
        >
          <IconClipboardList size={16} className="me-1" />
          Planilla Cobrador
        </Button>
        <Button
          variant="success"
          onClick={handleDescargarPDF}
          className="d-flex align-items-center"
        >
          <IconCheck size={16} className="me-1" />
          Descargar PDF
        </Button>
        <Button variant="secondary" onClick={onHide} className="d-flex align-items-center btn-custom">
          <IconX size={16} className="me-1" />
          Cerrar
        </Button>
      </Modal.Footer>
      {}
      <ModalAgregarItem
        show={showModalAgregarItem}
        onHide={() => setShowModalAgregarItem(false)}
        tabla={tabla}
        onItemAgregado={handleItemAgregado}
      />
      {}
      <ModalTrasladoItems
        show={showModalTraslado}
        onHide={() => setShowModalTraslado(false)}
        itemsSeleccionados={itemsSeleccionados}
        tablaOrigen={tabla}
        onTrasladoCompleto={handleTrasladoCompleto}
        onActualizarTablas={handleActualizarTablas}
      />
    </Modal>
  )
}
export default ModalDetallesTablaSemanal
