import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import RecipeList from '../../components/recipes/RecipeList';
import { RecipeDetailCard } from '../../components/recipes';
import { recipeService } from '../../services/recipeService';
import './styles/recipes.css';

const UserRecipes = () => {
    const location = useLocation();
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        difficulty: 'all',
        type: 'all'
    });
    const recipeDetailRef = useRef(null);

    const loadRecipes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await recipeService.getAllRecipes();
            setRecipes(data);
            // Check for selected recipe from homepage
            if (location.state?.selectedRecipeId) {
                const recipe = recipes.find(r => r.id === location.state.selectedRecipeId);
                if (recipe) {
                    setSelectedRecipe(recipe);
                }
            }
        } catch (err) {
            console.error('Error loading recipes:', err);
            setError('Failed to load recipes. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [location.state.selectedRecipeId, recipes]);

    useEffect(() => {
        void loadRecipes();
    }, [loadRecipes]);

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

    const handleSearch = async (value) => {
        setSearchTerm(value);
        try {
            setLoading(true);
            setError(null);
            let data;
            if (value.trim()) {
                data = await recipeService.searchRecipes(value);
            } else {
                data = await recipeService.getAllRecipes();
            }
            setRecipes(data);
        } catch (err) {
            console.error('Error searching recipes:', err);
            setError('Failed to search recipes. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = async (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));

        try {
            setLoading(true);
            setError(null);
            let data;

            if (value === 'all') {
                data = await recipeService.getAllRecipes();
            } else if (filterType === 'difficulty') {
                data = await recipeService.getRecipesByDifficulty(value);
            } else if (filterType === 'type') {
                data = await recipeService.getRecipesByType(value);
            }

            setRecipes(data);
        } catch (err) {
            console.error('Error filtering recipes:', err);
            setError('Failed to filter recipes. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectRecipe = async (recipe) => {
        try {
            setLoading(true);
            const fetchedRecipe = await recipeService.getRecipeById(recipe.id);
            setSelectedRecipe(fetchedRecipe);
        } catch (err) {
            setError('Failed to load recipe details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={() => void loadRecipes()} className="retry-button">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <main className="main-content">
            <h2 className="section-title">Brewing Recipes</h2>

            {selectedRecipe ? (
                <div className="selected-recipe-container" ref={recipeDetailRef}>
                    <RecipeDetailCard
                        recipe={selectedRecipe}
                        onClose={() => setSelectedRecipe(null)}
                    />
                </div>
            ) : (
                <RecipeList
                    recipes={recipes}
                    onSearch={handleSearch}
                    onFilter={handleFilter}
                    onSelectRecipe={handleSelectRecipe}
                    loading={loading}
                    searchTerm={searchTerm}
                    selectedFilters={filters}
                />
            )}
        </main>
    );
};

export default UserRecipes;