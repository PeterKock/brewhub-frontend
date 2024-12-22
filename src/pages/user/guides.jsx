import { useState } from 'react';
import PropTypes from 'prop-types';

const GuideCard = ({ title, description, category, timeToRead }) => (
    <div className="base-card">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="card-footer">
            <div className={`difficulty difficulty-${category}`}>
                {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </div>
            <div className="time-to-read">{timeToRead} min read</div>
        </div>
    </div>
);

GuideCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    timeToRead: PropTypes.number.isRequired
};

const UserGuides = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        'all',
        'getting-started',
        'equipment',
        'ingredients',
        'techniques',
        'troubleshooting'
    ];

    const guides = [
        {
            title: 'Getting Started with Home Brewing',
            description: 'Everything you need to know to start your brewing journey. Learn about basic equipment, ingredients, and the brewing process.',
            category: 'getting-started',
            timeToRead: 15
        },
        {
            title: 'Essential Brewing Equipment Guide',
            description: 'A comprehensive guide to all the equipment you will need for brewing, from basic starter kits to advanced setups.',
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

    const filteredGuides = selectedCategory === 'all'
        ? guides
        : guides.filter(guide => guide.category === selectedCategory);

    return (
        <main className="main-content">
            <section className="main-section">
                <h2 className="section-title"></h2>

                <div className="recipes-container">
                    <div className="recipe-filters">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`filter-select ${selectedCategory === category ? 'feature-button' : ''}`}
                            >
                                {category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </button>
                        ))}
                    </div>

                    <div className="base-grid">
                        {filteredGuides.map((guide, index) => (
                            <GuideCard
                                key={index}
                                {...guide}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default UserGuides;