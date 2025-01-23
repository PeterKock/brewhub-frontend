import PropTypes from 'prop-types';
import './styles/DetailHeader.css'

export const DetailHeader = ({ title, description, stats, onClose }) => (
    <div className="detail-header">
        <button onClick={onClose} className="close-button">
            Close
        </button>
        <div className="title-container">
            <h3>{title}</h3>
            <p className="content-description">{description}</p>
            {stats && <div>{stats}</div>}
        </div>
    </div>
);

DetailHeader.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    stats: PropTypes.node,
    onClose: PropTypes.func.isRequired
};