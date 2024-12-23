import PropTypes from 'prop-types';
import { BaseCard } from '../shared/BaseCard';

export const RecipeCard = ({ title, description, difficulty, onClick }) => {
    const getDifficultyClass = (level) => {
        const classes = {
            beginner: 'difficulty-beginner',
            intermediate: 'difficulty-intermediate',
            advanced: 'difficulty-advanced'
        };
        return `difficulty ${classes[level.toLowerCase()]}`;
    };

    const footer = (
        <span className={getDifficultyClass(difficulty)}>
            {difficulty}
        </span>
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

RecipeCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    difficulty: PropTypes.oneOf(['Beginner', 'Intermediate', 'Advanced']).isRequired,
    onClick: PropTypes.func
};