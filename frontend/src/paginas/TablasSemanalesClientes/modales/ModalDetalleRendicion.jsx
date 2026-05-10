import { useState, useEffect } from "react"
import { Modal, Button, Table, Badge, Form, Spinner } from "react-bootstrap"
import { IconCash, IconCalendarTime, IconCheck, IconEdit, IconX, IconTrash } from "@tabler/icons-react"
import Swal from "sweetalert2"
import { tablaSemanalService } from "../../../services/tablaSemanal.service"
import { useAuth } from "../../../context/AuthContext"

const ModalDetalleRendicion = ({ show, onHide, rendicion: initialRendicion, tabla, onTablaActualizada, modoCobrador }) => {
  const { user } = useAuth()
  const [rendicion, setRendicion] = useState(initialRendicion)
  const [editItemId, setEditItemId] = useState(null)
  const [editValue, setEditValue] = useState("")
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Sincronizar la rendición local si la tabla se actualiza desde el padre
  useEffect(() => {
    if (show && initialRendicion && tabla?.rendiciones) {
      const updated = tabla.rendiciones.find(r => r._id === initialRendicion._id)
      if (updated) setRendicion(updated)
      else setRendicion(initialRendicion)
    }
  }, [show, initialRendicion, tabla?.rendiciones])

  if (!rendicion) return null

  const totalRendido = rendicion.items?.reduce((sum, it) => sum + (it.montoCobrado || 0), 0) || 0

  const canEdit = (item) => {
    if (!tabla || !rendicion) return false
    const isAdmin = user?.rol === "admin"
    const isCobrador = user?.rol === "cobrador"
    const isCargada = rendicion.estado === "cargada"
    const isCerrada = tabla.estado === "cerrada"

    // El admin puede editar siempre
    if (isAdmin) return true
    // El cobrador puede editar si la tabla no está cerrada y la rendición no fue procesada
    if (isCobrador && !isCerrada && !isCargada) return true
    
    return false
  }

  const canDeleteReport = () => {
    if (!tabla || !rendicion) return false
    const isAdmin = user?.rol === "admin"
    const isCobrador = user?.rol === "cobrador"
    const isCargada = rendicion.estado === "cargada"
    const isCerrada = tabla.estado === "cerrada"

    if (isAdmin) return true
    if (isCobrador && !isCerrada && !isCargada) return true
    return false
  }

  const handleEliminarRendicion = async () => {
    try {
      const result = await Swal.fire({
        title: "¿Eliminar esta jornada?",
        text: "Los cobros de esta jornada volverán a estar pendientes en la tabla principal. Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar jornada",
        cancelButtonText: "Cancelar"
      })

      if (!result.isConfirmed) return

      setDeleting(true)
      const res = await tablaSemanalService.eliminarRendicion(tabla._id, rendicion._id)
      
      Swal.fire({
        icon: "success",
        title: "Eliminada",
        text: "La jornada ha sido eliminada correctamente",
        timer: 1500,
        showConfirmButton: false
      })

      if (onTablaActualizada) {
        onTablaActualizada(res.data)
      }
      onHide()
    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.msg || "Error al eliminar la jornada"
      })
    } finally {
      setDeleting(false)
    }
  }

  const handleStartEdit = (item) => {
    setEditItemId(item.itemIdOriginal)
    setEditValue(item.montoCobrado)
  }

  const handleCancelEdit = () => {
    setEditItemId(null)
    setEditValue("")
  }

  const handleSaveEdit = async (itemIdOriginal) => {
    try {
      if (editValue === "" || isNaN(editValue) || Number(editValue) < 0) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ingresa un monto válido",
          confirmButtonColor: "#3085d6",
        })
        return
      }

      setSaving(true)
      const res = await tablaSemanalService.editarItemRendicion(
        tabla._id, 
        rendicion._id, 
        itemIdOriginal, 
        Number(editValue)
      )
      
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Monto actualizado correctamente",
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: "top-end"
      })

      if (onTablaActualizada) {
        onTablaActualizada(res.data)
      }
      setEditItemId(null)
    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.msg || "Error al actualizar el monto",
        confirmButtonColor: "#3085d6",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold d-flex align-items-center justify-content-between w-100">
          <div className="d-flex align-items-center">
            <IconCalendarTime size={24} className="me-2 text-primary" />
            Detalle de Jornada - {new Date(rendicion.fechaRendicion).toLocaleDateString()}
          </div>
          {canDeleteReport() && (
            <Button 
              variant="outline-danger" 
              size="sm" 
              className="rounded-pill px-3 d-flex align-items-center me-3"
              onClick={handleEliminarRendicion}
              disabled={deleting}
            >
              {deleting ? <Spinner animation="border" size="sm" className="me-1" /> : <IconTrash size={16} className="me-1" />}
              Eliminar Jornada
            </Button>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-3">
        <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded-3">
          <div>
            <div className="small text-muted mb-1">Estado de la Rendición</div>
            <Badge bg={rendicion.estado === "cargada" ? "success" : "info"} className="rounded-pill px-3">
              {rendicion.estado === "cargada" ? "PROCESADA POR ADMIN" : "PENDIENTE DE PROCESAR"}
            </Badge>
          </div>
          <div className="text-end">
            <div className="small text-muted mb-1">Total Cobrado en esta Jornada</div>
            <div className="h4 mb-0 fw-bold text-success">${totalRendido.toLocaleString()}</div>
          </div>
        </div>

        {rendicion.observaciones && (
          <div className="mb-4 p-3 border-start border-4 border-info bg-info bg-opacity-10 rounded-end-3">
            <div className="small fw-bold text-info text-uppercase mb-1">Observaciones del Cobrador</div>
            <div className="text-dark" style={{ whiteSpace: 'pre-wrap' }}>{rendicion.observaciones}</div>
          </div>
        )}

        <h6 className="fw-bold mb-3 d-flex align-items-center">
          <IconCash size={18} className="me-2" />
          Cobros Incluidos ({rendicion.items?.length || 0})
        </h6>

        <div className="table-responsive">
          <Table hover className="align-middle">
            <thead className="bg-light">
              <tr>
                <th className="border-0 small text-muted">CLIENTE</th>
                <th className="border-0 small text-muted">PRÉSTAMO</th>
                <th className="border-0 small text-muted text-end">VALOR CUOTA</th>
                <th className="border-0 small text-muted text-end">MONTO COBRADO</th>
                <th className="border-0 small text-muted text-center" style={{ width: '100px' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {rendicion.items?.map((item, idx) => {
                const isEditing = editItemId === item.itemIdOriginal
                const editable = canEdit(item)

                return (
                  <tr key={idx}>
                    <td>
                      <div className="fw-semibold">{item.cliente?.nombre || "N/A"}</div>
                      {item.cliente?.dni && <div className="small text-muted">DNI: {item.cliente.dni}</div>}
                    </td>
                    <td>
                      <Badge bg="secondary" className="fw-normal">
                        #{item.prestamo?.numero || "N/A"}
                      </Badge>
                    </td>
                    <td className="text-end text-muted">
                      ${item.montoCuotasEsperadoSemana?.toLocaleString() || 0}
                    </td>
                    <td className="text-end">
                      {isEditing ? (
                        <Form.Control
                          type="number"
                          size="sm"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="text-end fw-bold"
                          style={{ width: '120px', marginLeft: 'auto' }}
                          autoFocus
                          disabled={saving}
                        />
                      ) : (
                        <span className="fw-bold text-success">
                          ${item.montoCobrado?.toLocaleString() || 0}
                        </span>
                      )}
                    </td>
                    <td className="text-center">
                      {editable && (
                        <div className="d-flex justify-content-center gap-1">
                          {isEditing ? (
                            <>
                              <Button 
                                variant="success" 
                                size="sm" 
                                className="p-1 rounded-circle"
                                onClick={() => handleSaveEdit(item.itemIdOriginal)}
                                disabled={saving}
                                title="Guardar"
                              >
                                {saving ? <Spinner animation="border" size="sm" /> : <IconCheck size={16} />}
                              </Button>
                              <Button 
                                variant="secondary" 
                                size="sm" 
                                className="p-1 rounded-circle"
                                onClick={handleCancelEdit}
                                disabled={saving}
                                title="Cancelar"
                              >
                                <IconX size={16} />
                              </Button>
                            </>
                          ) : (
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              className="p-1 rounded-circle"
                              onClick={() => handleStartEdit(item)}
                              title="Editar monto"
                            >
                              <IconEdit size={16} />
                            </Button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot className="bg-light">
              <tr>
                <td colSpan="3" className="fw-bold text-end py-3">TOTAL JORNADA:</td>
                <td className="fw-bold text-end text-success h5 py-3">${totalRendido.toLocaleString()}</td>
                <td></td>
              </tr>
            </tfoot>
          </Table>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="secondary" onClick={onHide} className="rounded-pill px-4" disabled={saving || deleting}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalDetalleRendicion
