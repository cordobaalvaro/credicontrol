import { useState } from "react"
import { zonaService } from "../services"
import Swal from "sweetalert2"

const useZonas = (onUpdate) => {
    const [zonasData, setZonasData] = useState([])
    const [loadingZonas, setLoadingZonas] = useState(false)
    const [showCrearZonaModal, setShowCrearZonaModal] = useState(false)
    const [showEditarZonaModal, setShowEditarZonaModal] = useState(false)
    const [nuevaZona, setNuevaZona] = useState({ nombre: "", localidades: [] })
    const [nuevaLocalidad, setNuevaLocalidad] = useState("")
    const [zonaEditando, setZonaEditando] = useState({ _id: "", nombre: "", localidades: [] })
    const [nuevaLocalidadEdit, setNuevaLocalidadEdit] = useState("")
    const [creatingZona, setCreatingZona] = useState(false)
    const [updatingZona, setUpdatingZona] = useState(false)
    const [deletingZona, setDeletingZona] = useState(false)

    const fetchZonasData = async (filtroMes, filtroAnio) => {
        try {
            setLoadingZonas(true)
            const response = await zonaService.getZonasDashboard(filtroMes, filtroAnio)
            setZonasData(response.data || [])
        } catch (err) {
            console.error("Error al cargar datos de zonas:", err)
            setZonasData([])
        } finally {
            setLoadingZonas(false)
        }
    }

    const abrirModalCrearZona = () => {
        setNuevaZona({ nombre: "", localidades: [] })
        setNuevaLocalidad("")
        setShowCrearZonaModal(true)
    }

    const cerrarModalCrearZona = () => {
        setShowCrearZonaModal(false)
        setNuevaZona({ nombre: "", localidades: [] })
        setNuevaLocalidad("")
    }

    const handleInputChangeZona = (e) => {
        const { name, value } = e.target
        setNuevaZona((prev) => ({ ...prev, [name]: value }))
    }

    const agregarLocalidad = () => {
        if (nuevaLocalidad.trim() && !nuevaZona.localidades.includes(nuevaLocalidad.trim())) {
            setNuevaZona((prev) => ({
                ...prev,
                localidades: [...prev.localidades, nuevaLocalidad.trim()],
            }))
            setNuevaLocalidad("")
        } else if (nuevaZona.localidades.includes(nuevaLocalidad.trim())) {
            Swal.fire({
                icon: "warning",
                title: "Localidad duplicada",
                text: "Esta localidad ya está agregada",
                confirmButtonColor: "#198754",
                timer: 1500,
                showConfirmButton: false,
            })
        }
    }

    const eliminarLocalidad = (index) => {
        setNuevaZona((prev) => ({
            ...prev,
            localidades: prev.localidades.filter((_, i) => i !== index),
        }))
    }

    const crearZona = async (filtroMes, filtroAnio) => {
        if (creatingZona) return
        if (!nuevaZona.nombre.trim()) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El nombre de la zona es obligatorio",
                confirmButtonColor: "#198754",
            })
            return
        }
        if (nuevaZona.localidades.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Debe agregar al menos una localidad",
                confirmButtonColor: "#198754",
            })
            return
        }
        try {
            setCreatingZona(true)
            const zonaData = {
                nombre: nuevaZona.nombre.trim(),
                localidades: nuevaZona.localidades,
            }
            await zonaService.crearZona(zonaData)
            
            
            await fetchZonasData(filtroMes, filtroAnio)
            
            if (onUpdate) onUpdate()
            cerrarModalCrearZona()
            Swal.fire({
                icon: "success",
                title: "¡Zona creada!",
                text: `La zona "${nuevaZona.nombre}" ha sido creada exitosamente`,
                confirmButtonColor: "#198754",
                timer: 2000,
                showConfirmButton: false,
            })
        } catch (err) {
            let errorText = "Error al crear la zona"
            if (err.response?.data) errorText = err.response.data.msg || err.response.data.message || errorText
            Swal.fire({
                icon: "error",
                title: "Error al crear zona",
                text: errorText,
                confirmButtonColor: "#198754",
            })
        } finally {
            setCreatingZona(false)
        }
    }

    const abrirModalEditarZona = (zona) => {
        setZonaEditando({
            _id: zona._id,
            nombre: zona.nombre,
            localidades: [...(zona.localidades || [])],
        })
        setNuevaLocalidadEdit("")
        setShowEditarZonaModal(true)
    }

    const cerrarModalEditarZona = () => {
        setShowEditarZonaModal(false)
        setZonaEditando({ _id: "", nombre: "", localidades: [] })
        setNuevaLocalidadEdit("")
    }

    const handleInputChangeEdit = (e) => {
        const { name, value } = e.target
        setZonaEditando((prev) => ({ ...prev, [name]: value }))
    }

    const agregarLocalidadEdit = () => {
        if (nuevaLocalidadEdit.trim() && !zonaEditando.localidades.includes(nuevaLocalidadEdit.trim())) {
            setZonaEditando((prev) => ({
                ...prev,
                localidades: [...prev.localidades, nuevaLocalidadEdit.trim()],
            }))
            setNuevaLocalidadEdit("")
        } else if (zonaEditando.localidades.includes(nuevaLocalidadEdit.trim())) {
            Swal.fire({
                icon: "warning",
                title: "Localidad duplicada",
                text: "Esta localidad ya está agregada",
                confirmButtonColor: "#198754",
                timer: 1500,
                showConfirmButton: false,
            })
        }
    }

    const eliminarLocalidadEdit = (index) => {
        setZonaEditando((prev) => ({
            ...prev,
            localidades: prev.localidades.filter((_, i) => i !== index),
        }))
    }

    const actualizarZona = async (filtroMes, filtroAnio) => {
        if (updatingZona) return
        if (!zonaEditando.nombre.trim()) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "El nombre de la zona es obligatorio",
                confirmButtonColor: "#198754",
            })
            return
        }
        if (zonaEditando.localidades.length === 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Debe agregar al menos una localidad",
                confirmButtonColor: "#198754",
            })
            return
        }
        try {
            setUpdatingZona(true)
            const zonaData = {
                nombre: zonaEditando.nombre.trim(),
                localidades: zonaEditando.localidades,
            }
            await zonaService.actualizarZona(zonaEditando._id, zonaData)
            
            
            await fetchZonasData(filtroMes, filtroAnio)
            
            if (onUpdate) onUpdate()
            cerrarModalEditarZona()
            Swal.fire({
                icon: "success",
                title: "¡Zona actualizada!",
                text: `La zona "${zonaEditando.nombre}" ha sido actualizada exitosamente`,
                confirmButtonColor: "#198754",
                timer: 2000,
                showConfirmButton: false,
            })
        } catch (err) {
            let errorText = "Error al actualizar la zona"
            if (err.response?.data) errorText = err.response.data.msg || err.response.data.message || errorText
            Swal.fire({
                icon: "error",
                title: "Error al actualizar zona",
                text: errorText,
                confirmButtonColor: "#198754",
            })
        } finally {
            setUpdatingZona(false)
        }
    }

    const eliminarZona = async (zona) => {
        const result = await Swal.fire({
            icon: "warning",
            title: "¿Estás seguro?",
            text: `¿Quieres eliminar la zona "${zona.nombre}"? Esta acción no se puede deshacer.`,
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        })
        if (!result.isConfirmed) return
        try {
            if (deletingZona) return
            setDeletingZona(true)
            await zonaService.eliminarZona(zona._id)
            
            
            setZonasData(prev => prev.filter(z => z._id !== zona._id))
            
            if (onUpdate) onUpdate()
            Swal.fire({
                icon: "success",
                title: "¡Eliminada!",
                text: `La zona "${zona.nombre}" ha sido eliminada exitosamente`,
                confirmButtonColor: "#198754",
                timer: 2000,
                showConfirmButton: false,
            })
        } catch (err) {
            let errorText = "Error al eliminar la zona"
            if (err.response?.data) errorText = err.response.data.msg || err.response.data.message || errorText
            Swal.fire({
                icon: "error",
                title: "Error al eliminar zona",
                text: errorText,
                confirmButtonColor: "#198754",
            })
        } finally {
            setDeletingZona(false)
        }
    }

    return {
        zonasData,
        loadingZonas,
        fetchZonasData,
        showCrearZonaModal,
        showEditarZonaModal,
        nuevaZona,
        setNuevaZona,
        nuevaLocalidad,
        setNuevaLocalidad,
        zonaEditando,
        setZonaEditando,
        nuevaLocalidadEdit,
        setNuevaLocalidadEdit,
        creatingZona,
        updatingZona,
        deletingZona,
        abrirModalCrearZona,
        cerrarModalCrearZona,
        handleInputChangeZona,
        agregarLocalidad,
        eliminarLocalidad,
        crearZona,
        abrirModalEditarZona,
        cerrarModalEditarZona,
        handleInputChangeEdit,
        agregarLocalidadEdit,
        eliminarLocalidadEdit,
        actualizarZona,
        eliminarZona,
    }
}

export default useZonas
