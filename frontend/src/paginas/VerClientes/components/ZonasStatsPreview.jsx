import { Card } from "react-bootstrap";
import PropTypes from "prop-types";
const ZonasStatsPreview = ({ title, subtitle, icon: Icon, stats, children, className = "" }) => {
  return (
    <Card className={`stats-preview-card border-0 shadow-sm mb-4 ${className}`}>
      <Card.Header className="border-0 bg-transparent py-3">
        <div className="d-flex align-items-center">
          {Icon && (
            <div className="stats-preview-icon-wrapper">
              <Icon size={24} />
            </div>
          )}
          <div className="flex-grow-1">
            <h6 className="stats-preview-title mb-0 fw-bold">
              {title}
            </h6>
            <small className="text-muted">
              {subtitle}
            </small>
          </div>
        </div>
      </Card.Header>
      <Card.Body className="pt-0">
        <div className="stats-preview-grid mb-3">
          <div className="stats-preview-item primary">
            <span className="stats-preview-value">
              ${stats.cantidadACobrar?.toLocaleString() || 0}
            </span>
            <span className="stats-preview-label">A Cobrar</span>
          </div>
          <div className="stats-preview-item danger">
            <span className="stats-preview-value">
              ${stats.totalVencido?.toLocaleString() || 0}
            </span>
            <span className="stats-preview-label">Vencido</span>
          </div>
        </div>
        <div className="stats-preview-grid-mini">
          <div className="stats-preview-item-mini">
            <span className="stats-preview-value-mini">{stats.totalClientes || 0}</span>
            <span className="stats-preview-label-mini">Clientes</span>
          </div>
          <div className="stats-preview-item-mini">
            <span className="stats-preview-value-mini">{stats.totalPrestamos || 0}</span>
            <span className="stats-preview-label-mini">Préstamos</span>
          </div>
        </div>
        {children && <div className="stats-preview-actions mt-3">{children}</div>}
      </Card.Body>
    </Card>
  );
};
ZonasStatsPreview.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.elementType,
  stats: PropTypes.object.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
};
export default ZonasStatsPreview;
