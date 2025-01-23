import PropTypes from 'prop-types';
import { DetailHeader } from '../shared/DetailHeader';
import './styles/GuideDetailCard.css'

export const GuideDetailCard = ({ guide, onClose }) => {

    const stats = (
        <div className="guide-stats">
            <span className="guide-stat">{guide.timeToRead} min read</span>
        </div>
    );

    return (
        <div className="base-card" onClick={(e) => e.stopPropagation()}>
            <DetailHeader
                title={guide.title}
                description={guide.description}
                stats={stats}
                onClose={onClose}
            />
            <div className="guide-content">
                {/* Left Column: Overview */}
                <div className="guide-section">
                    <h4>Overview</h4>
                    {guide.content.sections.map((section, index) => (
                        <div key={index} className="guide-subsection">
                            <h5>{section.title}</h5>
                            <p>{section.content}</p>
                        </div>
                    ))}
                </div>

                {/* Right Column: Tips & Recommendations */}
                <div className="guide-section">
                    <h4>Tips & Recommendations</h4>
                    <ul className="guide-list">
                        {guide.content.tips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

GuideDetailCard.propTypes = {
    guide: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        timeToRead: PropTypes.number.isRequired,
        content: PropTypes.shape({
            sections: PropTypes.arrayOf(PropTypes.shape({
                title: PropTypes.string.isRequired,
                content: PropTypes.string.isRequired
            })).isRequired,
            tips: PropTypes.arrayOf(PropTypes.string).isRequired
        }).isRequired
    }).isRequired,
    onClose: PropTypes.func.isRequired
};