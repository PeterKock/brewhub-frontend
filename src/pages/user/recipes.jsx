import { useState, useEffect, useRef } from 'react';
import { RecipeCard } from '../../components/cards';
import { RecipeDetailCard, RecipeFilterBar, recipeData } from '../../components/recipes';
import PropTypes from 'prop-types';

const RecipeList = ({ searchTerm, setSearchTerm, onFilterChange, filteredRecipes, onSelectRecipe }) => (
    <div className="recipes-container">
        <div className="search-container">
            <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-select"
            />
        </div>

        <RecipeFilterBar onFilterChange={onFilterChange} />

        {filteredRecipes.length === 0 ? (
            <div className="no-results">
                No recipes found matching your criteria
            </div>
        ) : (
            <div className="recipe-grid">
                {filteredRecipes.map((recipe) => (
                    <div
                        key={recipe.id}
                        onClick={() => onSelectRecipe(recipe)}
                        className="recipe-card-container"
                    >
                        <RecipeCard
                            title={recipe.title}
                            description={recipe.description}
                            difficulty={recipe.difficulty}
                        />
                    </div>
                ))}
            </div>
        )}
    </div>
);

RecipeList.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    setSearchTerm: PropTypes.func.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    filteredRecipes: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            difficulty: PropTypes.string.isRequired
        })
    ).isRequired,
    onSelectRecipe: PropTypes.func.isRequired
};

const UserRecipes = () => {
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [filters, setFilters] = useState({
        difficulty: 'all',
        type: 'all'
    });
    const [searchTerm, setSearchTerm] = useState('');
    const recipeDetailRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (recipeDetailRef.current && !recipeDetailRef.current.contains(event.target)) {
                setSelectedRecipe(null);
            }
        };

        if (selectedRecipe) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedRecipe]);

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const filteredRecipes = recipeData.filter(recipe => {
        const difficultyMatch = filters.difficulty === 'all' || recipe.difficulty === filters.difficulty;
        const typeMatch = filters.type === 'all' || recipe.type === filters.type;
        const searchMatch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
        return difficultyMatch && typeMatch && searchMatch;
    });

    return (
        <main className="main-content">
            <h2 className="section-title"></h2>

            {selectedRecipe ? (
                <div className="selected-recipe-container" ref={recipeDetailRef}>
                    <RecipeDetailCard
                        recipe={selectedRecipe}
                        onClose={() => setSelectedRecipe(null)}
                    />
                </div>
            ) : (
                <RecipeList
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onFilterChange={handleFilterChange}
                    filteredRecipes={filteredRecipes}
                    onSelectRecipe={setSelectedRecipe}
                />
            )}
        </main>
    );
};

export default UserRecipes;