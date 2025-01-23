import PropTypes from 'prop-types';
import { BaseCard } from '../shared/BaseCard';
import './styles/GuideCard.css'

export const GuideCard = ({ title, description, category, timeToRead, onClick }) => {
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

    const footer = (
        <>
            <span className={getDifficultyClass(category)}>
                {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </span>
            <span className="time-to-read">{timeToRead} min read</span>
        </>
    );

    return (
        <BaseCard
            title={title}
            description={description}
            footer={footer}
            onClick={onClick}
        />
    );
};

GuideCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    timeToRead: PropTypes.number.isRequired,
    onClick: PropTypes.func
};