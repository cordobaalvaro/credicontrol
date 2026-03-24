import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
const fmtMoney = (n) => {
  const num = Number(n) || 0;
  return `$${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(num)}`;
};
const formatDate = (date) => {
  if (!date) return "- / - / -";
  const dateStr = typeof date === "string" ? date : new Date(date).toISOString();
  const part = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  const [year, month, day] = part.split("-");
  if (!year || !month || !day) return dateStr;
  return `${day}/${month}/${year}`;
};
export const generarPDFTablaSemanal = (tabla) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const margin = 36;
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFont(undefined, "bold");
  doc.setFontSize(16);
  doc.text("TABLA SEMANAL DE COBROS", pageWidth / 2, 30, { align: "center" });
  doc.setFont(undefined, "normal");
  doc.setFontSize(12);
  const infoY = 50;
  doc.text(`Cobrador: ${tabla.cobrador?.nombre || 'N/A'} ${tabla.cobrador?.apellido || ''}`, margin, infoY);
  doc.text(`Período: ${formatDate(tabla.fechaInicio)} - ${formatDate(tabla.fechaFin)}`, margin, infoY + 20);
  doc.text(`Estado: ${tabla.estado?.toUpperCase() || ''}`, margin, infoY + 40);
  doc.text(`Fecha generación: ${formatDate(new Date())}`, margin, infoY + 60);
  const startY = 120;
  const hasDeudaArrastrada = tabla.montoTotalDeudaArrastrada > 0;
  const headRow = [
    { content: "Cliente", styles: { halign: "left" } },
    { content: "Préstamo", styles: { halign: "center" } },
    { content: "Zona", styles: { halign: "center" } },
    { content: "Esperado", styles: { halign: "right" } }
  ];
  if (hasDeudaArrastrada) {
    headRow.push({ content: "Deuda Ant.", styles: { halign: "right" } });
  }
  headRow.push(
    { content: "Cobrado", styles: { halign: "right" } },
    { content: "Estado", styles: { halign: "center" } }
  );
  const head = [headRow];
  const body = tabla.items?.map(item => {
    const direccion = item.cliente?.direccionCobro || item.cliente?.direccionComercial || item.cliente?.direccion || "-";
    const row = [
      `${item.cliente?.nombre || 'Sin Nombre'}\nDir: ${direccion}`,
      item.prestamo?.numero || 'N/A',
      item.zona?.nombre || 'Sin Zona',
      fmtMoney(item.montoCuotasEsperadoSemana || item.montoEsperado || item.esperado || 0)
    ];
    if (hasDeudaArrastrada) {
      row.push(fmtMoney(item.deudaArrastrada || 0));
    }
    row.push(
      fmtMoney(item.montoCobrado || item.cobrado || 0),
      item.estado || 'pendiente'
    );
    return row;
  }) || [];
  const totalEsperado = tabla.items?.reduce((sum, item) => sum + (item.montoCuotasEsperadoSemana || item.montoEsperado || item.esperado || 0), 0) || 0;
  const totalCobrado = tabla.items?.reduce((sum, item) => sum + (item.montoCobrado || item.cobrado || 0), 0) || 0;
  const totalRow = [
    { content: "TOTALES", styles: { fontStyle: "bold", halign: "right" } },
    "",
    "",
    { content: fmtMoney(totalEsperado), styles: { fontStyle: "bold", halign: "right" } }
  ];
  if (hasDeudaArrastrada) {
    totalRow.push({ content: fmtMoney(tabla.montoTotalDeudaArrastrada || 0), styles: { fontStyle: "bold", halign: "right", textColor: [220, 38, 38] } });
  }
  totalRow.push(
    { content: fmtMoney(totalCobrado), styles: { fontStyle: "bold", halign: "right" } },
    ""
  );
  body.push(totalRow);
  const columnStyles = {
    0: { halign: "left" },
    1: { halign: "center" },
    2: { halign: "center" },
    3: { halign: "right" }
  };
  let colIndex = 4;
  if (hasDeudaArrastrada) {
    columnStyles[colIndex++] = { halign: "right", textColor: [220, 38, 38] };
  }
  columnStyles[colIndex++] = { halign: "right" };
  columnStyles[colIndex] = { halign: "center" };
  autoTable(doc, {
    head,
    body,
    startY,
    theme: "grid",
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 9,
      cellPadding: 8,
      lineColor: [220, 220, 220],
      lineWidth: 0.5,
      halign: "center",
      valign: "middle",
    },
    headStyles: {
      fillColor: [245, 245, 245],
      textColor: [34, 34, 34],
      fontStyle: "bold",
      fontSize: 10,
    },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    columnStyles,
    didDrawPage: () => {
      const pageSize = doc.internal.pageSize;
      const pageWidth = pageSize.getWidth();
      const pageHeight = pageSize.getHeight();
      doc.setFontSize(9);
      doc.text(
        `Página ${doc.internal.getNumberOfPages()}`,
        pageWidth - margin,
        pageHeight - 10,
        { align: "right" }
      );
    },
  });
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const fecha = `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
  const cobradorNombre = (tabla.cobrador?.nombre || 'cobrador').replace(/\s+/g, '_').toLowerCase();
  const fileName = `tabla_semanal_${cobradorNombre}_${fecha}.pdf`;
  doc.save(fileName);
};
export default generarPDFTablaSemanal;
