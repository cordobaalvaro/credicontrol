import { useState, useEffect } from "react"
import { usuarioService, tablaSemanalService } from "../../../services"
import Swal from "sweetalert2"
export const isMonday = (yyyyMmDd) => {
    if (!yyyyMmDd) return false
    const d = new Date(`${yyyyMmDd}T00:00:00`)
    return !Number.isNaN(d.getTime()) && d.getDay() === 1
}
export const addDaysYmd = (yyyyMmDd, days) => {
    if (!yyyyMmDd) return ""
    const d = new Date(`${yyyyMmDd}T00:00:00`)
    if (Number.isNaN(d.getTime())) return ""
    d.setDate(d.getDate() + Number(days || 0))
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
}
const useModalGenerarTablaSemanal = ({ show, onHide, onTablaCreada }) => {
    const [cobradores, setCobradores] = useState([])
    const [cobradorId, setCobradorId] = useState("")
    const [fechaInicio, setFechaInicio] = useState("")
    const [fechaFin, setFechaFin] = useState("")
    const [loadingCobradores, setLoadingCobradores] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const fetchCobradores = async () => {
        try {
            setLoadingCobradores(true)
            const response = await usuarioService.getUsuarios({ rol: "cobrador" })
            setCobradores(Array.isArray(response.data) ? response.data : [])
        } catch (err) {
            console.error("Error al obtener cobradores", err)
        } finally {
            setLoadingCobradores(false)
        }
    }
    useEffect(() => {
        if (show) {
            setError("")
            fetchCobradores()
        }
    }, [show])
    const resetForm = () => {
        setCobradorId("")
        setFechaInicio("")
        setFechaFin("")
        setError("")
    }
    const handleClose = () => {
        if (saving) return
        resetForm()
        onHide?.()
    }
    const handleFechaInicioChange = (e) => {
        const value = e.target.value
        setFechaInicio(value)
        if (!value) {
            setFechaFin("")
            return
        }
        if (!isMonday(value)) {
            setFechaFin("")
            setError("La fecha de inicio debe ser un lunes")
            return
        }
        setError("")
        setFechaFin(addDaysYmd(value, 6))
    }
    const handleSubmit = async (e) => {
        e?.preventDefault?.()
        if (!cobradorId || !fechaInicio || !fechaFin) {
            setError("Debes seleccionar un cobrador y un rango de fechas")
            return
        }
        if (!isMonday(fechaInicio)) {
            setError("La fecha de inicio debe ser un lunes")
            return
        }
        const finEsperado = addDaysYmd(fechaInicio, 6)
        if (fechaFin !== finEsperado) {
            setError("El período debe ser semanal (lunes a domingo).")
            return
        }
        try {
            setSaving(true)
            setError("")
            const body = {
                cobradorId,
                fechaInicio,
                fechaFin,
            }
            const response = await tablaSemanalService.generarTabla(body)
            if (response?.data) {
                onTablaCreada?.(response.data)
                await Swal.fire({
                    icon: "success",
                    title: "Tabla generada",
                    text: response?.msg || "La tabla semanal fue generada correctamente.",
                    timer: 1600,
                    showConfirmButton: false,
                })
                handleClose()
                return
            }
            const msg = response?.msg || "No hay datos para generar la tabla en ese período."
            await Swal.fire({
                icon: "info",
                title: "Sin datos para generar",
                text: msg,
            })
        } catch (err) {
            const msg = err?.response?.data?.msg || "No se pudo generar la tabla semanal"
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
    return {
        cobradores,
        cobradorId,
        setCobradorId,
        fechaInicio,
        fechaFin,
        loadingCobradores,
        saving,
        error,
        handleClose,
        handleFechaInicioChange,
        handleSubmit
    }
}
export default useModalGenerarTablaSemanal
