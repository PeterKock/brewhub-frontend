import PropTypes from 'prop-types';

export const GuideFilterBar = ({ onFilterChange }) => {
    return (
        <div className="filter-bar">
            <select
                onChange={(e) => onFilterChange('category', e.target.value)}
                className="filter-select"
            >
                <option value="all">All Categories</option>
                <option value="getting-started">Getting Started</option>
                <option value="equipment">Equipment</option>
                <option value="ingredients">Ingredients</option>
                <option value="techniques">Techniques</option>
                <option value="troubleshooting">Troubleshooting</option>
            </select>
        </div>
    );
};

GuideFilterBar.propTypes = {
    onFilterChange: PropTypes.func.isRequired
};