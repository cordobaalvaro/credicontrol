import { Row, Col } from "react-bootstrap"
import StatCard from "./StatCard"
const StatsRow = ({ items, className = "stats-row mb-4 " }) => {
  if (!Array.isArray(items) || items.length === 0) return null
  const colSize = Math.floor(12 / items.length)
  return (
    <Row className={className}>
      {items.map((item, index) => {
        const isOddCount = items.length % 2 === 1
        const isLast = index === items.length - 1
        const xsProps = isOddCount && isLast ? { span: 6, offset: 3 } : 6
        const mdProps = { span: colSize, offset: 0 }
        return (
          <Col key={index} xs={xsProps} md={mdProps} className="my-2 my-md-0">
            <StatCard
              icon={item.icon}
              iconClass={item.iconClass}
              iconColor={item.iconColor}
              value={item.value}
              label={item.label}
              containerClassName={item.containerClassName}
              numberClassName={item.numberClassName}
              labelClassName={item.labelClassName}
              onClick={item.onClick}
              isActive={item.isActive}
            />
          </Col>
        )
      })}
    </Row>
  )
}
export default StatsRow
