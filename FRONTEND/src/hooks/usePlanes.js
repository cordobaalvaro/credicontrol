import { useEffect, useMemo, useRef, useState } from "react";
import { planService } from "../services";
import exportarTablaPDF from "../componentes/pdf/exportarTablaPDF";
import { COMPANY_NAME } from "../helpers/branding";
import { useAuth } from "../context/AuthContext";
const defaultData = {
  title: "",
  montos: [],
  planes: [],
};
const usePlanes = () => {
  const { user } = useAuth();
  const isAdmin = user?.rol === "admin";
  const nombreTabla = useMemo(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get("tabla") || "tabla-semanal";
    } catch {
      return "tabla-semanal";
    }
  }, []);
  const [title, setTitle] = useState(defaultData.title);
  const [montos, setMontos] = useState(defaultData.montos);
  const [planes, setPlanes] = useState(defaultData.planes);
  const [loading, setLoading] = useState(false);
  const [savedDocId, setSavedDocId] = useState(null);
  const [message, setMessage] = useState("");
  const [showModalCobrador, setShowModalCobrador] = useState(false);
  const containerRef = useRef(null);
  const prevPlanesCount = useRef(planes.length);
  const contentMaxWidth = useMemo(() => {
    const base = 900;
    const perPlan = 260;
    const max = 1800;
    return Math.min(max, base + planes.length * perPlan);
  }, [planes.length]);
  const alignLengths = (m = montos, p = planes) => {
    return p.map((plan) => {
      const filas = [...plan.filas];
      if (filas.length < m.length) {
        const toAdd = m.length - filas.length;
        for (let i = 0; i < toAdd; i++) filas.push({ semanas: 0, monto: 0 });
      } else if (filas.length > m.length) {
        filas.length = m.length;
      }
      return { ...plan, filas };
    });
  };
  const loadLatest = async () => {
    setMessage("");
    try {
      setLoading(true);
      const data = await planService.getPlanes({ tabla: nombreTabla, page: 1, limit: 1 });
      const doc = data?.items?.[0];
      if (doc?.data?.montos && doc?.data?.planes) {
        setTitle(doc.data.title || "");
        setMontos(doc.data.montos);
        setPlanes(alignLengths(doc.data.montos, doc.data.planes));
        setSavedDocId(doc._id);
        setMessage("Última versión cargada.");
      } else {
        setTitle(defaultData.title);
        setMontos(defaultData.montos);
        setPlanes(defaultData.planes);
        setSavedDocId(null);
        setMessage(
          "No hay datos guardados para esta tabla. Usa 'Generar Tablas' para crear datos iniciales."
        );
      }
    } catch (e) {
      setMessage(
        "Error al cargar datos. Usa 'Generar Tablas' para crear datos iniciales."
      );
      setTitle(defaultData.title);
      setMontos(defaultData.montos);
      setPlanes(defaultData.planes);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadLatest();
  }, [nombreTabla]);
  const addRow = () => {
    if (!isAdmin) return;
    const nextMontos = [...montos, 0];
    const nextPlanes = planes.map((pl) => ({
      ...pl,
      filas: [...pl.filas, { semanas: 0, monto: 0 }],
    }));
    setMontos(nextMontos);
    setPlanes(nextPlanes);
  };
  const addRowTop = () => {
    if (!isAdmin) return;
    const nextMontos = [0, ...montos];
    const nextPlanes = planes.map((pl) => ({
      ...pl,
      filas: [{ semanas: 0, monto: 0 }, ...pl.filas],
    }));
    setMontos(nextMontos);
    setPlanes(nextPlanes);
  };
  const removeRow = (idx) => {
    if (!isAdmin) return;
    const nextMontos = montos.filter((_, i) => i !== idx);
    const nextPlanes = planes.map((pl) => ({
      ...pl,
      filas: pl.filas.filter((_, i) => i !== idx),
    }));
    setMontos(nextMontos);
    setPlanes(nextPlanes);
  };
  const addPlan = () => {
    if (!isAdmin) return;
    const nombre = `Plan ${planes.length + 1}`;
    const nuevasFilas = montos.map(() => ({ semanas: 0, monto: 0 }));
    setPlanes((prev) => [...prev, { nombre, filas: nuevasFilas }]);
    setMessage(`Plan agregado: ${nombre}`);
  };
  const removePlan = (idx) => {
    if (!isAdmin) return;
    setPlanes((prev) => prev.filter((_, i) => i !== idx));
  };
  const onMontoChange = (idx, value) => {
    if (!isAdmin) return;
    let v = Number(value);
    if (!Number.isFinite(v)) v = 0;
    v = Math.floor(v);
    if (v < 0) v = 0;
    setMontos((prev) => prev.map((m, i) => (i === idx ? v : m)));
  };
  const onSemanasChange = (planIdx, rowIdx, value) => {
    if (!isAdmin) return;
    let v = Number(value);
    if (!Number.isFinite(v)) v = 0;
    v = Math.floor(v);
    if (v < 0) v = 0;
    setPlanes((prev) =>
      prev.map((pl, i) =>
        i !== planIdx
          ? pl
          : {
            ...pl,
            filas: pl.filas.map((f, j) =>
              j === rowIdx ? { ...f, semanas: v } : f
            ),
          }
      )
    );
  };
  const onMontoPlanChange = (planIdx, rowIdx, value) => {
    if (!isAdmin) return;
    let v = Number(value);
    if (!Number.isFinite(v)) v = 0;
    v = Math.floor(v);
    if (v < 0) v = 0;
    setPlanes((prev) =>
      prev.map((pl, i) =>
        i !== planIdx
          ? pl
          : {
            ...pl,
            filas: pl.filas.map((f, j) =>
              j === rowIdx ? { ...f, monto: v } : f
            ),
          }
      )
    );
  };
  const blockInvalidNumberKeys = (e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };
  const saveTable = async () => {
    if (!isAdmin) {
      setMessage("Solo un admin puede guardar.");
      return;
    }
    setMessage("");
    try {
      setLoading(true);
      const payload = { tabla: nombreTabla, data: { title, montos, planes } };
      const data = await planService.crearPlan(payload);
      setSavedDocId(data._id);
      setMessage("Guardado con éxito.");
    } catch (e) {
      setMessage(e?.response?.data?.message || "Error al guardar.");
    } finally {
      setLoading(false);
    }
  };
  const updateTable = async () => {
    if (!isAdmin) {
      setMessage("Solo un admin puede actualizar.");
      return;
    }
    if (!savedDocId) return saveTable();
    setMessage("");
    try {
      setLoading(true);
      const payload = { tabla: nombreTabla, data: { title, montos, planes } };
      await planService.updatePlan(savedDocId, payload);
      setMessage("Actualizado con éxito.");
    } catch (e) {
      setMessage(e?.response?.data?.message || "Error al actualizar.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (planes.length > prevPlanesCount.current) {
      const el = containerRef.current;
      if (el) el.scrollLeft = el.scrollWidth;
    }
    prevPlanesCount.current = planes.length;
  }, [planes.length]);
  const fmtMoney = (n) => {
    const num = Number(n) || 0;
    return `$${new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(num)}`;
  };
  const getPeriodoLabel = (title) => {
    switch (title) {
      case "ACTIVA SEMANAL":
        return "Sem";
      case "ACTIVA QUINCENAL":
        return "Quin";
      case "ACTIVA MENSUAL":
        return "Men";
      default:
        return "Sem";
    }
  };
  const exportPDF = () => {
    setShowModalCobrador(true);
  };
  const handleSeleccionarCobrador = (cobrador) => {
    const periodoLabel = getPeriodoLabel(title);
    exportarTablaPDF({
      planes,
      montos,
      title: COMPANY_NAME,
      periodoLabel,
      asesorNombre: cobrador.nombre,
      asesorTelefono: cobrador.telefono
    });
  };
  const generarTablas = async () => {
    if (!isAdmin) {
      setMessage("Solo un admin puede generar tablas.");
      return;
    }
    setMessage("");
    try {
      setLoading(true);
      const data = await planService.generarPlanes();
      setMessage(`Tablas generadas: ${data.resultados?.map(r => r.tabla).join(', ')}`);
      await loadLatest();
    } catch (e) {
      setMessage(e?.response?.data?.message || "Error al generar tablas.");
    } finally {
      setLoading(false);
    }
  };
  return {
    isAdmin,
    title,
    setTitle,
    montos,
    planes,
    loading,
    message,
    contentMaxWidth,
    containerRef,
    addRow,
    addRowTop,
    removeRow,
    addPlan,
    removePlan,
    onMontoChange,
    onSemanasChange,
    onMontoPlanChange,
    blockInvalidNumberKeys,
    saveTable,
    updateTable,
    loadLatest,
    fmtMoney,
    exportPDF,
    showModalCobrador,
    setShowModalCobrador,
    handleSeleccionarCobrador,
    generarTablas,
  };
};
export default usePlanes;
