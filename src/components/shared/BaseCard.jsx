import PropTypes from 'prop-types';

export const BaseCard = ({ title, description, footer, onClick }) => (
    <div className="base-card" onClick={onClick}>
        <h3>{title}</h3>
        <p>{description}</p>
        {footer && <div className="card-footer">{footer}</div>}
    </div>
);

BaseCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    footer: PropTypes.node,
    onClick: PropTypes.func
};