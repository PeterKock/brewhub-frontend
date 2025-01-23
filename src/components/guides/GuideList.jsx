import PropTypes from 'prop-types';
import { SearchBar } from '../shared/SearchBar';
import { GuideFilterBar } from './GuideFilterBar';
import { GuideCard } from './GuideCard';
import './styles/GuideList.css'

const GuideList = ({ guides, onSearch, onFilter, onSelectGuide }) => {
    return (
        <div className="guides-container">
            <SearchBar
                searchTerm=""
                onSearchChange={onSearch}
                placeholder="Search guides..."
            />

            <GuideFilterBar
                onFilterChange={onFilter}
            />

            {guides.length === 0 ? (
                <div className="no-results">
                    No guides found matching your criteria
                </div>
            ) : (
                <div className="card-grid">
                    {guides.map((guide) => (
                        <GuideCard
                            key={guide.id}
                            title={guide.title}
                            description={guide.description}
                            category={guide.category}
                            timeToRead={guide.timeToRead}
                            onClick={() => onSelectGuide(guide)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

GuideList.propTypes = {
    guides: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            category: PropTypes.string.isRequired,
            timeToRead: PropTypes.number.isRequired
        })
    ).isRequired,
    onSearch: PropTypes.func.isRequired,
    onFilter: PropTypes.func.isRequired,
    onSelectGuide: PropTypes.func.isRequired
};

export default GuideList;