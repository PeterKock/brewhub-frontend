import PropTypes from 'prop-types';
import { SearchBar } from '../shared/SearchBar';
import { RecipeFilterBar } from './RecipeFilterBar.jsx';
import { RecipeCard } from './RecipeCard';
import './styles/RecipeList.css'

const RecipeList = ({ recipes, onSearch, onFilter, onSelectRecipe }) => {
    const filterConfig = [
        {
            type: 'difficulty',
            options: {
                label: 'Difficulties',
                values: ['Beginner', 'Intermediate', 'Advanced']
            }
        },
        {
            type: 'type',
            options: {
                label: 'Types',
                values: ['Lager', 'Ale', 'Stout']
            }
        }
    ];

    return (
        <div className="recipes-container">
            <SearchBar
                searchTerm=""
                onSearchChange={onSearch}
                placeholder="Search recipes..."
            />

            <RecipeFilterBar
                filters={filterConfig}
                onFilterChange={onFilter}
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
    onSelectRecipe: PropTypes.func.isRequired
};

export default RecipeList;