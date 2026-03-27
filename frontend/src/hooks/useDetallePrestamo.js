import { useState, useEffect, useMemo, useCallback } from "react";
import Swal from "sweetalert2";
import { prestamoService, registroCobroService } from "../services";
import { validarPrestamoEdicion } from "../validators/prestamo.validators";
import { useAuth } from "../context/AuthContext";

const useDetallePrestamo = ({ id, navigate }) => {
  const { user } = useAuth();
  const [erroresValidacionEdit, setErroresValidacionEdit] = useState({});
  const rol = user?.rol;
  const [prestamo, setPrestamo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showRegistroCobrosModal, setShowRegistroCobrosModal] = useState(false);
  const [showCrearRegistroCobroModal, setShowCrearRegistroCobroModal] =
    useState(false);
  const [showEditRegistroCobroModal, setShowEditRegistroCobroModal] =
    useState(false);
  const [showEditPrestamoModal, setShowEditPrestamoModal] = useState(false);

  const [creatingRegistro, setCreatingRegistro] = useState(false);
  const [updatingRegistro, setUpdatingRegistro] = useState(false);
  const [deletingRegistro, setDeletingRegistro] = useState(false);
  const [updatingPrestamo, setUpdatingPrestamo] = useState(false);
  const [deletingPrestamo, setDeletingPrestamo] = useState(false);
  const [togglingPrestamo, setTogglingPrestamo] = useState(false);

  const [datosNuevoRegistroCobro, setDatosNuevoRegistroCobro] = useState({
    monto: "",
    fechaPago: "",
  });
  const [registroCobroEditando, setRegistroCobroEditando] = useState(null);
  const [datosEditRegistroCobro, setDatosEditRegistroCobro] = useState({
    monto: "",
    fechaPago: "",
  });

  const [prestamoEditando, setPrestamoEditando] = useState(null);
  const [prestamoEditado, setPrestamoEditado] = useState({
    nombre: "",
    montoInicial: "",
    cantidadCuotas: "",
    interes: "",
    fechaInicio: "",
    frecuencia: "semanal",
  });
  const [usarCuotaPersonalizadaEdit, setUsarCuotaPersonalizadaEdit] =
    useState(false);
  const [montoCuotaPersonalizadaEdit, setMontoCuotaPersonalizadaEdit] =
    useState("");

  const obtenerPrestamo = useCallback(async () => {
    try {
      const data = await prestamoService.getPrestamoById(id);
      setPrestamo(data.data);
      setError("");
      return data.data;
    } catch (err) {
      setError("No se pudo cargar el préstamo.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    obtenerPrestamo();
  }, [obtenerPrestamo]);

  const registrosCobro = useMemo(() => {
    if (!prestamo?.registroCobros || !Array.isArray(prestamo.registroCobros))
      return [];
    return prestamo.registroCobros.map((registro) => ({
      monto: registro.monto || 0,
      fechaPago: registro.fechaPago || null,
      registroCompleto: registro,
    }));
  }, [prestamo]);

  const abrirModalRegistroCobros = () => setShowRegistroCobrosModal(true);
  const cerrarModalRegistroCobros = () => setShowRegistroCobrosModal(false);

  const abrirModalCrearRegistroCobro = () => {
    const dummy = new Date();
    const localDay = `${dummy.getFullYear()}-${String(dummy.getMonth() + 1).padStart(2, "0")}-${String(dummy.getDate()).padStart(2, "0")}`;
    setDatosNuevoRegistroCobro({
      monto: "",
      fechaPago: localDay,
    });
    setShowCrearRegistroCobroModal(true);
  };
  const cerrarModalCrearRegistroCobro = () => {
    setShowCrearRegistroCobroModal(false);
    setDatosNuevoRegistroCobro({ monto: "", fechaPago: "" });
  };

  const handleInputChangeNuevoRegistroCobro = (e) => {
    const { name, value } = e.target;
    setDatosNuevoRegistroCobro((prev) => ({ ...prev, [name]: value }));
  };

  const crearRegistroCobro = async (prestamoId, nuevoRegistro) => {
    if (creatingRegistro) return false;
    try {
      setCreatingRegistro(true);
      await registroCobroService.crearRegistro(prestamoId, nuevoRegistro);
      await obtenerPrestamo();
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Registro de cobro creado exitosamente",
        confirmButtonColor: "#198754",
        timer: 2000,
        showConfirmButton: false,
      });
      return true;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "No se pudo crear el registro de cobro",
        confirmButtonColor: "#198754",
      });
      return false;
    } finally {
      setCreatingRegistro(false);
    }
  };

  const guardarNuevoRegistroCobro = async () => {
    if (!datosNuevoRegistroCobro.monto || parseFloat(datosNuevoRegistroCobro.monto) <= 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor ingrese un monto válido mayor que 0",
        confirmButtonColor: "#198754",
      });
      return;
    }
    if (!datosNuevoRegistroCobro.fechaPago) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor seleccione una fecha",
        confirmButtonColor: "#198754",
      });
      return;
    }
    const nuevoRegistro = {
      monto: parseFloat(datosNuevoRegistroCobro.monto),
      fechaPago: datosNuevoRegistroCobro.fechaPago + "T12:00:00",
    };
    const ok = await crearRegistroCobro(prestamo._id, nuevoRegistro);
    if (ok) cerrarModalCrearRegistroCobro();
  };

  const abrirModalEditRegistroCobro = (registro) => {
    setRegistroCobroEditando(registro);
    setDatosEditRegistroCobro({
      monto: registro.monto || "",
      fechaPago: registro.fechaPago
        ? registro.fechaPago.split("T")[0]
        : "",
    });
    setShowEditRegistroCobroModal(true);
  };
  const cerrarModalEditRegistroCobro = () => {
    setShowEditRegistroCobroModal(false);
    setRegistroCobroEditando(null);
    setDatosEditRegistroCobro({ monto: "", fechaPago: "" });
  };
  const handleInputChangeEditRegistroCobro = (e) => {
    const { name, value } = e.target;
    setDatosEditRegistroCobro((prev) => ({ ...prev, [name]: value }));
  };
  const guardarCambiosRegistroCobro = async () => {
    if (!registroCobroEditando || !prestamo) return;
    try {
      if (updatingRegistro) return;
      setUpdatingRegistro(true);
      const datosActualizados = {
        monto: parseFloat(datosEditRegistroCobro.monto) || 0,
        fechaPago: datosEditRegistroCobro.fechaPago + "T12:00:00",
      };
      await registroCobroService.actualizarRegistro(prestamo._id, registroCobroEditando._id, datosActualizados);
      await obtenerPrestamo();
      cerrarModalEditRegistroCobro();
      Swal.fire({
        title: "¡Éxito!",
        text: "Registro de cobro actualizado correctamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar el registro de cobro",
        icon: "error",
      });
    } finally {
      setUpdatingRegistro(false);
    }
  };

  const eliminarRegistroCobro = async (prestamoId, registroId) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Estás seguro?",
      text: "¿Quieres eliminar este registro de cobro? Esta acción no se puede deshacer.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
    });
    if (!result.isConfirmed) return;
    try {
      if (deletingRegistro) return;
      setDeletingRegistro(true);
      await registroCobroService.eliminarRegistro(prestamoId, registroId);
      await obtenerPrestamo();
      setTimeout(
        () =>
          Swal.fire({
            icon: "success",
            title: "¡Éxito!",
            text: "Registro de cobro eliminado exitosamente",
            confirmButtonColor: "#198754",
            timer: 2000,
            showConfirmButton: false,
          }),
        100
      );
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "No se pudo eliminar el registro de cobro",
        confirmButtonColor: "#198754",
      });
    } finally {
      setDeletingRegistro(false);
    }
  };

  const desactivarPrestamo = async (prestamoId) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Estás seguro?",
      text: "¿Quieres desactivar este préstamo? Esta acción cambiará el estado del préstamo.",
      showCancelButton: true,
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
    });
    if (!result.isConfirmed) return;
    try {
      if (togglingPrestamo) return;
      setTogglingPrestamo(true);
      await prestamoService.desactivarPrestamo(prestamoId);
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Préstamo desactivado exitosamente",
        confirmButtonColor: "#198754",
        timer: 2000,
        showConfirmButton: false,
      });
      await obtenerPrestamo();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message || "No se pudo desactivar el préstamo",
        confirmButtonColor: "#198754",
      });
    } finally {
      setTogglingPrestamo(false);
    }
  };

  const activarPrestamo = async (prestamoId) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Estás seguro?",
      text: "¿Quieres activar este préstamo?",
      showCancelButton: true,
      confirmButtonText: "Sí, activar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#198754",
      cancelButtonColor: "#6c757d",
    });
    if (!result.isConfirmed) return;
    try {
      if (togglingPrestamo) return;
      setTogglingPrestamo(true);
      await prestamoService.activarPrestamo(prestamoId);
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Préstamo activado exitosamente",
        confirmButtonColor: "#198754",
        timer: 2000,
        showConfirmButton: false,
      });
      await obtenerPrestamo();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message || "No se pudo activar el préstamo",
        confirmButtonColor: "#198754",
      });
    } finally {
      setTogglingPrestamo(false);
    }
  };

  const abrirModalEditarPrestamo = (prestamoSel) => {
    setPrestamoEditando(prestamoSel);
    const usaCuotaPersonalizada =
      prestamoSel.montoCuotaPersonalizada !== undefined &&
      prestamoSel.montoCuotaPersonalizada !== null;
    setPrestamoEditado({
      nombre: prestamoSel.nombre || "",
      montoInicial: prestamoSel.montoInicial || "",
      cantidadCuotas: prestamoSel.cantidadCuotas || "",
      interes: prestamoSel.interes || "",
      fechaInicio: prestamoSel.fechaInicio
        ? new Date(prestamoSel.fechaInicio).toISOString().split("T")[0]
        : "",
      frecuencia: prestamoSel.frecuencia || "semanal",
    });
    setUsarCuotaPersonalizadaEdit(usaCuotaPersonalizada);
    setMontoCuotaPersonalizadaEdit(
      usaCuotaPersonalizada ? prestamoSel.montoCuotaPersonalizada || "" : ""
    );
    setShowEditPrestamoModal(true);
  };

  const cerrarModalEditarPrestamo = () => {
    setShowEditPrestamoModal(false);
    setPrestamoEditando(null);
    setPrestamoEditado({
      nombre: "",
      montoInicial: "",
      cantidadCuotas: "",
      interes: "",
      fechaInicio: "",
      frecuencia: "semanal",
    });
    setUsarCuotaPersonalizadaEdit(false);
    setMontoCuotaPersonalizadaEdit("");
    setErroresValidacionEdit({});
  };

  const handleEditPrestamoChange = (e) => {
    const { name, value } = e.target;
    setPrestamoEditado((prev) => ({ ...prev, [name]: value }));
  };

  const handleCuotaPersonalizadaEditChange = (e) =>
    setMontoCuotaPersonalizadaEdit(e.target.value);

  const toggleModoCuotaEdit = () => {
    setUsarCuotaPersonalizadaEdit((prev) => !prev);
    if (usarCuotaPersonalizadaEdit) setMontoCuotaPersonalizadaEdit("");
    else setPrestamoEditado((prev) => ({ ...prev, interes: "" }));
  };

  const editarPrestamo = async () => {
    const nuevosErrores = validarPrestamoEdicion(
      prestamoEditado,
      usarCuotaPersonalizadaEdit,
      montoCuotaPersonalizadaEdit
    );
    setErroresValidacionEdit(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    try {
      if (updatingPrestamo) return;
      setUpdatingPrestamo(true);
      const montoInicial = parseFloat(prestamoEditado.montoInicial);
      const interes = parseFloat(prestamoEditado.interes);
      const cantidadCuotas = parseInt(prestamoEditado.cantidadCuotas, 10);
      const prestamoData = {};

      if (prestamoEditado.nombre.trim() !== (prestamoEditando.nombre || ""))
        prestamoData.nombre = prestamoEditado.nombre.trim();
      if (montoInicial !== prestamoEditando.montoInicial)
        prestamoData.montoInicial = montoInicial;
      if (cantidadCuotas !== prestamoEditando.cantidadCuotas)
        prestamoData.cantidadCuotas = cantidadCuotas;
      if (!usarCuotaPersonalizadaEdit && interes !== prestamoEditando.interes)
        prestamoData.interes = interes;
      if (usarCuotaPersonalizadaEdit)
        prestamoData.montoCuotaPersonalizada = parseFloat(
          montoCuotaPersonalizadaEdit
        );

      const fechaOriginal = prestamoEditando.fechaInicio
        ? new Date(prestamoEditando.fechaInicio).toISOString().split("T")[0]
        : "";
      if (prestamoEditado.fechaInicio !== fechaOriginal)
        prestamoData.fechaInicio = new Date(
          prestamoEditado.fechaInicio + "T12:00:00"
        ).toISOString();

      if (prestamoEditado.frecuencia !== prestamoEditando.frecuencia)
        prestamoData.frecuencia = prestamoEditado.frecuencia;

      if (Object.keys(prestamoData).length === 0) {
        Swal.fire({
          icon: "info",
          title: "Sin cambios",
          text: "No se detectaron cambios en el préstamo",
          confirmButtonColor: "#198754",
        });
        return;
      }

      await prestamoService.updatePrestamo(prestamoEditando._id, prestamoData);
      await obtenerPrestamo();
      cerrarModalEditarPrestamo();
      Swal.fire({
        icon: "success",
        title: "¡Préstamo actualizado!",
        text: `Se ha actualizado el préstamo exitosamente`,
        confirmButtonColor: "#198754",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      const errorText =
        err.response?.data?.msg ||
        (err.request
          ? "No se pudo conectar con el servidor"
          : "Error al actualizar el préstamo");
      Swal.fire({
        icon: "error",
        title: "Error al actualizar préstamo",
        text: errorText,
        confirmButtonColor: "#198754",
      });
    } finally {
      setUpdatingPrestamo(false);
    }
  };

  const eliminarPrestamo = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas eliminar el préstamo de $${Number(
        prestamo.montoInicial || 0
      ).toLocaleString()}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#198754",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      if (deletingPrestamo) return;
      setDeletingPrestamo(true);
      await prestamoService.eliminarPrestamo(prestamo._id);
      Swal.fire({
        icon: "success",
        title: "¡Eliminado!",
        text: "El préstamo ha sido eliminado exitosamente",
        confirmButtonColor: "#198754",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate(`/cliente/${prestamo.cliente._id}`);
    } catch (err) {
      const errorText =
        err.response?.data?.msg ||
        (err.request
          ? "No se pudo conectar con el servidor"
          : "Error al eliminar el préstamo");
      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: errorText,
        confirmButtonColor: "#198754",
      });
    } finally {
      setDeletingPrestamo(false);
    }
  };

  return {
    prestamo,
    loading,
    error,
    rol,

    registrosCobro,
    showRegistroCobrosModal,
    showCrearRegistroCobroModal,
    showEditRegistroCobroModal,
    datosNuevoRegistroCobro,
    datosEditRegistroCobro,
    creatingRegistro,
    updatingRegistro,
    deletingRegistro,

    abrirModalRegistroCobros,
    cerrarModalRegistroCobros,
    abrirModalCrearRegistroCobro,
    cerrarModalCrearRegistroCobro,
    handleInputChangeNuevoRegistroCobro,
    abrirModalEditRegistroCobro,
    cerrarModalEditRegistroCobro,
    handleInputChangeEditRegistroCobro,
    guardarNuevoRegistroCobro,
    guardarCambiosRegistroCobro,
    eliminarRegistroCobro,

    showEditPrestamoModal,
    prestamoEditado,
    erroresValidacionEdit,
    usarCuotaPersonalizadaEdit,
    montoCuotaPersonalizadaEdit,
    updatingPrestamo,
    deletingPrestamo,
    togglingPrestamo,

    abrirModalEditarPrestamo,
    cerrarModalEditarPrestamo,
    handleEditPrestamoChange,
    handleCuotaPersonalizadaEditChange,
    toggleModoCuotaEdit,
    editarPrestamo,
    eliminarPrestamo,
    activarPrestamo,
    desactivarPrestamo,
  };
};

export default useDetallePrestamo;
