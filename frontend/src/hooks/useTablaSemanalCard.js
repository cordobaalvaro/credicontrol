import { useState } from "react"
import { tablaSemanalService } from "../services";
import Swal from "sweetalert2"
import dayjs from "dayjs"
export const formatearFecha = (fecha) => (fecha ? dayjs(fecha).format("DD/MM/YYYY") : "-")
const useTablaSemanalCard = ({ tabla, onTablaActualizada, onTablaEliminada }) => {
    const [sending, setSending] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const handleEnviar = async () => {
        try {
            setSending(true)
            const response = await tablaSemanalService.enviarTabla(tabla._id)
            if (response?.data) {
                onTablaActualizada?.(response.data)
            }
        } catch (err) {
            console.error("Error al enviar tabla semanal", err)
        } finally {
            setSending(false)
        }
    }
    const handleEliminar = async () => {
        const result = await Swal.fire({
            title: "¿Eliminar esta tabla semanal?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        })
        if (!result.isConfirmed) return
        try {
            setDeleting(true)
            await tablaSemanalService.eliminarTabla(tabla._id)
            onTablaEliminada?.(tabla._id)
            await Swal.fire("Eliminada", "La tabla semanal fue eliminada correctamente.", "success")
        } catch (err) {
            console.error("Error al eliminar tabla semanal", err)
            await Swal.fire("Error", "No se pudo eliminar la tabla semanal.", "error")
        } finally {
            setDeleting(false)
        }
    }
    return {
        sending,
        deleting,
        handleEnviar,
        handleEliminar
    }
}
export default useTablaSemanalCard
