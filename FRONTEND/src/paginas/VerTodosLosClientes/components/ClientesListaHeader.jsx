const ClientesListaHeader = ({ total, iconClass = "bi bi-people", label = "Lista de Clientes" }) => {
  return (
    <div className="section-header">
      <h4 className="section-title">
        <i className={`${iconClass} me-2`}></i>
        {label} ({total})
      </h4>
    </div>
  );
};
export default ClientesListaHeader;
