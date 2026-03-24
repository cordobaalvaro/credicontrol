import { Button, Spinner } from "react-bootstrap"
import "./PageHeaderButton.css"
const PageHeaderButton = ({ 
  children, 
  onClick, 
  variant = "primary", 
  size = "lg",
  icon,
  loading = false,
  disabled = false,
  className = "",
  ...props 
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled || loading}
      className={`page-header-button ${className}`}
      {...props}
    >
      {loading && <Spinner animation="border" size="sm" className="me-2" />}
      {icon && !loading && <span className="me-2">{icon}</span>}
      {children}
    </Button>
  )
}
export default PageHeaderButton
