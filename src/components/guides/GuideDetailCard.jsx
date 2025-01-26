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
                    {guide.sections && guide.sections.length > 0 ? (
                        guide.sections.map((section, index) => (
                            <div key={index} className="guide-subsection">
                                <h5>{section.title}</h5>
                                <p>{section.content}</p>
                            </div>
                        ))
                    ) : (
                        <p>No sections available</p>
                    )}
                </div>

                {/* Right Column: Tips & Recommendations */}
                <div className="guide-section">
                    <h4>Tips & Recommendations</h4>
                    {guide.tips && guide.tips.length > 0 ? (
                        <ul className="guide-list">
                            {guide.tips.map((tip, index) => (
                                <li key={index}>{tip}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No tips available</p>
                    )}
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
        sections: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string.isRequired,
            content: PropTypes.string.isRequired
        })),
        tips: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    onClose: PropTypes.func.isRequired
};