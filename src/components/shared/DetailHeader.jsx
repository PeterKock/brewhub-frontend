import PropTypes from 'prop-types';

export const DetailHeader = ({ title, description, stats, onClose }) => (
    <div className="recipe-header">
        <button onClick={onClose} className="close-button">
            Close
        </button>
        <div className="recipe-title-container">
            <h3>{title}</h3>
            <p className="content-description">{description}</p>
            {stats && <div className="recipe-stats">{stats}</div>}
        </div>
    </div>
);

DetailHeader.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    stats: PropTypes.node,
    onClose: PropTypes.func.isRequired
};