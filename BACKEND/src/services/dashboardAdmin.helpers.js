
const getFiltroFechas = (mes, anio) => {
  const hoyReal = new Date();

  
  const m = mes !== undefined ? parseInt(mes) - 1 : hoyReal.getMonth();
  const a = anio !== undefined ? parseInt(anio) : hoyReal.getFullYear();

  
  const fechaReferencia = (m === hoyReal.getMonth() && a === hoyReal.getFullYear())
    ? new Date(hoyReal)
    : new Date(a, m + 1, 0, 23, 59, 59, 999);

  const primerDiaMes = new Date(a, m, 1);
  const ultimoDiaMes = new Date(a, m + 1, 0, 23, 59, 59, 999);

  const fechaHace4Semanas = new Date(fechaReferencia);
  fechaHace4Semanas.setDate(fechaHace4Semanas.getDate() - 28);

  const fechaHaceUnMes = new Date(fechaReferencia);
  fechaHaceUnMes.setMonth(fechaHaceUnMes.getMonth() - 1);

  const hace2Semanas = new Date(fechaReferencia);
  hace2Semanas.setDate(hace2Semanas.getDate() - 14);

  const en7Dias = new Date(fechaReferencia);
  en7Dias.setDate(en7Dias.getDate() + 7);

  const hoyFiltro = new Date(fechaReferencia);
  hoyFiltro.setHours(0, 0, 0, 0);

  const mananaFiltro = new Date(hoyFiltro);
  mananaFiltro.setDate(mananaFiltro.getDate() + 1);

  return {
    hoyReal,
    fechaReferencia,
    primerDiaMes,
    ultimoDiaMes,
    fechaHace4Semanas,
    fechaHaceUnMes,
    hace2Semanas,
    en7Dias,
    hoyFiltro,
    mananaFiltro,
    m,
    a
  };
};

module.exports = {
  getFiltroFechas,
};
