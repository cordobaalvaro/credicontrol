const env = (typeof import.meta !== "undefined" && import.meta.env) ? import.meta.env : {}
export const APP_NAME = env.VITE_APP_NAME || "CrediControl"
export const COMPANY_NAME = env.VITE_COMPANY_NAME || "CrediControl"
export const PDF_FOOTER_TEXT =
  env.VITE_PDF_FOOTER_TEXT ||
  `${APP_NAME}${COMPANY_NAME ? ` - ${COMPANY_NAME}` : ""}`
