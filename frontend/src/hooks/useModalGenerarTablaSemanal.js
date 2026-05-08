import { useState, useEffect } from "react"
import { usuarioService, tablaSemanalService } from "../services";
import Swal from "sweetalert2"
import { validarGeneracionTablaSemanal } from "../validators/tablaSemanal.validators";

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
    const [zonas, setZonas] = useState([])
    const [zonaId, setZonaId] = useState("")
    const [fechaInicio, setFechaInicio] = useState("")
    const [fechaFin, setFechaFin] = useState("")
    const [loadingCobradores, setLoadingCobradores] = useState(false)
    const [loadingZonas, setLoadingZonas] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")

    // Nuevas opciones
    const [tipoCuotas, setTipoCuotas] = useState("todas") // 'semana' | 'todas'
    const [tipoZona, setTipoZona] = useState("especifica") // 'especifica' | 'todas'
    const [esperadoModo, setEsperadoModo] = useState("automatico") // 'automatico' | 'manual'
    const [montoEsperadoManual, setMontoEsperadoManual] = useState("")
    const [previewData, setPreviewData] = useState(null)
    const [loadingPreview, setLoadingPreview] = useState(false)
    const [previewError, setPreviewError] = useState("")

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

    const fetchZonasCobrador = async (id) => {
        if (!id) {
            setZonas([])
            return
        }
        try {
            setLoadingZonas(true)
            const response = await usuarioService.getUsuarioById(id)
            setZonas(Array.isArray(response.data?.zonaACargo) ? response.data.zonaACargo : [])
        } catch (err) {
            console.error("Error al obtener zonas del cobrador", err)
            setZonas([])
        } finally {
            setLoadingZonas(false)
        }
    }

    useEffect(() => {
        if (show) {
            setError("")
            fetchCobradores()
        }
    }, [show])

    useEffect(() => {
        setZonaId("")
        fetchZonasCobrador(cobradorId)
    }, [cobradorId])

    useEffect(() => {
        const canPreview = cobradorId && fechaInicio && fechaFin && (tipoZona === "todas" || zonaId);
        
        if (canPreview) {
            const fetchPreview = async () => {
                try {
                    setLoadingPreview(true)
                    setPreviewError("")
                    const res = await tablaSemanalService.previsualizarTotales({
                        cobradorId,
                        zonaId: tipoZona === "especifica" ? zonaId : null,
                        fechaInicio,
                        fechaFin,
                        soloCuotasSemana: tipoCuotas === "semana"
                    })
                    if (res?.data) {
                        setPreviewData(res.data)
                    } else {
                        setPreviewData(null)
                        setPreviewError(res?.msg || "No hay datos para esta selección")
                    }
                } catch (err) {
                    console.error("Error al previsualizar", err)
                    setPreviewError(err?.response?.data?.msg || "Error al calcular totales")
                    setPreviewData(null)
                } finally {
                    setLoadingPreview(false)
                }
            }
            fetchPreview()
        } else {
            setPreviewData(null)
            setPreviewError("")
        }
    }, [cobradorId, zonaId, tipoZona, fechaInicio, fechaFin, tipoCuotas])

    const resetForm = () => {
        setCobradorId("")
        setZonaId("")
        setZonas([])
        setFechaInicio("")
        setFechaFin("")
        setError("")
        setTipoCuotas("todas")
        setTipoZona("especifica")
        setEsperadoModo("automatico")
        setMontoEsperadoManual("")
        setPreviewData(null)
        setLoadingPreview(false)
        setPreviewError("")
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
        
        if (tipoZona === "especifica" && !zonaId) {
            setError("Debes seleccionar una zona");
            return;
        }

        if (esperadoModo === "manual" && (!montoEsperadoManual || Number.isNaN(Number(montoEsperadoManual)))) {
            setError("Debes ingresar un monto esperado válido");
            return;
        }

        const errorValidacion = validarGeneracionTablaSemanal(
            cobradorId, 
            zonaId,
            fechaInicio, 
            fechaFin,
            tipoZona === "todas"
        );
        
        if (errorValidacion) {
            setError(errorValidacion);
            return;
        }

        try {
            setSaving(true)
            setError("")
            const body = {
                cobradorId,
                zonaId: tipoZona === "especifica" ? zonaId : null,
                fechaInicio,
                fechaFin,
                soloCuotasSemana: tipoCuotas === "semana",
                montoEsperadoManual: esperadoModo === "manual" ? Number(montoEsperadoManual) : null
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
        zonas,
        zonaId,
        setZonaId,
        fechaInicio,
        fechaFin,
        loadingCobradores,
        loadingZonas,
        saving,
        error,
        handleClose,
        handleFechaInicioChange,
        handleSubmit,
        tipoCuotas,
        setTipoCuotas,
        tipoZona,
        setTipoZona,
        esperadoModo,
        setEsperadoModo,
        montoEsperadoManual,
        setMontoEsperadoManual,
        previewData,
        loadingPreview,
        previewError
    }
}
export default useModalGenerarTablaSemanal
