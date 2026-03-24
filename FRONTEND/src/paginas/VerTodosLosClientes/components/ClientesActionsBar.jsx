import { IconPlus, IconFilter } from "@tabler/icons-react"
import PageHeaderButton from "../../../componentes/ui/PageHeaderButton"
const ClientesActionsBar = ({ onShowModalTipos, onShowModal }) => {
  return (
    <div className="d-flex gap-2">
      <PageHeaderButton onClick={onShowModalTipos} icon={<IconFilter size={18} />}>
        Tipos de clientes
      </PageHeaderButton>
      <PageHeaderButton onClick={onShowModal} icon={<IconPlus size={18} />}>
        Añadir Cliente
      </PageHeaderButton>
    </div>
  )
}
export default ClientesActionsBar
