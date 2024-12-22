import { useState } from 'react';
import PropTypes from 'prop-types';

const GuideFilterBar = ({ onFilterChange }) => (
    <div className="recipe-filters">
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

GuideFilterBar.propTypes = {
    onFilterChange: PropTypes.func.isRequired
};

const GuideCard = ({ title, description, timeToRead, category, onClick }) => {
    const getDifficultyClass = (category) => {
        const classes = {
            "getting-started": "difficulty-getting-started",
            equipment: "difficulty-equipment",
            ingredients: "difficulty-ingredients",
            techniques: "difficulty-techniques",
            troubleshooting: "difficulty-troubleshooting"
        };
        return `difficulty ${classes[category]}`;
    };

    return (
        <div className="base-card" onClick={onClick}>
            <h3>{title}</h3>
            <p>{description}</p>
            <div className="card-footer">
                <span className={getDifficultyClass(category)}>
                    {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
                <span className="time-to-read">{timeToRead} min read</span>
            </div>
        </div>
    );
};

GuideCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    timeToRead: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};

const UserGuides = () => {
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [filters, setFilters] = useState({ category: 'all', searchTerm: '' });

    const guides = [
        {
            title: 'Getting Started with Home Brewing',
            description: 'Everything you need to know to start your brewing journey.',
            category: 'getting-started',
            timeToRead: 15
        },
        {
            title: 'Essential Brewing Equipment Guide',
            description: 'A comprehensive guide to all the equipment you will need.',
            category: 'equipment',
            timeToRead: 10
        },
        {
            title: 'Understanding Malt Types',
            description: 'Deep dive into different malt varieties, their characteristics, and how they affect your beer flavor and color.',
            category: 'ingredients',
            timeToRead: 12
        },
        {
            title: 'Hop Varieties and Usage',
            description: 'Learn about different hop varieties, alpha acids, and how to use hops for flavoring, flavor, and aroma.',
            category: 'ingredients',
            timeToRead: 20
        },
        {
            title: 'Mastering Mash Techniques',
            description: 'Advanced guide to different mashing techniques and how they affect your beer characteristics.',
            category: 'techniques',
            timeToRead: 25
        },
        {
            title: 'Fermentation Temperature Control',
            description: 'Learn how to manage fermentation temperatures for clean, consistent beer production.',
            category: 'techniques',
            timeToRead: 15
        },
        {
            title: 'Common Brewing Problems',
            description: 'Troubleshooting guide for common brewing issues, from stuck fermentation to off-flavors.',
            category: 'troubleshooting',
            timeToRead: 18
        },
        {
            title: 'Water Chemistry Basics',
            description: 'Understanding water profiles and how to adjust your water for different beer styles.',
            category: 'techniques',
            timeToRead: 30
        },
        {
            title: 'Cleaning and Sanitization',
            description: 'Essential guide to keeping your equipment clean and your beer contamination-free.',
            category: 'getting-started',
            timeToRead: 10
        }
    ];

    const filteredGuides = guides.filter((guide) => {
        const categoryMatch = filters.category === 'all' || guide.category === filters.category;
        const searchMatch =
            guide.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            guide.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
        return categoryMatch && searchMatch;
    });

    const handleFilterChange = (filterType, value) => {
        setFilters((prev) => ({ ...prev, [filterType]: value }));
    };

    return (
        <main className="main-content">
            <h2 className="section-title"></h2>

            {selectedGuide ? (
                <div className="selected-guide-container">
                    <div className="guide-header">
                        <button onClick={() => setSelectedGuide(null)} className="recipe-close-button">
                            Close
                        </button>
                        <div className="guide-title-container">
                            <h3>{selectedGuide.title}</h3>
                            <p className="recipe-description">{selectedGuide.description}</p>
                            <div className="guide-stats">
                                <span className="time-to-read">{selectedGuide.timeToRead} min read</span>
                                <span className={`difficulty ${selectedGuide.category}`}>
                                    {selectedGuide.category
                                        .split('-')
                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(' ')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search guides..."
                            value={filters.searchTerm}
                            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                            className="filter-select"
                        />
                    </div>
                    <GuideFilterBar onFilterChange={handleFilterChange} />
                    <div className="recipe-grid">
                        {filteredGuides.map((guide, index) => (
                            <GuideCard
                                key={index}
                                title={guide.title}
                                description={guide.description}
                                timeToRead={guide.timeToRead}
                                category={guide.category}
                                onClick={() => setSelectedGuide(guide)}
                            />
                        ))}
                    </div>
                </>
            )}
        </main>
    );
};

export default UserGuides;
