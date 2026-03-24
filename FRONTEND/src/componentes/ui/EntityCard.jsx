import PropTypes from "prop-types";
const EntityCard = ({
  className,
  header,
  details,
  zone,
  actions,
}) => {
  return (
    <div className={className}>
      {header}
      {details}
      {zone}
      {actions}
    </div>
  );
};
EntityCard.propTypes = {
  className: PropTypes.string.isRequired,
  header: PropTypes.node,
  details: PropTypes.node,
  zone: PropTypes.node,
  actions: PropTypes.node,
};
export default EntityCard;
