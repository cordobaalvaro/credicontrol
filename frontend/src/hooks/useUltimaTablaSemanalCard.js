import { useState, useEffect } from "react"
import { usuarioService, tablaSemanalService } from "../services"

const useUltimaTablaSemanalCard = (dashboardData, onDashboardRefresh) => {
    const [cobradores, setCobradores] = useState([])
    const [cobradorSeleccionado, setCobradorSeleccionado] = useState("")
    const [ultimaTablaFiltrada, setUltimaTablaFiltrada] = useState(null)
    const [showModalGenerar, setShowModalGenerar] = useState(false)

    
    useEffect(() => {
        fetchCobradores()
    }, [])

    
    useEffect(() => {
        if (dashboardData?.ultimaTablaSemanal?.data) {
            if (cobradorSeleccionado) {
                
                fetchUltimaTablaPorCobrador(cobradorSeleccionado)
            } else {
                
                setUltimaTablaFiltrada(dashboardData.ultimaTablaSemanal.data)
            }
        }
    }, [dashboardData, cobradorSeleccionado])

    const fetchCobradores = async () => {
        try {
            const response = await usuarioService.getUsuarios({ rol: "cobrador" })
            setCobradores(Array.isArray(response.data) ? response.data : [])
        } catch (error) {
            console.error("Error al cargar cobradores:", error)
            setCobradores([])
        }
    }

    const fetchUltimaTablaPorCobrador = async (cobradorId) => {
        try {
            const response = await tablaSemanalService.getUltimaTablaPorCobrador(cobradorId)
            if (response.data) {
                setUltimaTablaFiltrada(response.data)
            } else {
                setUltimaTablaFiltrada(null)
            }
        } catch (error) {
            console.error("Error al obtener última tabla por cobrador:", error)
            setUltimaTablaFiltrada(null)
        }
    }

    const handleCobradorChange = (e) => {
        const cobradorId = e.target.value
        setCobradorSeleccionado(cobradorId)
    }

    const handleTablaCreada = async (nuevaTabla) => {
        setUltimaTablaFiltrada(nuevaTabla)
        if (onDashboardRefresh) await onDashboardRefresh();
        if (cobradorSeleccionado) {
            fetchUltimaTablaPorCobrador(cobradorSeleccionado)
        }
    }

    const handleTablaActualizada = async (tablaActualizada) => {
        if (!tablaActualizada?._id) return
        setUltimaTablaFiltrada(tablaActualizada)
        if (onDashboardRefresh) await onDashboardRefresh();
        if (cobradorSeleccionado) {
            fetchUltimaTablaPorCobrador(cobradorSeleccionado)
        }
    }

    const handleTablaEliminada = async () => {
        setUltimaTablaFiltrada(null)
        if (onDashboardRefresh) await onDashboardRefresh();
        if (cobradorSeleccionado) {
            fetchUltimaTablaPorCobrador(cobradorSeleccionado)
        }
    }

    return {
        cobradores,
        cobradorSeleccionado,
        ultimaTablaFiltrada,
        showModalGenerar,
        setShowModalGenerar,
        handleCobradorChange,
        handleTablaCreada,
        handleTablaActualizada,
        handleTablaEliminada
    }
}

export default useUltimaTablaSemanalCard
