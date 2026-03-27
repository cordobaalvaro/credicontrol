const StatCard = ({
  icon: Icon, 
  iconClass, 
  value,
  label,
  iconColor = "total",
  containerClassName = "stat-card",
  numberClassName = "stat-number",
  labelClassName = "stat-label",
  onClick,
  isActive,
}) => {
  const isClickable = typeof onClick === "function"
  const classes = [
    containerClassName,
    isClickable ? "stat-card-clickable" : "",
    isActive ? "stat-card-active" : "",
  ]
    .filter(Boolean)
    .join(" ")
  return (
    <div
      className={classes}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {(Icon || iconClass) && (
        <div className={`stat-icon-wrapper ${iconColor}`}>
          {Icon ? <Icon size={28} stroke={1.5} /> : <i className={iconClass}></i>}
        </div>
      )}
      <span className={numberClassName}>{value}</span>
      <div className={labelClassName}>{label}</div>
    </div>
  )
}
export default StatCard
