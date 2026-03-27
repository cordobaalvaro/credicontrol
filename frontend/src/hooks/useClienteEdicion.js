import { useState, useEffect } from "react";
import { clienteService } from "../services";
import Swal from "sweetalert2";
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
} from "../validators/cliente.validators";

const useClienteEdicion = ({ id, cliente, setCliente }) => {
  const [editMode, setEditMode] = useState(false);
  const [clienteEditado, setClienteEditado] = useState({});
  const [erroresValidacion, setErroresValidacion] = useState({});
  const [savingCliente, setSavingCliente] = useState(false);

  const validarFormulario = () => {
    const errores = {};
    const e1 = validarNombre(clienteEditado.nombre);
    if (e1) errores.nombre = e1;
    const e2 = validarDNI(clienteEditado.dni);
    if (e2) errores.dni = e2;
    const e3 = validarTelefono(clienteEditado.telefono);
    if (e3) errores.telefono = e3;
    const e4 = validarDireccion(clienteEditado.direccion);
    if (e4) errores.direccion = e4;
    const e5 = validarBarrio(clienteEditado.barrio);
    if (e5) errores.barrio = e5;
    const e6 = validarCiudad(clienteEditado.ciudad);
    if (e6) errores.ciudad = e6;
    const e7 = validarLocalidad(clienteEditado.localidad);
    if (e7) errores.localidad = e7;
    const e8 = validarFechaNacimiento(clienteEditado.fechaNacimiento);
    if (e8) errores.fechaNacimiento = e8;
    const e9 = validarDireccionComercial(clienteEditado.direccionComercial);
    if (e9) errores.direccionComercial = e9;
    const e10 = validarTipoDeComercio(clienteEditado.tipoDeComercio);
    if (e10) errores.tipoDeComercio = e10;
    const e11 = validarDireccionCobro(clienteEditado.direccionCobro);
    if (e11) errores.direccionCobro = e11;
    return errores;
  };

  const iniciarEdicion = () => {
    if (!cliente) return;
    setClienteEditado({
      nombre: cliente.nombre,
      dni: cliente.dni,
      telefono: cliente.telefono || "",
      direccion: cliente.direccion || "",
      barrio: cliente.barrio || "",
      ciudad: cliente.ciudad || "",
      localidad: cliente.localidad || "",
      fechaNacimiento: cliente.fechaNacimiento
        ? new Date(cliente.fechaNacimiento).toISOString().split("T")[0]
        : "",
      direccionComercial: cliente.direccionComercial || "",
      direccionCobro: cliente.direccionCobro || "direccionComercial",
      zona: cliente.zona?._id || "",
      tipoDeComercio: cliente.tipoDeComercio || "",
    });
    setEditMode(true);
  };

  const cancelarEdicion = () => {
    setEditMode(false);
    setClienteEditado({});
    setErroresValidacion({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClienteEditado((prev) => ({ ...prev, [name]: value }));
    const nuevosErrores = { ...erroresValidacion };
    const validators = {
      nombre: validarNombre,
      dni: validarDNI,
      telefono: validarTelefono,
      direccion: validarDireccion,
      barrio: validarBarrio,
      ciudad: validarCiudad,
      localidad: validarLocalidad,
      fechaNacimiento: validarFechaNacimiento,
      direccionComercial: validarDireccionComercial,
      tipoDeComercio: validarTipoDeComercio,
      direccionCobro: validarDireccionCobro,
    };
    if (validators[name]) {
      const err = validators[name](value);
      if (err) nuevosErrores[name] = err;
      else delete nuevosErrores[name];
    }
    setErroresValidacion(nuevosErrores);
  };

  const guardarCambios = async () => {
    if (savingCliente || !cliente) return;
    const errores = validarFormulario();
    setErroresValidacion(errores);
    if (Object.keys(errores).length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Error de validación",
        text: Object.values(errores)[0],
        confirmButtonColor: "#198754",
      });
      return;
    }
    try {
      setSavingCliente(true);
      const clienteData = { ...clienteEditado };
      if (!clienteData.zona || clienteData.zona.trim() === "")
        delete clienteData.zona;
      
      const response = await clienteService.actualizarCliente(id, clienteData);
      
      setCliente((prev) => ({
        ...prev,
        ...response.data,
        prestamos: prev?.prestamos,
      }));
      setEditMode(false);
      setClienteEditado({});
      setErroresValidacion({});
      Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "Los datos del cliente se han actualizado exitosamente",
        confirmButtonColor: "#198754",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      let errorText =
        err?.response?.data?.msg ||
        (err?.request
          ? "No se pudo conectar con el servidor"
          : "Error al actualizar el cliente");
      if (err?.response?.data?.status === 400)
        errorText = err.response.data.msg || "Ya existe otro cliente con este DNI";
      if (err?.response?.data?.status === 404)
        errorText = "Cliente no encontrado";
      if (err?.response?.data?.status === 500)
        errorText = "Error interno del servidor";
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: errorText,
        confirmButtonColor: "#198754",
      });
    } finally {
      setSavingCliente(false);
    }
  };

  return {
    editMode,
    clienteEditado,
    erroresValidacion,
    savingCliente,
    iniciarEdicion,
    cancelarEdicion,
    handleInputChange,
    guardarCambios,
    setErroresValidacion,
  };
};

export default useClienteEdicion;
