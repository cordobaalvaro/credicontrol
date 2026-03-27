import { useState } from "react"
import { tablaSemanalService } from "../services"
import Swal from "sweetalert2"
export const useTablaSemanalItemsList = ({
    tabla,
    items,
    modoCobrador,
    modoEdicionAdmin,
    onTablaActualizada,
    onGuardarEdicionAdmin,
    externalMontos,
    externalMontoChange,
}) => {
    const [internalMontos, setInternalMontos] = useState(() => {
        const initial = {}
        for (const it of items) {
            if (!it?._id) continue
            initial[it._id] = it.montoCobrado ?? 0
        }
        return initial
    })
    const [saving, setSaving] = useState(false)
    const [cargandoItemId, setCargandoItemId] = useState(null)
    const [guardandoItemId, setGuardandoItemId] = useState(null)
    const [error, setError] = useState("")
    const montos = externalMontos || internalMontos
    const handleMontoChange = externalMontoChange || ((itemId, valor) => {
        setInternalMontos(prev => ({
            ...prev,
            [itemId]: valor
        }))
    })
    const handleGuardar = async () => {
        try {
            setSaving(true)
            setError("")
            const itemsMontos = items
                .filter((it) => it?.estado !== "cargado")
                .map((it) => {
                    const nuevoMonto = Number(montos[it._id] || 0)
                    const montoOriginal = it.montoCobrado || 0
                    if (nuevoMonto !== montoOriginal) {
                        return {
                            itemId: it._id,
                            prestamoId: it.prestamo?._id || it.prestamo,
                            montoCobrado: nuevoMonto,
                        }
                    }
                    return null
                })
                .filter(Boolean)
            if (modoCobrador) {
                try {
                    const response = await tablaSemanalService.actualizarMontosCobrador(tabla._id, itemsMontos);
                    if (response?.data) {
                        onTablaActualizada?.(response.data)
                    }
                } catch (err) {
                    console.error("Error al guardar montos como cobrador", err)
                }
            } else if (modoEdicionAdmin) {
                await onGuardarEdicionAdmin?.(itemsMontos)
            }
        } catch (err) {
            setError(err?.response?.data?.msg || "Error al guardar los cobros de la tabla")
        } finally {
            setSaving(false)
        }
    }
    const handleGuardarItemCobrador = async (item) => {
        try {
            const monto = Number(montos[item._id] ?? 0)
            if (Number.isNaN(monto) || monto < 0) {
                await Swal.fire({
                    icon: "error",
                    title: "Monto inválido",
                    text: "El monto debe ser mayor o igual a 0.",
                })
                return
            }
            setGuardandoItemId(item._id)
            setError("")
            const response = await tablaSemanalService.actualizarItemCobrador(tabla._id, item._id, monto);
            if (response?.data) {
                onTablaActualizada?.(response.data)
            }
        } catch (err) {
            console.error("Error al guardar item como cobrador", err)
            const msg = err?.response?.data?.msg || "No se pudo guardar el item."
            setError(msg)
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: msg,
            })
        } finally {
            setGuardandoItemId(null)
        }
    }
    const handleCerrarTablaCobrador = async () => {
        try {
            const confirm = await Swal.fire({
                title: "¿Cerrar tabla semanal?",
                text: "Una vez cerrada, no vas a poder editar ni cargar más montos. Quedará para que el administrador procese los cobros.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, cerrar",
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#2563eb",
                cancelButtonColor: "#6c757d",
            })
            if (!confirm.isConfirmed) return
            setSaving(true)
            setError("")
            const response = await tablaSemanalService.cerrarTablaCobrador(tabla._id);
            if (response?.data) {
                onTablaActualizada?.(response.data)
                await Swal.fire({
                    icon: "success",
                    title: "Tabla cerrada",
                    text: "La tabla fue cerrada correctamente.",
                    timer: 1500,
                    showConfirmButton: false,
                })
            }
        } catch (err) {
            console.error("Error al cerrar tabla como cobrador", err)
            const msg = err?.response?.data?.msg || "No se pudo cerrar la tabla."
            setError(msg)
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: msg,
            })
        } finally {
            setSaving(false)
        }
    }
    const handleCargarItem = async (item) => {
        try {
            const monto = Number(montos[item._id] ?? item.montoCobrado ?? 0)
            const confirm = await Swal.fire({
                title: "¿Cargar cobro?",
                text: "Se aplicará el cobro al préstamo y no podrás volver a cargar este item.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, cargar",
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#16a34a",
                cancelButtonColor: "#6c757d",
            })
            if (!confirm.isConfirmed) return
            if (Number.isNaN(monto) || monto <= 0) {
                await Swal.fire({
                    icon: "error",
                    title: "Monto inválido",
                    text: "El monto debe ser mayor a 0.",
                })
                return
            }
            setCargandoItemId(item._id)
            setError("")
            const response = await tablaSemanalService.cargarItem(tabla._id, item._id);
            if (response?.data) {
                onTablaActualizada?.(response.data)
                await Swal.fire({
                    icon: "success",
                    title: "Cargado",
                    text: "El cobro se cargó correctamente.",
                    timer: 1500,
                    showConfirmButton: false,
                })
            }
        } catch (err) {
            console.error("Error al cargar item", err)
            const msg = err?.response?.data?.msg || "No se pudo cargar el cobro."
            setError(msg)
            await Swal.fire({
                icon: "error",
                title: "Error",
                text: msg,
            })
        } finally {
            setCargandoItemId(null)
        }
    }
    return {
        montos,
        saving,
        error,
        cargandoItemId,
        guardandoItemId,
        handleMontoChange,
        handleGuardar,
        handleGuardarItemCobrador,
        handleCerrarTablaCobrador,
        handleCerrarTablaItem: handleCargarItem, 
        handleCargarItem
    }
}
