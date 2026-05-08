import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { dashboardService, tablaSemanalService } from "../services"
import { useAuth } from "../context/AuthContext"
const useDashboardCobrador = () => {
  const { logout } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [lastUpdated, setLastUpdated] = useState(null)
  const [montosInline, setMontosInline] = useState({})
  const [savingInline, setSavingInline] = useState({})
  const [zonasData, setZonasData] = useState(null)
  const [novedadesData, setNovedadesData] = useState(null)
  const [loadingZonas, setLoadingZonas] = useState(false)
  const [loadingNovedades, setLoadingNovedades] = useState(false)
  const [selectedTablaId, setSelectedTablaId] = useState(null)
  const tablaId = selectedTablaId || dashboardData?.metricasDia?.ultimaTabla?._id

  const fetchDashboardData = async (showLoading = true, customTablaId = null) => {
    try {
      if (showLoading) setLoading(true)
      setError("")
      
      const idToUse = customTablaId || selectedTablaId
      const response = await dashboardService.getCobradorDashboard(idToUse)
      
      if (response) {
        setDashboardData(response.data)
        setLastUpdated(new Date())
        // Si no tenemos una tabla seleccionada, tomamos la que vino por defecto (la última)
        if (!idToUse && response.data?.metricasDia?.ultimaTabla?._id) {
          setSelectedTablaId(response.data.metricasDia.ultimaTabla._id)
        }
      } else {
        const errorMsg = response?.msg || "Error al cargar los datos"
        setError(errorMsg)
        if (showLoading) {
          Swal.fire({
            icon: "warning",
            title: "Atención",
            text: errorMsg,
            confirmButtonColor: "#3085d6",
          })
        }
      }
    } catch (err) {
      let errorMsg = "Error de conexión al servidor"
      if (err.response?.status === 401) {
        errorMsg = "Sesión expirada. Por favor, inicia sesión nuevamente."
        logout()
        sessionStorage.clear()
        window.location.href = "#/"
        return
      }
      setError(errorMsg)
      if (showLoading) {
        Swal.fire({
          icon: "error",
          title: "Error de conexión",
          text: errorMsg,
          confirmButtonColor: "#3085d6",
        })
      }
    } finally {
      if (showLoading) setLoading(false)
    }
  }
  const refreshData = async (showLoading = true) => {
    await fetchDashboardData(showLoading, selectedTablaId)
  }
  const fetchMetricasDia = async () => {
    try {
      const response = await dashboardService.getMetricasDia()
      return response
    } catch (err) {
      return { status: 500, data: null }
    }
  }
  const fetchResumenSemanal = async () => {
    try {
      const response = await dashboardService.getResumenSemanal()
      return response
    } catch (err) {
      return { status: 500, data: null }
    }
  }
  const fetchProximosACobrar = async () => {
    try {
      const response = await dashboardService.getProximosACobrar()
      return response
    } catch (err) {
      return { status: 500, data: [] }
    }
  }
  const fetchMisZonas = async () => {
    try {
      const response = await dashboardService.getMisZonas()
      return response
    } catch (err) {
      return { status: 500, data: null }
    }
  }
  const fetchNovedades = async () => {
    try {
      const response = await dashboardService.getNovedades()
      return response
    } catch (err) {
      return { status: 500, data: null }
    }
  }
  const updateMetric = async (metricType) => {
    try {
      let response
      switch (metricType) {
        case 'metricasDia':
          response = await fetchMetricasDia()
          break
        case 'resumenSemanal':
          response = await fetchResumenSemanal()
          break
        case 'proximosACobrar':
          response = await fetchProximosACobrar()
          break
        case 'alertas':
          response = await fetchAlertas()
          break
        default:
          return
      }
      if (response && dashboardData) {
        setDashboardData(prev => ({
          ...prev,
          [metricType]: response.data
        }))
        setLastUpdated(new Date())
      }
    } catch (err) {
    }
  }
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData(false, selectedTablaId) 
    }, 5 * 60 * 1000) 
    return () => clearInterval(interval)
  }, [selectedTablaId])
  useEffect(() => {
    fetchDashboardData(true)
  }, [])
  const getDerivedStats = () => {
    if (!dashboardData) return null
    const { metricasDia, resumenSemanal, alertas } = dashboardData
    return {
      productividadDia: metricasDia?.metaPorcentaje >= 100 ? 'excelente' :
        metricasDia?.metaPorcentaje >= 75 ? 'buena' :
          metricasDia?.metaPorcentaje >= 50 ? 'regular' : 'baja',
      tendenciaSemanal: resumenSemanal?.metaPorcentaje >= 100 ? 'creciente' :
        resumenSemanal?.metaPorcentaje >= 75 ? 'estable' : 'decreciente',
      nivelRiesgo: alertas?.prestamosVencidos?.length > 5 ? 'alto' :
        alertas?.prestamosVencidos?.length > 2 ? 'medio' : 'bajo',
      eficiencia: metricasDia?.pendientesHoy > 0 ?
        ((metricasDia?.cobrosHoy || 0) / (metricasDia?.cobrosHoy + metricasDia.pendientesHoy) * 100).toFixed(1) : 100
    }
  }
  const fetchPrestamosActivos = async () => {
    try {
      const response = await dashboardService.getPrestamosActivos()
      return response
    } catch (error) {
      return null
    }
  }
  const fetchPrestamosVencidos = async () => {
    try {
      const response = await dashboardService.getPrestamosVencidos()
      return response
    } catch (error) {
      return null
    }
  }
  const getDireccionCobroFinal = (cliente) => {
    if (!cliente) return "-"
    return (
      cliente.direccionCobroFinal ||
      cliente.direccionCobroValor ||
      cliente.direccionComercial ||
      cliente.direccion ||
      cliente.direccionCobro ||
      "-"
    )
  }
  const setSavingForPrestamo = (prestamoId, isSaving) => {
    setSavingInline((prev) => ({ ...prev, [prestamoId]: isSaving }))
  }
  const handleMontoInlineChange = (prestamoId, value) => {
    setMontosInline((prev) => ({ ...prev, [prestamoId]: value }))
  }
  const handleGuardarMontoInline = async (prestamoId) => {
    if (!tablaId || !prestamoId) return
    try {
      setSavingForPrestamo(prestamoId, true)
      const monto = Number(montosInline[prestamoId] || 0)
      await tablaSemanalService.actualizarMontosCobrador(tablaId, [
        {
          prestamoId,
          montoCobrado: monto,
        },
      ])
      await refreshData(false)
      // Limpiar el monto local para que use el del servidor
      setMontosInline(prev => {
        const newMontos = { ...prev }
        delete newMontos[prestamoId]
        return newMontos
      })
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.msg || err?.message || "Error al guardar",
      })
    } finally {
      setSavingForPrestamo(prestamoId, false)
    }
  }
  const handleResetItem = async (prestamoId) => {
    if (!tablaId || !prestamoId) return
    try {
      setSavingForPrestamo(prestamoId, true)
      await tablaSemanalService.actualizarMontosCobrador(tablaId, [
        {
          prestamoId,
          montoCobrado: 0,
        },
      ])
      await refreshData(false)
      // Limpiar el monto local
      setMontosInline(prev => {
        const newMontos = { ...prev }
        delete newMontos[prestamoId]
        return newMontos
      })
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.msg || "Error al quitar item",
      })
    } finally {
      setSavingForPrestamo(prestamoId, false)
    }
  }
  const handleCerrarTablaInline = async () => {
    if (!tablaId) return
    try {
      const result = await Swal.fire({
        title: "¿Cerrar tabla?",
        text: "Esta acción cerrará la tabla y no podrá ser modificada",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, cerrar",
        cancelButtonText: "Cancelar",
      })
      if (!result.isConfirmed) return
      await tablaSemanalService.cerrarTablaCobrador(tablaId)
      await refreshData(false)
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.msg || err?.message || "Error al cerrar la tabla",
      })
    }
  }
  const handleRendirJornada = async () => {
    if (!tablaId) return
    try {
      const itemsReportados = dashboardData?.metricasDia?.itemsTabla?.reportados?.cantidad || 0
      if (itemsReportados === 0) {
        Swal.fire({
          icon: "info",
          title: "Sin cobros",
          text: "No tienes cobros registrados para rendir hoy.",
        })
        return
      }
      const result = await Swal.fire({
        title: "¿Rendir jornada?",
        html: `
          <div class="text-start">
            <p class="mb-3">Se enviarán <b>${itemsReportados}</b> cobros al administrador y se limpiará la lista para mañana.</p>
            <label for="swal-observaciones" class="form-label small text-muted">Notas / Observaciones (opcional):</label>
            <textarea id="swal-observaciones" class="form-control form-control-sm" placeholder="Escribe aquí cualquier observación..." rows="3"></textarea>
          </div>
        `,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, rendir jornada",
        cancelButtonText: "Cancelar",
        preConfirm: () => {
          return document.getElementById('swal-observaciones').value
        }
      })
      if (!result.isConfirmed) return
      const observaciones = result.value
      await tablaSemanalService.rendirJornada(tablaId, observaciones)
      Swal.fire({
        icon: "success",
        title: "Jornada rendida",
        text: "Los cobros han sido enviados correctamente.",
        timer: 2000,
        showConfirmButton: false,
      })
      await refreshData(false)
      setMontosInline({}) // Limpiar todos los inputs locales al rendir jornada
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.msg || "Error al rendir la jornada",
      })
    }
  }
  const loadZonasData = async () => {
    try {
      setLoadingZonas(true)
      const response = await fetchMisZonas()
      if (response) {
        setZonasData(response.data)
      }
    } catch (err) {
    } finally {
      setLoadingZonas(false)
    }
  }
  const loadNovedadesData = async () => {
    try {
      setLoadingNovedades(true)
      const response = await fetchNovedades()
      if (response) {
        setNovedadesData(response.data)
      }
    } catch (err) {
    } finally {
      setLoadingNovedades(false)
    }
  }
  useEffect(() => {
    if (dashboardData) {
      loadZonasData()
      loadNovedadesData()
    }
  }, [dashboardData])
  useEffect(() => {
    const interval = setInterval(() => {
      loadNovedadesData()
    }, 2 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])
  const handleSeleccionarTabla = async (id) => {
    setSelectedTablaId(id)
    await fetchDashboardData(true, id)
  }

  return {
    dashboardData,
    loading,
    error,
    lastUpdated,
    derivedStats: getDerivedStats(),
    refreshData,
    updateMetric,
    fetchMetricasDia,
    fetchResumenSemanal,
    fetchProximosACobrar,
    fetchMisZonas,
    fetchNovedades,
    fetchPrestamosActivos,
    fetchPrestamosVencidos,
    montosInline,
    savingInline,
    zonasData,
    novedadesData,
    loadingZonas,
    loadingNovedades,
    tablaId,
    selectedTablaId,
    handleSeleccionarTabla,
    handleMontoInlineChange,
    handleGuardarMontoInline,
    handleResetItem,
    handleCerrarTablaInline,
    handleRendirJornada,
    getDireccionCobroFinal,
    hasData: !!dashboardData,
    hasAlertas: dashboardData?.alertas?.totalAlertas > 0,
    hasProximosCobrar: dashboardData?.proximosACobrar?.length > 0,
    metaDiariaCumplida: dashboardData?.metricasDia?.metaPorcentaje >= 100,
    metaSemanalCumplida: dashboardData?.resumenSemanal?.metaPorcentaje >= 100,
  }
}
export default useDashboardCobrador
