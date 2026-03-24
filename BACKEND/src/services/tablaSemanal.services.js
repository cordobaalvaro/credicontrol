const adminServices = require("./tablaSemanal.admin.services")
const cobradorServices = require("./tablaSemanal.cobrador.services")
const sharedServices = require("./tablaSemanal.shared.services")

module.exports = {
  ...adminServices,
  ...cobradorServices,
  ...sharedServices,
}
