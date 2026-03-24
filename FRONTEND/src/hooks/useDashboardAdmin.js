import { useState, useEffect } from "react"
import { dashboardService } from "../services"

const useDashboardAdmin = () => {
    const [dashboardData, setDashboardData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [showCobradoresModal, setShowCobradoresModal] = useState(false)
    const [showCobradosMesModal, setShowCobradosMesModal] = useState(false)
    const [showZonasModal, setShowZonasModal] = useState(false)
    const [cobradosMesData, setCobradosMesData] = useState([])
    const [loadingCobradosMes, setLoadingCobradosMes] = useState(false)

    const fechaActual = new Date()
    const [filtroMes, setFiltroMes] = useState((fechaActual.getMonth() + 1).toString())
    const [filtroAnio, setFiltroAnio] = useState(fechaActual.getFullYear().toString())

    const fetchDashboardData = async () => {
        try {
            if (!dashboardData) {
                setLoading(true)
            }
            setError("")
            const response = await dashboardService.getAdminDashboard(filtroMes, filtroAnio)
            setDashboardData(response.data)
        } catch (err) {
            console.error("Error al cargar dashboard:", err)
            setError(err?.response?.data?.msg || "Error al cargar el dashboard")
        } finally {
            setLoading(false)
        }
    }

    const fetchCobradosMes = async () => {
        try {
            setLoadingCobradosMes(true)
            const response = await dashboardService.getPrestamosCobradosMes(filtroMes, filtroAnio)
            setCobradosMesData(response.data || [])
        } catch (err) {
            console.error("Error al cargar préstamos cobrados del mes:", err)
            setCobradosMesData([])
        } finally {
            setLoadingCobradosMes(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [filtroMes, filtroAnio])

    useEffect(() => {
        if (showCobradosMesModal) {
            fetchCobradosMes()
        }
    }, [showCobradosMesModal, filtroMes, filtroAnio])

    return {
        dashboardData,
        loading,
        error,
        filtroMes,
        setFiltroMes,
        filtroAnio,
        setFiltroAnio,
        showCobradoresModal,
        setShowCobradoresModal,
        showCobradosMesModal,
        setShowCobradosMesModal,
        showZonasModal,
        setShowZonasModal,
        cobradosMesData,
        loadingCobradosMes,
        fetchDashboardData,
    }
}

export default useDashboardAdmin
