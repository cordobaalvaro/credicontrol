import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { COMPANY_NAME } from "../../helpers/branding";
const fmtMoney = (n) => {
  const num = Number(n) || 0;
  return `$${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(num)}`;
};
const buildPDFData = (planes, montos, periodoLabel = "Sem") => {
  const firstHeaderRow = [
    { content: "Monto", rowSpan: 2, styles: { halign: "right" } },
    ...planes.map((pl) => ({
      content: pl.nombre,
      colSpan: 2,
      styles: { halign: "center" },
    })),
  ];
  const secondHeaderRow = planes.flatMap(() => [
    { content: periodoLabel, styles: { halign: "center" } },
    { content: "Monto", styles: { halign: "right" } },
  ]);
  const head = [firstHeaderRow, secondHeaderRow];
  const body = montos.map((monto, rIdx) => {
    const row = [fmtMoney(monto)];
    planes.forEach((pl) => {
      const sem = pl.filas?.[rIdx]?.semanas ?? 0;
      const mon = pl.filas?.[rIdx]?.monto ?? 0;
      row.push(String(sem));
      row.push(fmtMoney(mon));
    });
    return row;
  });
  return { head, body };
};
export const exportarTablaPDF = ({
  planes = [],
  montos = [],
  title = COMPANY_NAME,
  periodoLabel = "Sem",
  asesorNombre = "",
  asesorTelefono = "",
}) => {
  const cols = 1 + planes.length * 2;
  const orientation = cols >= 9 ? "landscape" : "portrait";
  const doc = new jsPDF({ orientation, unit: "pt", format: "a4" });
  const margin = 36;
  const pageWidth = doc.internal.pageSize.getWidth();
  const headerText = (title || COMPANY_NAME).toString().trim().toUpperCase();
  doc.setFont(undefined, "bold");
  doc.setFontSize(16);
  doc.text(headerText, pageWidth / 2, 30, { align: "center" });
  doc.setFont(undefined, "normal");
  const startY = 54;
  const { head, body } = buildPDFData(planes, montos, periodoLabel);
  const columnStyles = { 0: { halign: "right" } };
  for (let i = 0; i < planes.length; i++) {
    columnStyles[1 + i * 2] = { halign: "center" };
    columnStyles[1 + i * 2 + 1] = { halign: "right" };
  }
  const fontSize = cols <= 9 ? 10 : cols <= 13 ? 9 : 8;
  autoTable(doc, {
    head,
    body,
    startY,
    theme: "grid",
    margin: { left: margin, right: margin },
    styles: {
      fontSize,
      cellPadding: 7,
      lineColor: [220, 220, 220],
      lineWidth: 0.5,
      halign: "center",
      valign: "middle",
    },
    headStyles: {
      fillColor: [245, 245, 245],
      textColor: [34, 34, 34],
      fontStyle: "bold",
      fontSize: fontSize + 0,
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
  if (asesorNombre || asesorTelefono) {
    const finalY = doc.lastAutoTable.finalY || 200;
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    let asesorText = "";
    if (asesorNombre && asesorTelefono) {
      asesorText = `ASESOR: ${asesorNombre}     TELEFONO: ${asesorTelefono}`;
    } else if (asesorNombre) {
      asesorText = `ASESOR: ${asesorNombre}`;
    } else if (asesorTelefono) {
      asesorText = `TELEFONO: ${asesorTelefono}`;
    }
    doc.text(asesorText, margin, finalY + 30);
  }
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const fecha = `${pad(d.getDate())}-${pad(
    d.getMonth() + 1
  )}-${d.getFullYear()}`;
  const safeCompanyName = String(COMPANY_NAME || "empresa")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_\-]/g, "");
  const fileName = `planes_${safeCompanyName}_${fecha}.pdf`;
  doc.save(fileName);
};
export default exportarTablaPDF;
