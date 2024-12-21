import PropTypes from 'prop-types';

export const RecipeFilterBar = ({ onFilterChange }) => {
    return (
        <div className="recipe-filters">
            <select
                onChange={(e) => onFilterChange('difficulty', e.target.value)}
                className="filter-select"
            >
                <option value="all">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
            </select>

            <select
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