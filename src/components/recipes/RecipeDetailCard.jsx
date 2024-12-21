import PropTypes from 'prop-types';

export const RecipeDetailCard = ({ recipe, onClose }) => {
    return (
        <div className="base-card">
            <div className="recipe-header">
                <h3>{recipe.title}</h3>
                <button onClick={onClose} className="feature-button">
                    Close
                </button>
            </div>

            <div className="recipe-stats">
                <span className="recipe-stat">Time: {recipe.timeInWeeks} weeks</span>
                <span className="recipe-stat">ABV: {recipe.abv}</span>
                <span className="recipe-stat">Type: {recipe.type}</span>
            </div>

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
    );
};

RecipeDetailCard.propTypes = {
    recipe: PropTypes.shape({
        title: PropTypes.string.isRequired,
        timeInWeeks: PropTypes.number.isRequired,
        abv: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
        instructions: PropTypes.arrayOf(PropTypes.string).isRequired
    }).isRequired,
    onClose: PropTypes.func.isRequired
};