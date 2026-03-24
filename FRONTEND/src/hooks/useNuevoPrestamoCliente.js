import { useState } from "react";
import { prestamoService, planService, clienteService } from "../services";
import Swal from "sweetalert2";
import { validarPrestamoCreacion } from "../validators/prestamo.validators";
const useNuevoPrestamoCliente = (clienteId, setCliente) => {
  const [showPrestamoModal, setShowPrestamoModal] = useState(false);
  const [nuevoPrestamo, setNuevoPrestamo] = useState({
    nombre: "",
    tipo: "nuevo",
    montoInicial: "",
    cantidadCuotas: "",
    interes: "",
    fechaInicio: "",
    frecuencia: "semanal",
  });
  const [usarPlan, setUsarPlan] = useState(false);
  const [planesTabla, setPlanesTabla] = useState(null);
  const [loadingPlanes, setLoadingPlanes] = useState(false);
  const [planIndex, setPlanIndex] = useState(0);
  const [montoPlanSeleccionado, setMontoPlanSeleccionado] = useState("");
  const [tablaPlanesSeleccionada, setTablaPlanesSeleccionada] = useState("");
  const [usarCuotaPersonalizada, setUsarCuotaPersonalizada] = useState(false);
  const [montoCuotaPersonalizada, setMontoCuotaPersonalizada] = useState("");
  const [erroresPrestamo, setErroresPrestamo] = useState({});
  const [creatingPrestamo, setCreatingPrestamo] = useState(false);
  const cargarPlanesTabla = async (frecuencia = "semanal") => {
    try {
      setLoadingPlanes(true);
      let tablaNombre;
      switch (frecuencia) {
        case "semanal":
          tablaNombre = "tabla-semanal";
          break;
        case "quincenal":
          tablaNombre = "tabla-quincenal";
          break;
        case "mensual":
          tablaNombre = "tabla-mensual";
          break;
        default:
          tablaNombre = "tabla-semanal";
      }
      const data = await planService.getPlanes({ tabla: tablaNombre, page: 1, limit: 1 });
      const doc = data?.items?.[0];
      if (doc?.data?.montos && doc?.data?.planes) {
        setPlanesTabla({ ...doc.data, _id: doc._id || doc.id });
      } else {
        setPlanesTabla(null);
      }
    } catch {
      setPlanesTabla(null);
    } finally {
      setLoadingPlanes(false);
    }
  };
  const cargarPlanesPorTitulo = async (titulo) => {
    try {
      setLoadingPlanes(true);
      let tablaNombre;
      switch (titulo) {
        case "ACTIVA SEMANAL":
          tablaNombre = "tabla-semanal";
          break;
        case "ACTIVA QUINCENAL":
          tablaNombre = "tabla-quincenal";
          break;
        case "ACTIVA MENSUAL":
          tablaNombre = "tabla-mensual";
          break;
        default:
          tablaNombre = "tabla-semanal";
      }
      const data = await planService.getPlanes({ tabla: tablaNombre, page: 1, limit: 1 });
      const doc = data?.items?.[0];
      if (doc?.data?.montos && doc?.data?.planes) {
        setPlanesTabla({ ...doc.data, _id: doc._id || doc.id });
        setTablaPlanesSeleccionada(doc.data.title);
        return { ...doc.data, _id: doc._id || doc.id };
      } else {
        setPlanesTabla(null);
        setTablaPlanesSeleccionada("");
        return null;
      }
    } catch {
      setPlanesTabla(null);
      setTablaPlanesSeleccionada("");
      return null;
    } finally {
      setLoadingPlanes(false);
    }
  };
  const aplicarSeleccionPlan = (montoValue, planIdxValue) => {
    if (!planesTabla?.montos || !planesTabla?.planes) return;
    const montoNum = Number(montoValue);
    const idxMonto = planesTabla.montos.findIndex((m) => Number(m) === montoNum);
    const planIdxNum = Number(planIdxValue);
    const fila = planesTabla.planes?.[planIdxNum]?.filas?.[idxMonto];
    const semanas = Number(fila?.semanas || 0);
    const montoCuota = Number(fila?.monto || 0);
    setNuevoPrestamo((prev) => ({
      ...prev,
      montoInicial: montoNum ? String(montoNum) : "",
      cantidadCuotas: semanas > 0 ? String(semanas) : "",
      frecuencia: prev.frecuencia,
      interes: "",
    }));
    setMontoCuotaPersonalizada(montoCuota > 0 ? String(montoCuota) : "");
  };
  const abrirModalPrestamo = () => {
    const hoy = new Date().toISOString().split("T")[0];
    setNuevoPrestamo({
      nombre: "",
      tipo: "nuevo",
      montoInicial: "",
      cantidadCuotas: "",
      interes: "",
      fechaInicio: hoy,
      frecuencia: "semanal",
    });
    setUsarCuotaPersonalizada(false);
    setMontoCuotaPersonalizada("");
    setUsarPlan(false);
    setPlanIndex(0);
    setMontoPlanSeleccionado("");
    setPlanesTabla(null);
    setErroresPrestamo({});
    setShowPrestamoModal(true);
    cargarPlanesTabla("semanal");
  };
  const cerrarModalPrestamo = () => {
    setShowPrestamoModal(false);
    setNuevoPrestamo({
      nombre: "",
      tipo: "nuevo",
      montoInicial: "",
      cantidadCuotas: "",
      interes: "",
      fechaInicio: "",
      frecuencia: "semanal",
    });
    setUsarCuotaPersonalizada(false);
    setMontoCuotaPersonalizada("");
    setUsarPlan(false);
    setPlanIndex(0);
    setMontoPlanSeleccionado("");
    setPlanesTabla(null);
    setErroresPrestamo({});
  };
  const handlePrestamoChange = (e) => {
    const { name, value } = e.target;
    setNuevoPrestamo((prev) => ({ ...prev, [name]: value }));
    if (name === "frecuencia") {
      setPlanesTabla(null);
      cargarPlanesTabla(value);
    }
  };
  const toggleUsarPlan = () => {
    setUsarPlan((prev) => {
      const next = !prev;
      setErroresPrestamo({});
      if (next) {
        setUsarCuotaPersonalizada(true);
        setNuevoPrestamo((p) => ({ ...p, interes: "", frecuencia: "semanal" }));
        cargarPlanesPorTitulo("ACTIVA SEMANAL");
      } else {
        setMontoPlanSeleccionado("");
        setPlanIndex(0);
        setMontoCuotaPersonalizada("");
        setUsarCuotaPersonalizada(false);
        setNuevoPrestamo((p) => ({ ...p, montoInicial: "", cantidadCuotas: "", interes: "" }));
        setTablaPlanesSeleccionada("");
      }
      return next;
    });
  };
  const handleMontoPlanChange = (e) => {
    const value = e.target.value;
    setMontoPlanSeleccionado(value);
    aplicarSeleccionPlan(value, planIndex);
  };
  const handlePlanIndexChange = (e) => {
    const value = Number(e.target.value);
    setPlanIndex(value);
    aplicarSeleccionPlan(montoPlanSeleccionado, value);
  };
  const handleCuotaPersonalizadaChange = (e) =>
    setMontoCuotaPersonalizada(e.target.value);
  const handleTablaPlanesChange = (e) => {
    const titulo = e.target.value;
    setTablaPlanesSeleccionada(titulo);
    if (titulo) {
      cargarPlanesPorTitulo(titulo).then(() => {
        if (montoPlanSeleccionado) {
          setTimeout(() => {
            aplicarSeleccionPlan(montoPlanSeleccionado, planIndex);
          }, 100);
        }
      });
      let nuevaFrecuencia = "semanal";
      switch (titulo) {
        case "ACTIVA SEMANAL":
          nuevaFrecuencia = "semanal";
          break;
        case "ACTIVA QUINCENAL":
          nuevaFrecuencia = "quincenal";
          break;
        case "ACTIVA MENSUAL":
          nuevaFrecuencia = "mensual";
          break;
      }
      setNuevoPrestamo((prev) => ({
        ...prev,
        frecuencia: nuevaFrecuencia,
      }));
    }
  };
  const toggleModoCuota = () => {
    setUsarCuotaPersonalizada((prev) => {
      const nuevoValor = !prev;
      if (nuevoValor) {
        setNuevoPrestamo((p) => ({ ...p, interes: "" }));
      } else {
        setMontoCuotaPersonalizada("");
      }
      return nuevoValor;
    });
  };
  const obtenerFrecuenciaTexto = (frecuencia) => {
    switch (frecuencia) {
      case "semanal":
        return "semanal";
      case "quincenal":
        return "quincenal";
      case "mensual":
        return "mensual";
      default:
        return "mensual";
    }
  };
  const crearPrestamo = async () => {
    if (creatingPrestamo) return;
    const errores = validarPrestamoCreacion(
      nuevoPrestamo,
      usarCuotaPersonalizada,
      montoCuotaPersonalizada
    );
    setErroresPrestamo(errores);
    if (Object.keys(errores).length > 0) return;
    try {
      setCreatingPrestamo(true);
      const montoInicial = parseFloat(nuevoPrestamo.montoInicial);
      const fechaISO = new Date(
        nuevoPrestamo.fechaInicio + "T12:00:00"
      ).toISOString();
      let response;
      if (usarPlan) {
        let tablaNombre;
        switch (nuevoPrestamo.frecuencia) {
          case "semanal":
            tablaNombre = "tabla-semanal";
            break;
          case "quincenal":
            tablaNombre = "tabla-quincenal";
            break;
          case "mensual":
            tablaNombre = "tabla-mensual";
            break;
          default:
            tablaNombre = "tabla-semanal";
        }
        const prestamoPlanData = {
          nombre: nuevoPrestamo.nombre,
          clienteId: clienteId,
          planId: planesTabla._id || planesTabla.id,
          planNombre: planesTabla.planes[planIndex]?.nombre,
          monto: montoInicial,
          tipo: nuevoPrestamo.tipo || "nuevo",
          fechaInicio: fechaISO,
        };
        response = await prestamoService.elegirPlan(prestamoPlanData);
      } else {
        const prestamoData = {
          nombre: nuevoPrestamo.nombre,
          cliente: clienteId,
          tipo: nuevoPrestamo.tipo || "nuevo",
          montoInicial,
          cantidadCuotas: parseInt(nuevoPrestamo.cantidadCuotas, 10),
          fechaInicio: fechaISO,
          frecuencia: nuevoPrestamo.frecuencia,
        };
        if (usarCuotaPersonalizada)
          prestamoData.montoCuotaPersonalizada = parseFloat(
            montoCuotaPersonalizada
          );
        else prestamoData.interes = parseFloat(nuevoPrestamo.interes);
        response = await prestamoService.crearPrestamo(prestamoData);
      }
      if (response) {
        const clientData = await clienteService.getClienteById(clienteId);
        setCliente(clientData.data);
        cerrarModalPrestamo();
        let montoTotal;
        let mensajeDetalle;
        if (usarCuotaPersonalizada || usarPlan) {
          montoTotal =
            parseFloat(montoCuotaPersonalizada) *
            parseInt(nuevoPrestamo.cantidadCuotas, 10);
          const interesCalculado =
            ((montoTotal - parseFloat(nuevoPrestamo.montoInicial)) /
              parseFloat(nuevoPrestamo.montoInicial)) *
            100;
          mensajeDetalle = `Se ha creado el préstamo de $${parseFloat(
            nuevoPrestamo.montoInicial
          ).toLocaleString()} (monto inicial) con cuotas de $${parseFloat(
            montoCuotaPersonalizada
          ).toLocaleString()} cada una. Total: $${montoTotal.toLocaleString()}. Interés calculado: ${interesCalculado.toFixed(
            2
          )}%`;
        } else {
          montoTotal =
            parseFloat(nuevoPrestamo.montoInicial) *
            (1 + parseFloat(nuevoPrestamo.interes) / 100);
          mensajeDetalle = `Se ha creado el préstamo de $${parseFloat(
            nuevoPrestamo.montoInicial
          ).toLocaleString()} (monto inicial) por un total de $${montoTotal.toLocaleString()} con ${
            nuevoPrestamo.cantidadCuotas
          } cuotas ${obtenerFrecuenciaTexto(
            nuevoPrestamo.frecuencia
          )}s`;
        }
        Swal.fire({
          icon: "success",
          title: "¡Préstamo creado!",
          text: mensajeDetalle,
          confirmButtonColor: "#198754",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      let errorText = "Error al crear el préstamo";
      const errorData = err.response?.data;
      if (errorData?.errors)
        errorText = `Errores de validación: ${Object.values(errorData.errors)
          .map((e) => e.message || e)
          .join(", ")}`;
      else if (errorData?.msg) errorText = errorData.msg;
      else if (errorData?.message) errorText = errorData.message;
      else if (typeof errorData === "string") errorText = errorData;
      else if (err.request) errorText = "No se pudo conectar con el servidor";
      Swal.fire({
        icon: "error",
        title: "Error al crear préstamo",
        text: errorText,
        confirmButtonColor: "#198754",
      });
    } finally {
      setCreatingPrestamo(false);
    }
  };
  return {
    showPrestamoModal,
    nuevoPrestamo,
    usarPlan,
    toggleUsarPlan,
    planesTabla,
    loadingPlanes,
    planIndex,
    montoPlanSeleccionado,
    usarCuotaPersonalizada,
    montoCuotaPersonalizada,
    erroresPrestamo,
    creatingPrestamo,
    abrirModalPrestamo,
    cerrarModalPrestamo,
    handlePrestamoChange,
    handleMontoPlanChange,
    handlePlanIndexChange,
    handleCuotaPersonalizadaChange,
    handleTablaPlanesChange,
    toggleModoCuota,
    crearPrestamo,
    tablaPlanesSeleccionada,
  };
};
export default useNuevoPrestamoCliente;
