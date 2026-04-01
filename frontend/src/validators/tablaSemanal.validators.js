const isMonday = (yyyyMmDd) => {
  if (!yyyyMmDd) return false;
  const d = new Date(`${yyyyMmDd}T00:00:00`);
  return !Number.isNaN(d.getTime()) && d.getDay() === 1;
};

const addDaysYmd = (yyyyMmDd, days) => {
  if (!yyyyMmDd) return "";
  const d = new Date(`${yyyyMmDd}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + Number(days || 0));
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const validarGeneracionTablaSemanal = (cobradorId, fechaInicio, fechaFin) => {
  if (!cobradorId || !fechaInicio || !fechaFin) {
    return "Debes seleccionar un cobrador y un rango de fechas";
  }

  if (!isMonday(fechaInicio)) {
    return "La fecha de inicio debe ser un lunes";
  }

  const finEsperado = addDaysYmd(fechaInicio, 6);
  if (fechaFin !== finEsperado) {
    return "El período debe ser semanal (lunes a domingo).";
  }

  return null;
};


