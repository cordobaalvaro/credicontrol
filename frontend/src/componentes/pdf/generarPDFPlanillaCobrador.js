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
export const generarPDFPlanillaCobrador = (tabla) => {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const margin = 36;
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFont(undefined, "bold");
    doc.setFontSize(16);
    doc.text("PLANILLA DE COBRO - PARA COMPLETAR", pageWidth / 2, 30, { align: "center" });
    doc.setFont(undefined, "normal");
    doc.setFontSize(12);
    const infoY = 50;
    doc.text(`Cobrador: ${tabla.cobrador?.nombre || 'N/A'} ${tabla.cobrador?.apellido || ''}`, margin, infoY);
    doc.text(`Período: ${formatDate(tabla.fechaInicio)} - ${formatDate(tabla.fechaFin)}`, margin, infoY + 20);
    doc.text(`Fecha generación: ${formatDate(new Date())}`, margin, infoY + 40);
    doc.setFontSize(9);
    doc.setFont(undefined, "italic");
    doc.text(
        "Complete la columna 'COBRADO' con el monto recibido de cada cliente. Use la columna 'NOTAS' para observaciones.",
        margin,
        infoY + 58
    );
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
        { content: "COBRADO", styles: { halign: "center" } },
        { content: "NOTAS / OBS.", styles: { halign: "left" } }
    );
    const head = [headRow];
    const body = tabla.items?.map(item => {
        const direccion = item.cliente?.direccionCobroFinal || item.cliente?.direccionComercial || item.cliente?.direccion || "-";
        const row = [
            `${item.cliente?.nombre || 'Sin Nombre'}\nDir: ${direccion}`,
            item.prestamo?.numero || 'N/A',
            item.zona?.nombre || 'Sin Zona',
            fmtMoney(item.montoCuotasEsperadoSemana || item.montoEsperado || item.esperado || 0)
        ];
        if (hasDeudaArrastrada) {
            row.push(fmtMoney(item.deudaArrastrada || 0));
        }
        row.push("");
        row.push("");
        return row;
    }) || [];
    const totalEsperado = tabla.items?.reduce((sum, item) => sum + (item.montoCuotasEsperadoSemana || item.montoEsperado || item.esperado || 0), 0) || 0;
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
        { content: "", styles: { fontStyle: "bold" } },
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
    columnStyles[colIndex++] = { halign: "center", cellWidth: 80, minCellHeight: 28 };
    columnStyles[colIndex] = { halign: "left", cellWidth: 110, minCellHeight: 28 };
    autoTable(doc, {
        head,
        body,
        startY,
        theme: "grid",
        margin: { left: margin, right: margin },
        styles: {
            fontSize: 9,
            cellPadding: 8,
            lineColor: [100, 100, 100],
            lineWidth: 0.7,
            halign: "center",
            valign: "middle",
        },
        headStyles: {
            fillColor: [230, 230, 230],
            textColor: [34, 34, 34],
            fontStyle: "bold",
            fontSize: 10,
        },
        alternateRowStyles: { fillColor: [255, 255, 255] },
        columnStyles,
        didDrawPage: (data) => {
            const pageSize = doc.internal.pageSize;
            const pageW = pageSize.getWidth();
            const pageH = pageSize.getHeight();
            doc.setFontSize(9);
            doc.setFont(undefined, "normal");
            doc.text(
                `Página ${doc.internal.getNumberOfPages()}`,
                pageW - margin,
                pageH - 10,
                { align: "right" }
            );
        },
    });
    const finalY = doc.lastAutoTable?.finalY || 400;
    const firmaY = Math.min(finalY + 50, doc.internal.pageSize.getHeight() - 50);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text("Firma cobrador: ____________________________", margin, firmaY);
    doc.text(`Fecha: ____/____/________`, margin + 350, firmaY);
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const fecha = `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
    const cobradorNombre = (tabla.cobrador?.nombre || 'cobrador').replace(/\s+/g, '_').toLowerCase();
    const fileName = `planilla_cobro_${cobradorNombre}_${fecha}.pdf`;
    doc.save(fileName);
};
export default generarPDFPlanillaCobrador;
