import { useState } from 'react';
import PropTypes from 'prop-types';
import { RecipeCard, CardGrid } from '../../components/cards';
import { RecipeDetailCard, RecipeFilterBar, recipeData } from '../../components/recipes';

export default function UserRecipes() {
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [filters, setFilters] = useState({
        difficulty: 'all',
        type: 'all'
    });

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const filteredRecipes = recipeData.filter(recipe => {
        const difficultyMatch = filters.difficulty === 'all' || recipe.difficulty === filters.difficulty;
        const typeMatch = filters.type === 'all' || recipe.type === filters.type;
        return difficultyMatch && typeMatch;
    });

    const EnhancedRecipeCard = ({ recipe }) => (
        <div onClick={() => setSelectedRecipe(recipe)} style={{ cursor: 'pointer' }}>
            <RecipeCard
                title={recipe.title}
                description={recipe.description}
                difficulty={recipe.difficulty}
            />
        </div>
    );

    EnhancedRecipeCard.propTypes = {
        recipe: PropTypes.shape({
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            difficulty: PropTypes.string.isRequired
        }).isRequired
    };

    return (
        <main className="main-content">
            <section className="features">
                <h2 className="section-title"></h2>

                <RecipeFilterBar onFilterChange={handleFilterChange}/>

                {selectedRecipe ? (
                    <RecipeDetailCard
                        recipe={selectedRecipe}
                        onClose={() => setSelectedRecipe(null)}
                    />
                ) : (
                    <CardGrid>
                        {filteredRecipes.map((recipe) => (
                            <EnhancedRecipeCard key={recipe.id} recipe={recipe}/>
                        ))}
                    </CardGrid>
                )}
            </section>
        </main>
);
}