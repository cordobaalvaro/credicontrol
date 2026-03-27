import ViewToggle from "./ViewToggle"
const ListSectionHeader = ({
  total,
  iconClass = "bi bi-people",
  label = "Lista",
  viewMode,
  onViewModeChange,
  showViewToggle = false,
}) => {
  return (
    <div className="section-header">
      <h4 className="section-title">
        <i className={`${iconClass} me-2`}></i>
        {label}
        <span className="section-count">({total})</span>
      </h4>
      {showViewToggle && viewMode && onViewModeChange && (
        <ViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
      )}
      <style>{`
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding: 1.25rem 1.5rem;
          background: white;
          border-radius: 14px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(0, 0, 0, 0.03);
        }
        .section-title {
          color: #1e293b;
          font-weight: 700;
          margin: 0;
          display: flex;
          align-items: center;
          font-size: 1.15rem;
        }
        .section-title i {
          color: #22c55e;
          font-size: 1.2rem;
        }
        .section-count {
          color: #64748b;
          font-weight: 500;
          margin-left: 0.5rem;
        }
      `}</style>
    </div>
  )
}
export default ListSectionHeader
