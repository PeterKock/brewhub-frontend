import PropTypes from 'prop-types';

// Feature Card Component
export const FeatureCard = ({ title, description, buttonText, to }) => {
    return (
        <div className="base-card">
            <h3>{title}</h3>
            <p>{description}</p>
            <a href={to} className="feature-button">
                {buttonText}
            </a>
        </div>
    );
};

FeatureCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    buttonText: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired
};

// Recipe Card Component
export const RecipeCard = ({ title, description, difficulty }) => {
    const getDifficultyClass = (level) => {
        const classes = {
            beginner: 'difficulty-beginner',
            intermediate: 'difficulty-intermediate',
            advanced: 'difficulty-advanced'
        };
        return `difficulty ${classes[level.toLowerCase()]}`;
    };

    return (
        <div className="base-card">
            <h3>{title}</h3>
            <p>{description}</p>
            <span className={getDifficultyClass(difficulty)}>
        {difficulty}
      </span>
        </div>
    );
};

RecipeCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    difficulty: PropTypes.oneOf(['Beginner', 'Intermediate', 'Advanced']).isRequired
};

// Grid Container Component
export const CardGrid = ({ children }) => {
    return (
        <div className="card-grid">
            {children}
        </div>
    );
};

CardGrid.propTypes = {
    children: PropTypes.node.isRequired
};