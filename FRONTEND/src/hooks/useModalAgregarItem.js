import { useState, useEffect } from "react"
import { usuarioService, tablaSemanalService } from "../../../services"
import Swal from "sweetalert2"
const useModalAgregarItem = ({ show, onHide, tabla, onItemAgregado }) => {
    const [prestamos, setPrestamos] = useState([])
    const [loading, setLoading] = useState(false)
    const [busqueda, setBusqueda] = useState("")
    const [cobradorFilter, setCobradorFilter] = useState("")
    const [estadoFilter, setEstadoFilter] = useState("")
    const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null)
    const [cobradores, setCobradores] = useState([])
    useEffect(() => {
        if (show) {
            cargarPrestamos()
            cargarCobradores()
        }
    }, [show])
    useEffect(() => {
        if (show) {
            cargarPrestamos()
        }
    }, [cobradorFilter, estadoFilter])
    const cargarCobradores = async () => {
        try {
            const response = await usuarioService.getUsuarios({ rol: "cobrador" })
            if (response?.data) {
                setCobradores(response.data)
            }
        } catch (error) {
            console.error("Error al cargar cobradores:", error)
        }
    }
    const cargarPrestamos = async () => {
        try {
            setLoading(true)
            const filtros = {}
            if (cobradorFilter) filtros.cobrador = cobradorFilter
            if (estadoFilter) filtros.estado = estadoFilter
            const response = await tablaSemanalService.getPrestamosParaTabla(filtros)
            if (response?.data) {
                setPrestamos(response.data)
            }
        } catch (error) {
            console.error("Error al cargar préstamos:", error)
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudieron cargar los préstamos",
            })
        } finally {
            setLoading(false)
        }
    }
    const prestamosFiltrados = prestamos.filter(prestamo => {
        const busquedaLower = busqueda.toLowerCase()
        if (prestamo.cliente?.nombre && prestamo.cliente.nombre.toLowerCase().includes(busquedaLower)) {
            return true
        }
        if (prestamo.numero && prestamo.numero.toString().toLowerCase().includes(busquedaLower)) {
            return true
        }
        if (prestamo.nombre && prestamo.nombre.toLowerCase().includes(busquedaLower)) {
            return true
        }
        return false
    })
    const handleSeleccionarPrestamo = (prestamo) => {
        if (prestamoSeleccionado?._id === prestamo._id) {
            setPrestamoSeleccionado(null)
        } else {
            setPrestamoSeleccionado(prestamo)
        }
    }
    const handleAgregarItem = async () => {
        if (!prestamoSeleccionado) {
            Swal.fire({
                icon: "warning",
                title: "Advertencia",
                text: "Debes seleccionar un préstamo",
            })
            return
        }
        try {
            setLoading(true)
            const response = await tablaSemanalService.agregarPrestamoATabla(
                tabla._id,
                prestamoSeleccionado._id
            )
            if (response?.data) {
                Swal.fire({
                    icon: "success",
                    title: "Éxito",
                    text: response.msg || "Préstamo agregado correctamente",
                })
                onItemAgregado?.(response.data)
                onHide()
            }
        } catch (error) {
            console.error("Error al agregar préstamo:", error)
            const mensaje = error.response?.data?.msg || "Error al agregar el préstamo"
            Swal.fire({
                icon: "error",
                title: "Error",
                text: mensaje,
            })
        } finally {
            setLoading(false)
        }
    }
    const handleLimpiarFiltros = () => {
        setBusqueda("")
        setCobradorFilter("")
        setEstadoFilter("")
        setPrestamoSeleccionado(null)
        cargarPrestamos()
    }
    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString("es-AR")
    }
    const formatearMonto = (monto) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
        }).format(monto)
    }
    return {
        loading,
        busqueda,
        setBusqueda,
        cobradorFilter,
        setCobradorFilter,
        estadoFilter,
        setEstadoFilter,
        prestamoSeleccionado,
        cobradores,
        prestamosFiltrados,
        handleSeleccionarPrestamo,
        handleAgregarItem,
        handleLimpiarFiltros,
        formatearFecha,
        formatearMonto
    }
}
export default useModalAgregarItem
