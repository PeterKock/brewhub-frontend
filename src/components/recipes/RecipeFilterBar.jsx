import PropTypes from 'prop-types';
import './styles/RecipeFilterBar.css'

export const RecipeFilterBar = ({ onFilterChange }) => {
    return (
        <div className="filter-bar">
            <select
                id="recipe-difficulty-filter"
                onChange={(e) => onFilterChange('difficulty', e.target.value)}
                className="filter-select"
            >
                <option value="all">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
            </select>

            <select
                id="recipe-type-filter"
                onChange={(e) => onFilterChange('type', e.target.value)}
                className="filter-select"
            >
                <option value="all">All Types</option>
                <option value="Lager">Lager</option>
                <option value="Ale">Ale</option>
                <option value="Stout">Stout</option>
            </select>
        </div>
    );
};

RecipeFilterBar.propTypes = {
    onFilterChange: PropTypes.func.isRequired
};