import { useState, useEffect } from "react"
import { tablaSemanalService } from "../services";
import Swal from "sweetalert2"
const useModalTrasladoItems = ({ show, onHide, itemsSeleccionados, tablaOrigen, onTrasladoCompleto, onActualizarTablas }) => {
    const [tablas, setTablas] = useState([])
    const [tablaDestino, setTablaDestino] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    useEffect(() => {
        if (show) {
            cargarTablas()
        }
    }, [show])
    const cargarTablas = async () => {
        try {
            const response = await tablaSemanalService.getTablas()
            if (response?.data) {
                const tablasDisponibles = response.data.filter(
                    tabla => tabla._id !== tablaOrigen._id
                )
                setTablas(tablasDisponibles)
            }
        } catch (error) {
            console.error("Error al cargar tablas:", error)
            setError("Error al cargar las tablas disponibles")
        }
    }
    const handleTraslado = async () => {
        if (!tablaDestino) {
            setError("Por favor selecciona una tabla destino")
            return
        }
        try {
            setLoading(true)
            setError("")
            const response = await tablaSemanalService.trasladarItems(tablaOrigen._id, {
                itemsIds: itemsSeleccionados,
                tablaDestinoId: tablaDestino
            })
            if (response?.data) {
                onHide()
                Swal.fire({
                    icon: "success",
                    title: "Items trasladados",
                    text: `Se han trasladado ${itemsSeleccionados.length} items correctamente`,
                    timer: 2000,
                    showConfirmButton: false,
                    timerProgressBar: true
                }).then(() => {
                    onTrasladoCompleto?.(response.data)
                    onActualizarTablas?.()
                })
            }
        } catch (error) {
            console.error("Error al trasladar items:", error)
            const mensaje = error.response?.data?.msg || "Error al trasladar los items"
            setError(mensaje)
            Swal.fire({
                icon: "error",
                title: "Error",
                text: mensaje,
            })
        } finally {
            setLoading(false)
        }
    }
    const handleClose = () => {
        setTablaDestino("")
        setError("")
        onHide()
    }
    return {
        tablas,
        tablaDestino,
        setTablaDestino,
        loading,
        error,
        handleTraslado,
        handleClose
    }
}
export default useModalTrasladoItems
