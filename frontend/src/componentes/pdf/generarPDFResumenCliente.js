import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { APP_NAME, COMPANY_NAME } from "../../helpers/branding";

export const generarPDFResumenCliente = (datos) => {
  if (!datos) {
    console.error("No hay datos disponibles para generar el PDF");
    return;
  }
  const { cliente, prestamos, estadisticas } = datos;
  if (!cliente) {
    console.error("No hay datos de cliente");
    return;
  }
  const doc = new jsPDF();
  const fechaGeneracion = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const colorPrimario = [46, 125, 50];
  const colorTexto = [33, 33, 33];
  const colorVerde = [27, 94, 32];
  
  doc.setFillColor(...colorVerde);
  doc.rect(0, 0, 210, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("REPORTE RESUMEN DE CLIENTE", 105, 20, { align: "center" });
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Generado el: ${fechaGeneracion}`, 105, 30, { align: "center" });
  
  doc.setTextColor(...colorTexto);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("INFORMACIÓN DEL CLIENTE", 14, 55);
  doc.setDrawColor(...colorPrimario);
  doc.setLineWidth(1);
  doc.line(14, 58, 196, 58);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const infoCliente = [
    ["Cliente Nº:", cliente.numero || "N/A"],
    ["Nombre Completo:", cliente.nombre || "N/A"],
    ["DNI:", cliente.dni || "N/A"],
    ["Teléfono:", cliente.telefono || "N/A"],
    ["Dirección:", cliente.direccion || "N/A"],
    ["Zona:", cliente.zona?.nombre || "N/A"],
  ];
  let yPosition = 68;
  infoCliente.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colorPrimario);
    doc.text(label, 14, yPosition);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...colorTexto);
    doc.text(value.toString(), 80, yPosition);
    yPosition += 8;
  });
  
  yPosition += 15;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colorTexto);
  doc.text("RESUMEN FINANCIERO", 14, yPosition);
  doc.setDrawColor(...colorPrimario);
  doc.line(14, yPosition + 3, 196, yPosition + 3);
  yPosition += 13;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const resumenFinanciero = [
    ["Total de Préstamos:", estadisticas?.totalPrestamos || 0],
    ["Préstamos Activos:", estadisticas?.prestamosActivos || 0],
    ["Préstamos Vencidos:", estadisticas?.prestamosVencidos || 0],
    ["Préstamos Cancelados:", estadisticas?.prestamosCancelados || 0],
    ["Préstamos Refinanciados:", estadisticas?.prestamosRefinanciados || 0],
    ["Total Monto Prestado:", `$${(estadisticas?.montoPrestadoTotal || 0).toLocaleString()}`],
    ["Total Monto Total:", `$${(estadisticas?.totalMontoTotal || 0).toLocaleString()}`],
    ["Total Saldo Pendiente:", `$${(estadisticas?.totalSaldoPendiente || 0).toLocaleString()}`],
    ["Total Pagado:", `$${(estadisticas?.totalPagado || 0).toLocaleString()}`],
  ];
  resumenFinanciero.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colorPrimario);
    doc.text(label, 14, yPosition);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...colorTexto);
    doc.text(value.toString(), 100, yPosition);
    yPosition += 8;
  });
  
  if (prestamos && prestamos.length > 0) {
    yPosition += 15;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colorTexto);
    doc.text("DETALLE DE PRÉSTAMOS", 14, yPosition);
    doc.setDrawColor(...colorPrimario);
    doc.line(14, yPosition + 3, 196, yPosition + 3);
    const tablaPrestamos = prestamos.map((prestamo, index) => [
      prestamo.numero || index + 1,
      prestamo.nombre || "Sin nombre",
      (prestamo.tipo || "nuevo").toString().toUpperCase(),
      `$${(prestamo.montoInicial || 0).toLocaleString()}`,
      `$${(prestamo.montoTotal || 0).toLocaleString()}`,
      prestamo.estadoPrestamo === "vencido" && prestamo.saldoPendienteVencimiento
        ? `$${(prestamo.saldoPendienteVencimiento || 0).toLocaleString()}`
        : `$${(prestamo.saldoPendiente || 0).toLocaleString()}`,
      prestamo.estadoPrestamo?.toUpperCase() || "N/A",
    ]);
    autoTable(doc, {
      startY: yPosition + 8,
      head: [
        [
          "Nº Préstamo",
          "Nombre",
          "Tipo",
          "Monto Inicial",
          "Monto Total",
          "Saldo Pendiente",
          "Estado",
        ],
      ],
      body: tablaPrestamos,
      theme: "striped",
      styles: {
        cellPadding: 2,
        valign: "middle",
      },
      headStyles: {
        fillColor: colorPrimario,
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: "bold",
        halign: "center",
        valign: "middle",
      },
      bodyStyles: {
        fontSize: 9,
        textColor: colorTexto,
        valign: "middle",
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 20 },
        1: { halign: "left", cellWidth: 38 },
        2: { halign: "center", cellWidth: 22 },
        3: { halign: "right", cellWidth: 25 },
        4: { halign: "right", cellWidth: 25 },
        5: { halign: "right", cellWidth: 28 },
        6: { halign: "center", cellWidth: 24 },
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250],
      },
      margin: { left: 14, right: 14 },
      didParseCell: function (data) {
        if (data.column.index === 6) {
          const estado = data.cell.text[0];
          if (estado === "ACTIVO") {
            data.cell.styles.textColor = colorPrimario;
            data.cell.styles.fontStyle = "bold";
          } else if (estado === "COMPLETADO") {
            data.cell.styles.textColor = colorVerde;
            data.cell.styles.fontStyle = "bold";
          } else if (estado === "VENCIDO") {
            data.cell.styles.textColor = [255, 87, 34];
            data.cell.styles.fontStyle = "bold";
          } else if (estado === "CANCELADO") {
            data.cell.styles.textColor = [158, 158, 158];
            data.cell.styles.fontStyle = "bold";
          }
        }
      },
    });
  }
  const finalY = doc.previousAutoTable?.finalY || yPosition + 50;
  if (finalY < 250) {
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colorTexto);
    doc.text("ESTADÍSTICAS ADICIONALES", 14, finalY + 20);
    doc.setDrawColor(...colorPrimario);
    doc.line(14, finalY + 23, 196, finalY + 23);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const estadisticas_adicionales = [
      `• Total de préstamos registrados: ${estadisticas?.totalPrestamos || 0}`,
      `• Préstamos activos: ${estadisticas?.prestamosActivos || 0} | Completados: ${estadisticas?.prestamosCompletados || 0}`,
      `• Préstamos vencidos: ${estadisticas?.prestamosVencidos || 0} | Cancelados: ${estadisticas?.prestamosCancelados || 0}`,
      `• Porcentaje de saldo pendiente: ${
        estadisticas?.totalMontoTotal > 0
          ? ((estadisticas.totalSaldoPendiente / estadisticas.totalMontoTotal) * 100).toFixed(2)
          : 0
      }%`,
      `• Promedio por préstamo: $${
        estadisticas?.totalPrestamos > 0
          ? (estadisticas.totalMontoTotal / estadisticas.totalPrestamos).toLocaleString()
          : 0
      }`,
      `• Zona asignada: ${cliente.zona?.nombre || "No asignada"}`,
    ];
    let statsY = finalY + 33;
    estadisticas_adicionales.forEach((stat) => {
      doc.text(stat, 20, statsY);
      statsY += 8;
    });
  }
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Página ${i} de ${pageCount} - ${APP_NAME} - Sistema de Gestión ${COMPANY_NAME} - ${new Date().toLocaleDateString(
        "es-ES"
      )}`,
      105,
      285,
      { align: "center" }
    );
  }
  const nombreArchivo = `resumen_cliente_${cliente.nombre?.replace(
    /\s+/g,
    "_"
  )}_${cliente.numero}_${new Date().getTime()}.pdf`;
  doc.save(nombreArchivo);
};
