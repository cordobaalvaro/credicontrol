import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { usuarioService, zonaService } from "../services"
import { validarFormularioCobrador } from "../validators/cobrador.validators"

const useCobradores = (onCobradorActualizado) => {
  const [cobradores, setCobradores] = useState([])
  const [zonas, setZonas] = useState([])
  const [loading, setLoading] = useState(false)
  const [savingCrear, setSavingCrear] = useState(false)
  const [savingActualizar, setSavingActualizar] = useState(false)

  
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  
  const cobradorInicial = {
    nombre: "",
    contraseña: "",
    confirmarContraseña: "",
    usuarioLogin: "",
    telefono: "",
    zonaACargo: [],
  }

  const [nuevoCobrador, setNuevoCobrador] = useState(cobradorInicial)
  const [cobradorEditando, setCobradorEditando] = useState(null)
  const [cobradorEditado, setCobradorEditado] = useState(cobradorInicial)

  const fetchCobradores = async () => {
    try {
      setLoading(true)
      const response = await usuarioService.getUsuarios({ rol: "cobrador" })
      setCobradores(response.data || [])
    } catch (error) {
      console.error("Error al cargar cobradores:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los cobradores",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchZonas = async () => {
    try {
      const response = await zonaService.getZonas()
      setZonas(response.data || [])
    } catch (error) {
      console.error("Error al cargar zonas:", error)
    }
  }

  
  const abrirModalCrear = () => {
    setNuevoCobrador(cobradorInicial)
    setShowAddModal(true)
  }

  const cerrarModalCrear = () => {
    setShowAddModal(false)
    setNuevoCobrador(cobradorInicial)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === "zonaACargo") {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
      setNuevoCobrador((prev) => ({ ...prev, [name]: selectedOptions }))
    } else {
      setNuevoCobrador((prev) => ({ ...prev, [name]: value }))
    }
  }

  const onSubmitCrear = async (e) => {
    e.preventDefault()

    const errores = validarFormularioCobrador(nuevoCobrador)

    if (Object.keys(errores).length > 0) {
      const primerError = Object.values(errores)[0]
      return Swal.fire({
        icon: "error",
        title: "Error de validación",
        text: primerError,
      })
    }

    try {
      setSavingCrear(true)
      const data = {
        nombre: nuevoCobrador.nombre.trim(),
        contraseña: nuevoCobrador.contraseña.trim(),
        rol: "cobrador",
        usuarioLogin: nuevoCobrador.usuarioLogin.trim(),
        telefono: nuevoCobrador.telefono.trim(),
        zonaACargo: nuevoCobrador.zonaACargo.length > 0 ? nuevoCobrador.zonaACargo : undefined,
      }
      await usuarioService.crearUsuario(data)
      await fetchCobradores()
      cerrarModalCrear()
      onCobradorActualizado?.()
      Swal.fire({
        icon: "success",
        title: "¡Cobrador creado!",
        text: `El cobrador "${nuevoCobrador.nombre}" ha sido creado exitosamente`,
        timer: 1800,
        showConfirmButton: false,
      })
    } catch (err) {
      const errorText =
        err?.response?.data?.msg ||
        (err?.request ? "No se pudo conectar con el servidor" : "Error al crear el cobrador")
      Swal.fire({
        icon: "error",
        title: "Error al crear cobrador",
        text: errorText,
      })
    } finally {
      setSavingCrear(false)
    }
  }

  
  const abrirModalEdicion = (cobrador) => {
    setCobradorEditando(cobrador)
    setCobradorEditado({
      nombre: cobrador.nombre,
      usuarioLogin: cobrador.usuarioLogin || "",
      contraseña: "",
      confirmarContraseña: "",
      telefono: cobrador.telefono || "",
      zonaACargo: cobrador.zonaACargo?.map(z => z._id.toString()) || [],
    })
    setShowEditModal(true)
  }

  const cerrarModalEdicion = () => {
    setShowEditModal(false)
    setCobradorEditando(null)
    setCobradorEditado(cobradorInicial)
  }

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    if (name === "zonaACargo") {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
      setCobradorEditado((prev) => ({ ...prev, [name]: selectedOptions }))
    } else {
      setCobradorEditado((prev) => ({ ...prev, [name]: value }))
    }
  }

  const onSubmitEditar = async (e) => {
    e.preventDefault()

    const errores = validarFormularioCobrador(cobradorEditado)

    
    if (!cobradorEditado.contraseña.trim()) {
      delete errores.contraseña
      delete errores.confirmarContraseña
    }

    if (Object.keys(errores).length > 0) {
      const primerError = Object.values(errores)[0]
      return Swal.fire({
        icon: "error",
        title: "Error de validación",
        text: primerError,
      })
    }

    try {
      setSavingActualizar(true)
      const data = {
        nombre: cobradorEditado.nombre.trim(),
        usuarioLogin: cobradorEditado.usuarioLogin.trim(),
        telefono: cobradorEditado.telefono.trim(),
        zonaACargo: cobradorEditado.zonaACargo.length > 0 ? cobradorEditado.zonaACargo : undefined,
      }

      if (cobradorEditado.contraseña.trim()) data.contraseña = cobradorEditado.contraseña.trim()

      await usuarioService.actualizarUsuario(cobradorEditando._id, data)
      await fetchCobradores()
      cerrarModalEdicion()
      onCobradorActualizado?.()
      Swal.fire({
        icon: "success",
        title: "¡Cobrador actualizado!",
        text: `El cobrador "${cobradorEditado.nombre}" ha sido actualizado exitosamente`,
        timer: 1800,
        showConfirmButton: false,
      })
    } catch (err) {
      const errorText =
        err?.response?.data?.msg ||
        (err?.request ? "No se pudo conectar con el servidor" : "Error al actualizar el cobrador")
      Swal.fire({ icon: "error", title: "Error al actualizar", text: errorText })
    } finally {
      setSavingActualizar(false)
    }
  }

  
  const eliminarCobrador = async (cobrador) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Estás seguro?",
      text: `¿Quieres eliminar al cobrador "${cobrador.nombre}"? Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })

    if (!result.isConfirmed) return

    try {
      await usuarioService.eliminarUsuario(cobrador._id)
      await fetchCobradores()
      onCobradorActualizado?.()
      Swal.fire({
        icon: "success",
        title: "¡Eliminado!",
        text: `El cobrador "${cobrador.nombre}" ha sido eliminado`,
        timer: 1800,
        showConfirmButton: false,
      })
    } catch (err) {
      const errorText =
        err?.response?.data?.msg ||
        (err?.request ? "No se pudo conectar con el servidor" : "Error al eliminar el cobrador")
      Swal.fire({ icon: "error", title: "Error al eliminar", text: errorText })
    }
  }

  return {
    cobradores,
    zonas,
    loading,
    savingCrear,
    savingActualizar,
    showAddModal,
    showEditModal,
    nuevoCobrador,
    cobradorEditando,
    cobradorEditado,

    fetchCobradores,
    fetchZonas,
    abrirModalCrear,
    cerrarModalCrear,
    handleInputChange,
    onSubmitCrear,
    abrirModalEdicion,
    cerrarModalEdicion,
    handleEditInputChange,
    onSubmitEditar,
    eliminarCobrador
  }
}

export default useCobradores
