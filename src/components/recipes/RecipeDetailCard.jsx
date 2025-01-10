import PropTypes from 'prop-types';
import { DetailHeader } from '../shared/DetailHeader';

export const RecipeDetailCard = ({ recipe, onClose }) => {
    const stats = (
        <div className="recipe-stats">
            <span className="recipe-stat">
                Time: {recipe.timeInWeeks} weeks
            </span>
            <span className="recipe-stat">
                ABV: {recipe.abv}
            </span>
            <span className="recipe-stat">
                IBU: {recipe.ibu}
            </span>
            <span className="recipe-stat">
                Type: {recipe.type}
            </span>
        </div>
    );

    return (
        <div className="base-card" onClick={(e) => e.stopPropagation()}>
            <DetailHeader
                title={recipe.title}
                description={recipe.description}
                stats={stats}
                onClose={onClose}
            />

            <div className="recipe-content">
                {/* Left Column: Ingredients */}
                <div className="recipe-section">
                    <h4>Ingredients</h4>
                    <div className="recipe-subsection">
                        <ul className="recipe-list">
                            {recipe.ingredients.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Column: Instructions */}
                <div className="recipe-section">
                    <h4>Instructions</h4>
                    <div className="recipe-subsection">
                        <ol className="recipe-list">
                            {recipe.instructions.map((step, index) => (
                                <li key={index}>{step}</li>
                            ))}
                        </ol>
                    </div>
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