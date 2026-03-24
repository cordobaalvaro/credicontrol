import { Button, Spinner } from "react-bootstrap"
import "./LoadingButton.css"
const LoadingButton = ({
  loading,
  disabled,
  children,
  spinnerPosition = "start",
  spinnerSize = "sm",
  spinnerClassName = "",
  variant = "success",
  ...props
}) => {
  const isDisabled = disabled || loading
  const spinner = (
    <Spinner
      as="span"
      animation="border"
      size={spinnerSize}
      role="status"
      aria-hidden="true"
      className={spinnerClassName}
    />
  )
  return (
    <Button
      disabled={isDisabled}
      variant={variant}
      className={`loading-button-custom ${props.className || ""}`}
      {...props}
    >
      {spinnerPosition === "start" && loading && (
        <>
          {spinner}
          <span className="ms-2" />
        </>
      )}
      {children}
      {spinnerPosition === "end" && loading && (
        <>
          <span className="me-2" />
          {spinner}
        </>
      )}
    </Button>
  )
}
export default LoadingButton
