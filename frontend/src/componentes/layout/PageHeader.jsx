import { Container, Row, Col } from "react-bootstrap"
import "./PageHeader.css"
const PageHeader = ({
  iconClass,
  title,
  subtitle,
  rightContent,
  containerClassName = "",
  titleClassName = "",
  subtitleClassName = "",
  showBackButton = false,
  onBackClick,
}) => {
  return (
    <div className={`page-header ${containerClassName}`.trim()}>
      <Container>
        <Row className="align-items-center">
          <Col md={8}>
            <div className="d-flex align-items-center">
              {showBackButton && (
                <button
                  className="page-header-back-btn me-3"
                  onClick={onBackClick}
                  aria-label="Volver"
                >
                  <i className="bi bi-arrow-left"></i>
                </button>
              )}
              <div>
                <h1 className={`page-header-title ${titleClassName}`.trim()}>
                  {iconClass && <i className={`${iconClass} me-3`}></i>}
                  {title}
                </h1>
                {subtitle && (
                  <p className={`page-header-subtitle ${subtitleClassName}`.trim()}>
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </Col>
          <Col md={4} className="text-end mt-3 mt-md-0">
            <div className="page-header-actions">{rightContent}</div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
export default PageHeader
