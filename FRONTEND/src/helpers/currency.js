export const formatARS = (valor, { decimals = "auto" } = {}) => {
  const num = Number(valor || 0)
  const isInteger = Number.isInteger(num)
  const fractionDigits = decimals === "auto" ? (isInteger ? 0 : 2) : Number(decimals)
  return num.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
}
