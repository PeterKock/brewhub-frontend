import PropTypes from 'prop-types';
import './styles/SearchBar.css'

export const SearchBar = ({ searchTerm, onSearchChange, placeholder }) => (
    <div className="search-container">
        <input
            type="text"
            placeholder={placeholder || "Search..."}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
            id="general-search"
        />
    </div>
);

SearchBar.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string
};