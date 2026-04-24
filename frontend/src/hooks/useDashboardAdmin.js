import { useState, useEffect } from "react"
import { dashboardService } from "../services"
import Swal from "sweetalert2"

const useDashboardAdmin = () => {
    const [dashboardData, setDashboardData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [showCobradoresModal, setShowCobradoresModal] = useState(false)
    const [showCobradosMesModal, setShowCobradosMesModal] = useState(false)
    const [showPrestadosMesModal, setShowPrestadosMesModal] = useState(false)
    const [showZonasModal, setShowZonasModal] = useState(false)
    const [cobradosMesData, setCobradosMesData] = useState([])
    const [loadingCobradosMes, setLoadingCobradosMes] = useState(false)
    const [prestadosMesData, setPrestadosMesData] = useState([])
    const [loadingPrestadosMes, setLoadingPrestadosMes] = useState(false)
    const [actualizandoPrestamos, setActualizandoPrestamos] = useState(false)

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

    const fetchPrestadosMes = async () => {
        try {
            setLoadingPrestadosMes(true)
            const response = await dashboardService.getPrestamosPrestadosMes(filtroMes, filtroAnio)
            setPrestadosMesData(response.data || [])
        } catch (err) {
            console.error("Error al cargar préstamos prestados del mes:", err)
            setPrestadosMesData([])
        } finally {
            setLoadingPrestadosMes(false)
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

    useEffect(() => {
        if (showPrestadosMesModal) {
            fetchPrestadosMes()
        }
    }, [showPrestadosMesModal, filtroMes, filtroAnio])

    const handleActualizarPrestamos = async () => {
        try {
            setActualizandoPrestamos(true)
            await dashboardService.actualizarPrestamosManual()
            await fetchDashboardData()
            Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: 'Los estados e intereses de los préstamos se han actualizado correctamente.',
                timer: 2000,
                showConfirmButton: false
            })
        } catch (err) {
            console.error("Error al actualizar préstamos:", err)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err?.response?.data?.msg || 'No se pudo realizar la actualización manual'
            })
        } finally {
            setActualizandoPrestamos(false)
        }
    }

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
        showPrestadosMesModal,
        setShowPrestadosMesModal,
        showZonasModal,
        setShowZonasModal,
        cobradosMesData,
        loadingCobradosMes,
        prestadosMesData,
        loadingPrestadosMes,
        actualizandoPrestamos,
        fetchDashboardData,
        handleActualizarPrestamos
    }
}

export default useDashboardAdmin
