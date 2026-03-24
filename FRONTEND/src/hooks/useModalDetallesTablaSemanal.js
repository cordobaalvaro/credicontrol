import { useState, useEffect } from "react"
import { tablaSemanalService } from "../services"
import Swal from "sweetalert2"

export const useModalDetallesTablaSemanal = ({
    show,
    tabla,
    onTablaActualizada,
    onActualizarTablas
}) => {
    const [modoEdicionAdmin, setModoEdicionAdmin] = useState(false)
    const [showModalAgregarItem, setShowModalAgregarItem] = useState(false)
    const [modoTraslado, setModoTraslado] = useState(false)
    const [itemsSeleccionados, setItemsSeleccionados] = useState([])
    const [showModalTraslado, setShowModalTraslado] = useState(false)
    const [modoEliminacion, setModoEliminacion] = useState(false)

    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [montos, setMontos] = useState({})

    const [planesDeCuotas, setPlanesDeCuotas] = useState({})
    const [cuotasSeleccionadas, setCuotasSeleccionadas] = useState({})
    const [loadingPlanes, setLoadingPlanes] = useState({})
    const [montosEsperados, setMontosEsperados] = useState({})
    const [forceUpdate, setForceUpdate] = useState(0)
    const [tablaLocal, setTablaLocal] = useState(tabla)

    const handleTablaActualizada = (tablaActualizada) => {
        onTablaActualizada?.(tablaActualizada)

        if (tablaActualizada && tablaActualizada.items) {
            setTablaLocal(tablaActualizada)

            const nuevosMontos = {}
            tablaActualizada.items.forEach(item => {
                if (item._id) {
                    nuevosMontos[item._id] = item.montoCobrado || 0
                }
            })
            setMontos(nuevosMontos)
        }
    }

    useEffect(() => {
        if (show && tabla?._id) {
            const obtenerTablaActualizada = async () => {
                try {
                    const response = await tablaSemanalService.getTablaById(tabla._id)
                    if (response?.data) {
                        handleTablaActualizada(response.data)
                    }
                } catch (error) {
                    console.error("Error al obtener tabla actualizada:", error)
                }
            }

            obtenerTablaActualizada()
        }
    }, [show, tabla?._id])

    useEffect(() => {
        if (show && tabla && tabla.items) {
            const montosIniciales = {}
            tabla.items.forEach(item => {
                if (item._id) {
                    montosIniciales[item._id] = item.montoCobrado || 0
                }
            })
            setMontos(montosIniciales)
            setTablaLocal(tabla)
        }
    }, [show, tabla])

    const handleMontoChange = (itemId, valor) => {
        setMontos(prev => ({
            ...prev,
            [itemId]: valor
        }))
    }

    const handleMontoEsperadoChange = (itemId, valor) => {
        setMontosEsperados(prev => ({
            ...prev,
            [itemId]: valor
        }))
    }

    const obtenerPlanDeCuotas = async (prestamoId) => {
        if (!prestamoId) return

        try {
            setLoadingPlanes(prev => ({ ...prev, [prestamoId]: true }))

            const response = await tablaSemanalService.getPlanCuotas(prestamoId)

            if (response?.data) {
                setPlanesDeCuotas(prev => ({
                    ...prev,
                    [prestamoId]: response.data
                }))
            }
        } catch (error) {
            console.error("Error al obtener plan de cuotas:", error)
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo obtener el plan de cuotas del préstamo"
            })
        } finally {
            setLoadingPlanes(prev => ({ ...prev, [prestamoId]: false }))
        }
    }

    const handleCuotaSeleccionChange = (itemId, cuotaNumero) => {
        setCuotasSeleccionadas(prev => ({
            ...prev,
            [itemId]: cuotaNumero
        }))

        if (cuotaNumero) {
            const item = (tablaLocal.items || []).find(it => it._id === itemId)
            const prestamoId = item?.prestamo?._id || item?.prestamo
            const planCuotas = planesDeCuotas[prestamoId]

            if (planCuotas?.planDeCuotas) {
                const cuotaSeleccionada = planCuotas.planDeCuotas.find(c => c.numero === Number(cuotaNumero))
                if (cuotaSeleccionada) {
                    setMontosEsperados(prev => ({
                        ...prev,
                        [itemId]: cuotaSeleccionada.montoPendiente.toString()
                    }))
                }
            }
        } else {
            setMontosEsperados(prev => {
                const newState = { ...prev }
                delete newState[itemId]
                return newState
            })
        }
    }

    const modificarEsperadoCuota = async (itemId, nuevoMontoEsperado, numeroCuota) => {
        try {
            const response = await tablaSemanalService.modificarEsperado(tablaLocal._id, itemId, {
                nuevoMontoEsperado: Number(nuevoMontoEsperado),
                numeroCuota: Number(numeroCuota)
            })

            if (response?.data) {
                onTablaActualizada?.(response.data)

                if (response.data.itemActualizado) {
                    setTablaLocal(prev => ({
                        ...prev,
                        items: (prev.items || []).map(item =>
                            item._id === response.data.itemActualizado._id
                                ? response.data.itemActualizado
                                : item
                        ),
                        montoTotalEsperado: response.data.nuevoMontoTotalEsperado
                    }))
                }

                setForceUpdate(prev => prev + 1)
                return true
            } else {
                return false
            }
        } catch (error) {
            console.error("API ERROR:", error?.response?.status, error?.response?.data?.msg || error.message)
            const mensaje = error?.response?.data?.msg || "Error al modificar el monto esperado"
            Swal.fire({
                icon: "error",
                title: "Error",
                text: mensaje
            })
            return false
        }
    }

    const handleGuardarEdicionAdmin = async () => {
        try {
            setSaving(true)
            setError("")

            const promesasModificarEsperados = []
            const itemsModificados = []

            const itemsMontosCobrado = (tablaLocal.items || [])
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

            if (itemsMontosCobrado.length > 0) {
                const promesaMontosCobrado = tablaSemanalService.actualizarMontos(tablaLocal._id, itemsMontosCobrado)
                promesasModificarEsperados.push(promesaMontosCobrado)
            }

            for (const itemId of Object.keys(cuotasSeleccionadas)) {
                const cuotaSeleccionada = cuotasSeleccionadas[itemId]
                const item = tablaLocal.items.find(it => it._id === itemId)

                if (item && cuotaSeleccionada) {
                    const nuevoMonto = Number(montosEsperados[itemId]) || 0
                    if (nuevoMonto > 0) {
                        const promesa = modificarEsperadoCuota(itemId, nuevoMonto, cuotaSeleccionada)
                        promesasModificarEsperados.push(promesa)
                        itemsModificados.push({ itemId, cuota: cuotaSeleccionada })
                    }
                }
            }

            if (promesasModificarEsperados.length > 0) {
                const resultados = await Promise.all(promesasModificarEsperados)
                const exitosos = resultados.filter(r => r).length
                if (exitosos < promesasModificarEsperados.length) {
                    throw new Error("Algunas modificaciones fallaron")
                }
            }

            const itemsMontos = tablaLocal.items
                .filter((it) => it?.estado !== "cargado")
                .map((it) => ({
                    itemId: it._id,
                    prestamoId: it.prestamo?._id || it.prestamo,
                    montoCobrado: Number(montos[it._id] || 0),
                }))

            const response = await tablaSemanalService.actualizarMontos(tablaLocal._id, itemsMontos)

            if (response?.data) {
                onTablaActualizada?.(response.data)
                setModoEdicionAdmin(false)
                setCuotasSeleccionadas({})
                setMontosEsperados({})

                if (itemsModificados.length > 0) {
                    Swal.fire({
                        icon: "success",
                        title: "Cambios guardados",
                        text: `Se modificaron ${itemsModificados.length} esperados`,
                        timer: 2000,
                        showConfirmButton: false
                    })
                }
            }

            if (response?.data) {
                handleTablaActualizada(response.data)
            }
        } catch (err) {
            setError(err?.response?.data?.msg || err?.message || "Error al guardar")
            console.error("ERROR GUARDAR:", err)
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err?.response?.data?.msg || err?.message || "Error al guardar"
            })
        } finally {
            setSaving(false)
        }
    }

    const handleCerrarTablaAdmin = async () => {
        try {
            const result = await Swal.fire({
                title: "¿Cerrar tabla?",
                text: "Esta acción cerrará la tabla y no podrá ser modificada",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, cerrar",
                cancelButtonText: "Cancelar"
            })

            if (!result.isConfirmed) return

            setSaving(true)

            const response = await tablaSemanalService.cerrarTabla(tablaLocal._id)

            if (response?.data) {
                handleTablaActualizada(response.data)
                Swal.fire({
                    icon: "success",
                    title: "Tabla cerrada",
                    text: "La tabla se cerró correctamente"
                })
            }
        } catch (err) {
            console.error("ERROR CERRAR TABLA:", err)
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err?.response?.data?.msg || err?.message || "Error al cerrar la tabla"
            })
        } finally {
            setSaving(false)
        }
    }

    const handleAbrirTablaAdmin = async () => {
        try {
            const result = await Swal.fire({
                title: "¿Abrir tabla?",
                text: "Esta acción abrirá la tabla para poder modificarla",
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, abrir",
                cancelButtonText: "Cancelar"
            })

            if (!result.isConfirmed) return

            setSaving(true)

            const response = await tablaSemanalService.abrirTabla(tablaLocal._id)

            if (response?.data) {
                handleTablaActualizada(response.data)
                Swal.fire({
                    icon: "success",
                    title: "Tabla abierta",
                    text: response.msg || "La tabla se abrió correctamente"
                })
            }
        } catch (err) {
            console.error("ERROR ABRIR TABLA:", err)
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err?.response?.data?.msg || err?.message || "Error al abrir la tabla"
            })
        } finally {
            setSaving(false)
        }
    }

    const handleItemAgregado = (tablaActualizada) => {
        onTablaActualizada?.(tablaActualizada)
        setShowModalAgregarItem(false)
    }

    const handleEliminarItem = async (itemId) => {
        try {
            const result = await Swal.fire({
                title: "¿Estás seguro?",
                text: "No podrás revertir esta acción",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar"
            })

            if (!result.isConfirmed) {
                return
            }

            const response = await tablaSemanalService.eliminarItem(tabla._id, itemId)

            if (response?.data) {
                Swal.fire({
                    icon: "success",
                    title: "Eliminado",
                    text: "El item ha sido eliminado correctamente",
                })
                handleTablaActualizada(response.data.tabla || response.data)
            }
        } catch (error) {
            console.error("Error al eliminar item:", error)
            const mensaje = error.response?.data?.msg || "Error al eliminar el item"
            Swal.fire({
                icon: "error",
                title: "Error",
                text: mensaje,
            })
        }
    }

    const handleToggleTraslado = () => {
        setModoTraslado(!modoTraslado)
        setItemsSeleccionados([])
    }

    const handleToggleEliminacion = () => {
        setModoEliminacion(!modoEliminacion)
        setItemsSeleccionados([])
    }

    const handleSeleccionarItem = (itemId) => {
        setItemsSeleccionados(prev => {
            if (prev.includes(itemId)) {
                return prev.filter(id => id !== itemId)
            } else {
                return [...prev, itemId]
            }
        })
    }

    const handleListoTraslado = () => {
        if (itemsSeleccionados.length > 0) {
            setShowModalTraslado(true)
        }
    }

    const handleEliminarSeleccionados = async () => {
        if (itemsSeleccionados.length === 0) return

        const result = await Swal.fire({
            title: "¿Eliminar items seleccionados?",
            text: `Se eliminarán ${itemsSeleccionados.length} items de la tabla`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        })

        if (result.isConfirmed) {
            try {
                const promesas = itemsSeleccionados.map(itemId =>
                    tablaSemanalService.eliminarItem(tabla._id, itemId)
                )

                const responses = await Promise.all(promesas)

                Swal.fire({
                    icon: "success",
                    title: "Items eliminados",
                    text: `Se han eliminado ${itemsSeleccionados.length} items correctamente`,
                    timer: 2000,
                    showConfirmButton: false,
                    timerProgressBar: true
                })

                setModoEliminacion(false)
                setItemsSeleccionados([])

                if (responses.length > 0 && responses[0]?.data) {
                    handleTablaActualizada(responses[0].data.tabla || responses[0].data)
                } else {
                    handleTablaActualizada(tablaLocal)
                }
            } catch (error) {
                console.error("Error al eliminar items:", error)
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Error al eliminar los items seleccionados"
                })
            }
        }
    }

    const handleTrasladoCompleto = (tablasActualizadas) => {
        if (tablasActualizadas?.tablaOrigen) {
            handleTablaActualizada(tablasActualizadas.tablaOrigen)
            onTablaActualizada?.(tablasActualizadas.tablaOrigen)
        }

        if (tablasActualizadas?.tablaDestino && tablasActualizadas.tablaDestino._id !== tabla._id) {
            onTablaActualizada?.(tablasActualizadas.tablaDestino)
        }

        onActualizarTablas?.()

        setModoTraslado(false)
        setItemsSeleccionados([])
        setShowModalTraslado(false)
    }

    const handleActualizarTablas = () => {
        setTimeout(() => {
            onActualizarTablas?.()
        }, 100)
    }

    return {
        tablaLocal,
        loading: false,
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
        setModoEliminacion,
        saving,
        error,
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
        handleToggleTraslado,
        handleToggleEliminacion,
        handleSeleccionarItem,
        handleListoTraslado,
        handleEliminarSeleccionados,
        handleTrasladoCompleto,
        handleActualizarTablas,
        handleEliminarItem
    }
}
