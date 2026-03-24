import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
Font.register({
  family: "Helvetica",
  src: "https://fonts.googleapis.com/css2?family=Helvetica:wght@400;700&display=swap",
});
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 20,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
    borderBottom: "2 solid #198754",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    marginBottom: 5,
    color: "#198754",
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 3,
    color: "#666666",
  },
  infoSection: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
    border: "1 solid #e9ecef",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  infoLabel: {
    fontFamily: "Helvetica-Bold",
    width: 120,
    color: "#495057",
  },
  infoValue: {
    flex: 1,
    color: "#212529",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#198754",
    color: "#ffffff",
    padding: 8,
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #e9ecef",
    padding: 6,
    fontSize: 9,
  },
  tableRowEven: {
    backgroundColor: "#f8f9fa",
  },
  colNumero: {
    width: 40,
    textAlign: "center",
  },
  colMonto: {
    width: 80,
    textAlign: "right",
  },
  colFecha: {
    flex: 1,
    textAlign: "center",
  },
  estadisticasSection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#e8f5e8",
    borderRadius: 5,
    border: "1 solid #198754",
  },
  estadisticasTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    color: "#198754",
  },
  estadisticaRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    fontSize: 8,
    color: "#6c757d",
    borderTop: "1 solid #e9ecef",
    paddingTop: 5,
    textAlign: "center",
  },
});
const formatearMonto = (monto) => {
  if (!monto || isNaN(monto)) return "$0";
  return `$${Number(monto).toLocaleString("es-ES")}`;
};
const formatearFecha = (fechaStr) => {
  if (!fechaStr) return "No especificada";
  try {
    const part = fechaStr.includes("T") ? fechaStr.split("T")[0] : fechaStr;
    const [year, month, day] = part.split("-");
    if (!year || !month || !day) return fechaStr;
    const meses = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    return `${parseInt(day)} de ${meses[parseInt(month) - 1]} de ${year}`;
  } catch (error) {
    return "Fecha inválida";
  }
};
const DocumentoRegistrosCobros = ({ prestamoData, registrosCobros, estadisticas }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {}
      <View style={styles.header}>
        <Text style={styles.title}>REPORTE DE REGISTROS DE COBROS</Text>
        <Text style={styles.subtitle}>
          {prestamoData?.cliente?.nombre || "Cliente"} - {prestamoData?.nombre || "Préstamo"}
        </Text>
      </View>
      {}
      <View style={styles.infoSection}>
        <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 8, color: "#198754" }}>
          {prestamoData?.tipo === "refinanciado" ? "Información del Préstamo Refinanciado" : "Información del Préstamo"}
        </Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>NÂ° Préstamo:</Text>
          <Text style={styles.infoValue}>{prestamoData?.numero || "N/A"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Cliente:</Text>
          <Text style={styles.infoValue}>{prestamoData?.cliente?.nombre || "-"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>DNI:</Text>
          <Text style={styles.infoValue}>{prestamoData?.cliente?.dni || "-"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{prestamoData?.tipo === "refinanciado" ? "Última Deuda:" : "Monto Prestado:"}</Text>
          <Text style={styles.infoValue}>{formatearMonto(prestamoData?.montoPrestado)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Monto de Cuota:</Text>
          <Text style={styles.infoValue}>{formatearMonto(prestamoData?.montoCuota || prestamoData?.planDeCuotas?.[0]?.monto)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{prestamoData?.tipo === "refinanciado" ? "Monto Refinanciado:" : "Monto Total:"}</Text>
          <Text style={styles.infoValue}>{formatearMonto(prestamoData?.monto)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Estado:</Text>
          <Text style={styles.infoValue}>{prestamoData?.estado || "-"}</Text>
        </View>
      </View>
      {}
      <Text style={{ fontSize: 12, fontFamily: "Helvetica-Bold", marginBottom: 8, color: "#198754" }}>
        Registros de Cobros
      </Text>
      <View style={styles.tableHeader}>
        <Text style={styles.colNumero}>#</Text>
        <Text style={styles.colMonto}>Monto</Text>
        <Text style={styles.colFecha}>Fecha</Text>
      </View>
      {registrosCobros && registrosCobros.length > 0 ? (
        registrosCobros.map((registro, index) => (
          <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.tableRowEven : null]}>
            <Text style={styles.colNumero}>{index + 1}</Text>
            <Text style={styles.colMonto}>{formatearMonto(registro.monto)}</Text>
            <Text style={styles.colFecha}>{formatearFecha(registro.fechaPago)}</Text>
          </View>
        ))
      ) : (
        <View style={styles.tableRow}>
          <Text style={{ flex: 1, textAlign: "center", color: "#6c757d" }}>
            No hay registros de cobros
          </Text>
        </View>
      )}
      {}
      <View style={styles.footer}>
        <Text>Generado el {new Date().toLocaleDateString("es-ES")} a las {new Date().toLocaleTimeString("es-ES")}</Text>
        <Text>Sistema de Gestión de Préstamos</Text>
      </View>
    </Page>
  </Document>
);
export default DocumentoRegistrosCobros;
