import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import RecipeList from '../../components/recipes/RecipeList';
import { RecipeDetailCard } from '../../components/recipes/index.js';
import { recipeData } from '../../components/recipes/index.js';
import './styles/recipes.css'

const UserRecipes = () => {
    const location = useLocation();
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [filters, setFilters] = useState({
        difficulty: 'all',
        type: 'all'
    });
    const [searchTerm, setSearchTerm] = useState('');
    const recipeDetailRef = useRef(null);

    useEffect(() => {
        // Check for selected recipe from homepage
        if (location.state?.selectedRecipeId) {
            const recipe = recipeData.find(r => r.title === location.state.selectedRecipeId);
            if (recipe) {
                setSelectedRecipe(recipe);
            }
        }
    }, [location.state]);

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

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const handleFilter = (filterType, value) => {
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
                    recipes={filteredRecipes}
                    onSearch={handleSearch}
                    onFilter={handleFilter}
                    onSelectRecipe={setSelectedRecipe}
                />
            )}
        </main>
    );
};

export default UserRecipes;