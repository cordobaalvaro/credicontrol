import { useState, useEffect } from "react"
import { clienteService } from "../services";
import Swal from "sweetalert2"
import { IconMoodSmile, IconMoodNeutral, IconMoodSad } from "@tabler/icons-react"
export const getTipoData = (tipo) => {
    const tiposMap = {
        bueno: {
            icon: IconMoodSmile,
            color: "bueno",
            label: "Bueno",
        },
        regular: {
            icon: IconMoodNeutral,
            color: "regular",
            label: "Regular",
        },
        malo: {
            icon: IconMoodSad,
            color: "malo",
            label: "Malo",
        },
        neutro: {
            icon: IconMoodNeutral,
            color: "neutro",
            label: "Neutro",
        },
    }
    return tiposMap[tipo] || tiposMap.neutro
}
const useModalTiposClientes = (show, onAfterRecalcular) => {
    const [tipoSeleccionado, setTipoSeleccionado] = useState("todos")
    const [loadingRecalcular, setLoadingRecalcular] = useState(false)
    const [loadingClientes, setLoadingClientes] = useState(false)
    const [clientesPorTipo, setClientesPorTipo] = useState([])
    const [clientesTotales, setClientesTotales] = useState([])
    const [error, setError] = useState("")
    const [razonLoadingId, setRazonLoadingId] = useState(null)
    const [razones, setRazones] = useState({})
    const [stats, setStats] = useState({ bueno: 0, regular: 0, malo: 0, neutro: 0, total: 0 })
    const fetchClientesPorTipo = async (tipo) => {
        try {
            setLoadingClientes(true)
            setError("")
            if (tipo === "todos") {
                const response = await clienteService.getClientes()
                setClientesPorTipo(response.data || [])
                setClientesTotales(response.data || [])
            } else {
                const response = await clienteService.getClientesPorTipo(tipo)
                setClientesPorTipo(response.data || [])
            }
        } catch (err) {
            setError(err?.response?.data?.msg || "Error al obtener los clientes por tipo. Intenta nuevamente.")
            setClientesPorTipo([])
        } finally {
            setLoadingClientes(false)
        }
    }
    const fetchStats = async () => {
        try {
            const response = await clienteService.getClientes()
            const clientes = response.data || []
            setClientesTotales(clientes)
            const conteo = {
                bueno: clientes.filter((c) => c.tipo === "bueno").length,
                regular: clientes.filter((c) => c.tipo === "regular").length,
                malo: clientes.filter((c) => c.tipo === "malo").length,
                neutro: clientes.filter((c) => c.tipo === "neutro").length,
            }
            conteo.total = conteo.bueno + conteo.regular + conteo.malo + conteo.neutro
            setStats(conteo)
        } catch (err) {
            console.error("Error fetching stats:", err)
        }
    }
    const handleRecalcularTipos = async () => {
        try {
            setLoadingRecalcular(true)
            setError("")
            await clienteService.recalcularTipos()
            if (onAfterRecalcular) {
                onAfterRecalcular()
            }
            await fetchStats()
            await fetchClientesPorTipo(tipoSeleccionado)
        } catch (err) {
            setError(err?.response?.data?.msg || "Error al recalcular los tipos de clientes. Intenta nuevamente.")
        } finally {
            setLoadingRecalcular(false)
        }
    }
    const handleTipoChange = (tipo) => {
        setTipoSeleccionado(tipo)
        fetchClientesPorTipo(tipo)
    }
    const fetchRazonTipo = async (clienteId) => {
        if (!clienteId || razones[clienteId]) return
        try {
            setRazonLoadingId(clienteId)
            const response = await clienteService.getRazonTipo(clienteId)
            const razonData = response.data
            await Swal.fire({
                title: "Razón del Tipo",
                html: `
          <div class="razones-modal-content">
            <div class="razones-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" class="razones-icon">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path>
                <path d="M12 6v6l4 2"></path>
              </svg>
              <h3>¿Por qué este cliente es ${razonData.tipo}?</h3>
            </div>
            <div class="razones-body">
              ${Array.isArray(razonData.razones) && razonData.razones.length > 0
                        ? razonData.razones
                            .map(
                                (razón) => `
                <div class="razon-item">
                  <span class="razon-bullet">•</span>
                  <span class="razon-text">${razón}</span>
                </div>
              `,
                            )
                            .join("")
                        : '<p class="no-razones">No hay razones registradas.</p>'
                    }
            </div>
          </div>
        `,
                confirmButtonText: "Cerrar",
                confirmButtonColor: "#16a34a",
                didOpen: () => {
                    const style = document.createElement("style")
                    style.textContent = `
            .razones-modal-content {
              text-align: left;
              max-height: 300px;
              overflow-y: auto;
            }
            .razones-header {
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 16px;
              padding-bottom: 12px;
              border-bottom: 2px solid #e5e7eb;
            }
            .razones-icon {
              color: #16a34a;
              flex-shrink: 0;
            }
            .razones-header h3 {
              margin: 0;
              font-size: 16px;
              color: #1f2937;
              font-weight: 600;
            }
            .razones-body {
              display: flex;
              flex-direction: column;
              gap: 10px;
            }
            .razon-item {
              display: flex;
              gap: 10px;
              padding: 8px;
              background-color: #f3f4f6;
              border-radius: 6px;
              border-left: 3px solid #16a34a;
            }
            .razon-bullet {
              color: #16a34a;
              font-weight: bold;
              flex-shrink: 0;
            }
            .razon-text {
              color: #4b5563;
              font-size: 14px;
            }
            .no-razones {
              color: #9ca3af;
              font-style: italic;
              text-align: center;
              padding: 20px 10px;
              margin: 0;
            }
          `
                    document.head.appendChild(style)
                },
            })
            setRazones((prev) => ({ ...prev, [clienteId]: razonData }))
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err?.response?.data?.msg || "No se pudo obtener el detalle de la razón.",
            })
        } finally {
            setRazonLoadingId(null)
        }
    }
    useEffect(() => {
        if (show) {
            fetchStats()
            fetchClientesPorTipo("todos")
        } else {
            setClientesPorTipo([])
            setRazones({})
            setError("")
            setTipoSeleccionado("todos")
        }
    }, [show])
    return {
        tipoSeleccionado,
        loadingRecalcular,
        loadingClientes,
        clientesPorTipo,
        error,
        razonLoadingId,
        stats,
        handleRecalcularTipos,
        handleTipoChange,
        fetchRazonTipo
    }
}
export default useModalTiposClientes
