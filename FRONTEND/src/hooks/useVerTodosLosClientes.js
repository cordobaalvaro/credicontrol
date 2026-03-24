import { useState, useEffect } from "react"
import { zonaService, clienteService } from "../services"
import Swal from "sweetalert2"
import {
    validarNombre,
    validarDNI,
    validarTelefono,
    validarDireccion,
    validarBarrio,
    validarCiudad,
    validarLocalidad,
    validarFechaNacimiento,
    validarDireccionComercial,
    validarTipoDeComercio,
    validarDireccionCobro,
} from "../validators/cliente.validators"

const useVerTodosLosClientes = (fetchClientes) => {
    const [zonas, setZonas] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [showModalTipos, setShowModalTipos] = useState(false)
    const [savingCliente, setSavingCliente] = useState(false)
    const [viewMode, setViewMode] = useState("list")
    const [nuevoCliente, setNuevoCliente] = useState({
        nombre: "",
        dni: "",
        telefono: "",
        direccion: "",
        barrio: "",
        ciudad: "",
        localidad: "",
        fechaNacimiento: "",
        direccionComercial: "",
        direccionCobro: "direccion",
        tipoDeComercio: "",
        zona: "",
    })
    const [erroresValidacion, setErroresValidacion] = useState({})

    const fetchZonas = async () => {
        try {
            const response = await zonaService.getZonas()
            setZonas(response.data)
        } catch (error) {
            console.error("Error al cargar zonas:", error)
        }
    }

    useEffect(() => {
        fetchZonas()
    }, [])

    const handleNuevoClienteChange = (e) => {
        const { name, value } = e.target
        setNuevoCliente({ ...nuevoCliente, [name]: value })

        const nuevosErrores = { ...erroresValidacion }
        const setOrDel = (key, err) => {
            if (err) nuevosErrores[key] = err
            else delete nuevosErrores[key]
        }

        switch (name) {
            case "nombre": setOrDel("nombre", validarNombre(value)); break
            case "dni": setOrDel("dni", validarDNI(value)); break
            case "telefono": setOrDel("telefono", validarTelefono(value)); break
            case "direccion": setOrDel("direccion", validarDireccion(value)); break
            case "barrio": setOrDel("barrio", validarBarrio(value)); break
            case "ciudad": setOrDel("ciudad", validarCiudad(value)); break
            case "localidad": setOrDel("localidad", validarLocalidad(value)); break
            case "fechaNacimiento": setOrDel("fechaNacimiento", validarFechaNacimiento(value)); break
            case "direccionComercial": setOrDel("direccionComercial", validarDireccionComercial(value)); break
            case "tipoDeComercio": setOrDel("tipoDeComercio", validarTipoDeComercio(value)); break
            case "direccionCobro": setOrDel("direccionCobro", validarDireccionCobro(value)); break
            default: break
        }
        setErroresValidacion(nuevosErrores)
    }

    const validarFormulario = () => {
        const errores = {}
        const fields = [
            { name: "nombre", validator: validarNombre },
            { name: "dni", validator: validarDNI },
            { name: "telefono", validator: validarTelefono },
            { name: "direccion", validator: validarDireccion },
            { name: "barrio", validator: validarBarrio },
            { name: "ciudad", validator: validarCiudad },
            { name: "localidad", validator: validarLocalidad },
            { name: "fechaNacimiento", validator: validarFechaNacimiento },
            { name: "direccionComercial", validator: validarDireccionComercial },
            { name: "tipoDeComercio", validator: validarTipoDeComercio },
            { name: "direccionCobro", validator: validarDireccionCobro },
        ]

        fields.forEach(f => {
            const err = f.validator(nuevoCliente[f.name])
            if (err) errores[f.name] = err
        })
        return errores
    }

    const resetFormulario = () => {
        setNuevoCliente({
            nombre: "",
            dni: "",
            telefono: "",
            direccion: "",
            barrio: "",
            ciudad: "",
            localidad: "",
            fechaNacimiento: "",
            direccionComercial: "",
            direccionCobro: "direccion",
            tipoDeComercio: "",
            zona: "",
        })
        setErroresValidacion({})
    }

    const handleGuardarCliente = async (e) => {
        e?.preventDefault?.()
        const errores = validarFormulario()
        setErroresValidacion(errores)

        if (Object.keys(errores).length > 0) {
            const primerError = Object.values(errores)[0]
            Swal.fire({
                icon: "warning",
                title: "Error de validación",
                text: primerError,
            })
            return
        }

        try {
            setSavingCliente(true)
            const clienteData = { ...nuevoCliente }
            if (!clienteData.zona || clienteData.zona.trim() === "") delete clienteData.zona

            await clienteService.crearCliente(clienteData)

            await Swal.fire({
                icon: "success",
                title: "¡Éxito!",
                text: "Cliente creado exitosamente",
                showConfirmButton: false,
                timer: 1500,
            })

            setShowModal(false)
            resetFormulario()
            await fetchClientes()
        } catch (err) {
            const { status, msg } = err?.response?.data || {}
            let errorTitle = "Error"
            const errorText = msg || "Error al guardar el cliente"

            if (status === 400) errorTitle = "DNI duplicado"
            else if (status === 404) errorTitle = "Error de datos"
            else if (status === 500) errorTitle = "Error del servidor"

            Swal.fire({ icon: "error", title: errorTitle, text: errorText })
        } finally {
            setSavingCliente(false)
        }
    }

    const handleCerrarModal = () => {
        setShowModal(false)
        resetFormulario()
    }

    return {
        zonas,
        showModal,
        setShowModal,
        showModalTipos,
        setShowModalTipos,
        savingCliente,
        viewMode,
        setViewMode,
        nuevoCliente,
        erroresValidacion,
        handleNuevoClienteChange,
        handleGuardarCliente,
        handleCerrarModal,
    }
}

export default useVerTodosLosClientes
