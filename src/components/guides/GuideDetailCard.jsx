import PropTypes from 'prop-types';
import { DetailHeader } from '../shared/DetailHeader';

export const GuideDetailCard = ({ guide, onClose }) => {
    const getDifficultyClass = (category) => {
        const classes = {
            "getting-started": "difficulty-getting-started",
            equipment: "difficulty-equipment",
            ingredients: "difficulty-ingredients",
            techniques: "difficulty-techniques",
            troubleshooting: "difficulty-troubleshooting"
        };
        return `difficulty ${classes[category]}`;
    };

    const stats = (
        <>
            <span className="time-to-read">{guide.timeToRead} min read</span>
            <span className={getDifficultyClass(guide.category)}>
                {guide.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </span>
        </>
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
                <div className="guide-section">
                    <h4>Overview</h4>
                    <p>{guide.content.introduction}</p>
                </div>
                {guide.content.sections.map((section, index) => (
                    <div key={index} className="guide-section">
                        <h4>{section.title}</h4>
                        <p>{section.content}</p>
                    </div>
                ))}
                <div className="guide-section">
                    <h4>Tips</h4>
                    <ul className="recipe-list">
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
            introduction: PropTypes.string.isRequired,
            sections: PropTypes.arrayOf(PropTypes.shape({
                title: PropTypes.string.isRequired,
                content: PropTypes.string.isRequired
            })).isRequired,
            tips: PropTypes.arrayOf(PropTypes.string).isRequired
        }).isRequired
    }).isRequired,
    onClose: PropTypes.func.isRequired
};