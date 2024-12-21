import PropTypes from 'prop-types';

export const RecipeDetailCard = ({ recipe, onClose }) => {
    const getDifficultyClass = (level) => {
        const classes = {
            beginner: 'difficulty-beginner',
            intermediate: 'difficulty-intermediate',
            advanced: 'difficulty-advanced'
        };
        return `difficulty ${classes[level.toLowerCase()]}`;
    };

    const handleCardClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="base-card" onClick={handleCardClick}>
            <div className="recipe-header">
                <button
                    onClick={onClose}
                    className="recipe-close-button"
                >
                    Close
                </button>
                <div className="recipe-title-container">
                    <h3>{recipe.title}</h3>
                    <p className="recipe-description">{recipe.description}</p>
                    <span className={getDifficultyClass(recipe.difficulty)}>
                        {recipe.difficulty}
                    </span>
                </div>
            </div>

            <div className="recipe-stats">
                <span className="recipe-stat">Time: {recipe.timeInWeeks} weeks</span>
                <span className="recipe-stat">ABV: {recipe.abv}</span>
                <span className="recipe-stat">IBU: {recipe.ibu}</span>
                <span className="recipe-stat">Type: {recipe.type}</span>
            </div>

            <div className="recipe-content">
                <div className="recipe-section">
                    <h4>Ingredients</h4>
                    <ul className="recipe-list">
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </div>

                <div className="recipe-section">
                    <h4>Instructions</h4>
                    <ol className="recipe-list">
                        {recipe.instructions.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
};

RecipeDetailCard.propTypes = {
    recipe: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        difficulty: PropTypes.string.isRequired,
        timeInWeeks: PropTypes.number.isRequired,
        abv: PropTypes.string.isRequired,
        ibu: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
        instructions: PropTypes.arrayOf(PropTypes.string).isRequired
    }).isRequired,
    onClose: PropTypes.func.isRequired
};