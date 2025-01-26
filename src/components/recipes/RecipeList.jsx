import PropTypes from 'prop-types';
import { SearchBar } from '../shared/SearchBar';
import { RecipeFilterBar } from './RecipeFilterBar';
import { RecipeCard } from './RecipeCard';
import './styles/RecipeList.css';

const RecipeList = ({ recipes, onSearch, onFilter, onSelectRecipe, loading, searchTerm, filters }) => {
    if (loading) {
        return (
            <div className="recipes-container">
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={onSearch}
                    placeholder="Search recipes..."
                    disabled={loading}
                />
                <RecipeFilterBar
                    onFilterChange={onFilter}
                    disabled={loading}
                    selectedFilters={filters}
                />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading recipes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="recipes-container">
            <SearchBar
                searchTerm={searchTerm}
                onSearchChange={onSearch}
                placeholder="Search recipes..."
            />

            <RecipeFilterBar
                onFilterChange={onFilter}
                selectedFilters={filters}
            />

            {recipes.length === 0 ? (
                <div className="no-results">
                    No recipes found matching your criteria
                </div>
            ) : (
                <div className="card-grid">
                    {recipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            title={recipe.title}
                            description={recipe.description}
                            difficulty={recipe.difficulty}
                            onClick={() => onSelectRecipe(recipe)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

RecipeList.propTypes = {
    recipes: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            difficulty: PropTypes.string.isRequired
        })
    ).isRequired,
    onSearch: PropTypes.func.isRequired,
    onFilter: PropTypes.func.isRequired,
    onSelectRecipe: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    searchTerm: PropTypes.string.isRequired,
    filters: PropTypes.shape({
        difficulty: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired
    }).isRequired
};

export default RecipeList;