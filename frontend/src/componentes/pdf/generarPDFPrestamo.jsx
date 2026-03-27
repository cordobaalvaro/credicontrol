import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PDF_FOOTER_TEXT } from "../../helpers/branding";
const formatDate = (date) => {
  if (!date) return "-";
  const dateStr = typeof date === "string" ? date : new Date(date).toISOString();
  const part = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  const [year, month, day] = part.split("-");
  if (!year || !month || !day) return dateStr;
  return `${day}/${month}/${year}`;
};
export function generarPDFPrestamo(prestamo) {
  if (!prestamo) return;
  const doc = new jsPDF();
  doc.setFillColor(25, 135, 84);
  doc.rect(0, 0, 210, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("REPORTE DE PRÉSTAMO", 105, 13, { align: "center" });
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(13);
  doc.text("Detalles del Préstamo", 14, 28);
  const esVencido = prestamo.estado?.toLowerCase() === "vencido";
  const detalles = [
    ["NÂ° Préstamo", prestamo.numero || "N/A"],
    ["Nombre del Préstamo", prestamo.nombre || "-"],
    ["Cliente", prestamo.cliente?.nombre || "-"],
    ["DNI", prestamo.cliente?.dni || "-"],
    ["Teléfono", prestamo.cliente?.telefono || "-"],
    [
      "Tipo",
      (prestamo.tipo || "nuevo").toString().trim().toUpperCase(),
    ],
    ["Monto Inicial", `$${prestamo.montoInicial?.toLocaleString() || 0}`],
    ["Monto Total", `$${prestamo.montoTotal?.toLocaleString() || 0}`],
    ["Saldo Pendiente", `$${prestamo.saldoPendiente?.toLocaleString() || 0}`],
    ["Interés (%)", `${prestamo.interes || 0}%`],
    ["Interés Semanal", `$${prestamo.interesSemanal || 0}`],
    [
      "Fecha de Inicio",
      formatDate(prestamo.fechaInicio),
    ],
    [
      "Fecha de Vencimiento",
      formatDate(prestamo.fechaVencimiento),
    ],
    ["Cuotas", prestamo.cantidadCuotas || "-"],
    ["Frecuencia", prestamo.frecuencia || "-"],
    ["Estado", prestamo.estado || "-"],
  ];
  if (esVencido) {
    detalles.push(
      ["Semanas Vencidas", prestamo.semanasVencidas || "0"],
      ["Saldo Pendiente Vencimiento", `$${prestamo.saldoPendienteVencimiento?.toLocaleString() || 0}`]
    );
  }
  autoTable(doc, {
    startY: 31,
    head: [["Campo", "Valor"]],
    body: detalles,
    theme: "striped",
    styles: { fontSize: 10, cellPadding: 2 },
    headStyles: { fillColor: [25, 135, 84], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [240, 255, 245] },
    margin: { left: 12, right: 12 },
    tableLineColor: [25, 135, 84],
    tableLineWidth: 0.2,
  });
  let yCobros = doc.lastAutoTable
    ? doc.lastAutoTable.finalY + 10
    : 60;
  doc.setFontSize(13);
  doc.setTextColor(25, 135, 84);
  doc.text("Registros de Cobros", 14, yCobros);
  const registros = (prestamo.registroCobros || []).map((r, i) => [
    i + 1,
    r.monto ? `$${r.monto.toLocaleString()}` : "-",
    formatDate(r.fechaPago),
  ]);
  autoTable(doc, {
    startY: yCobros + 3,
    head: [["#", "Monto", "Fecha de Pago"]],
    body: registros,
    theme: "striped",
    styles: { fontSize: 10, cellPadding: 2 },
    headStyles: { fillColor: [25, 135, 84], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [240, 255, 245] },
    margin: { left: 12, right: 12 },
    tableLineColor: [25, 135, 84],
    tableLineWidth: 0.2,
  });
  const pageHeight = doc.internal.pageSize.height;
  doc.setDrawColor(25, 135, 84);
  doc.setLineWidth(0.5);
  doc.line(12, pageHeight - 18, 198, pageHeight - 18);
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(`Generado el ${new Date().toLocaleString()}`, 14, pageHeight - 10);
  doc.text(PDF_FOOTER_TEXT, 198, pageHeight - 10, { align: "right" });
  const idUnico = Date.now();
  const clienteNombre = (prestamo.cliente?.nombre || "reporte").toString().replace(/\s+/g, "_");
  doc.save(`Prestamo_${clienteNombre}_${idUnico}.pdf`);
}
