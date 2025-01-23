import { RecipeCard } from '../../components/shared/cards.jsx';
import { Link } from 'react-router-dom';
import { Coffee, Book, Users, ChevronRight } from 'lucide-react';
import './styles/homepage.css'

const HomePage = () => {
    const features = [
        {
            title: 'Recipes',
            description: 'Explore our collection of craft beer recipes from beginners to advanced brewers',
            buttonText: 'View Recipes',
            to: '/recipes',
            icon: <Coffee size={24} />
        },
        {
            title: 'Guides',
            description: 'Step-by-step instructions and tips for perfecting your brewing process',
            buttonText: 'View Guides',
            to: '/guides',
            icon: <Book size={24} />
        },
        {
            title: 'Community',
            description: 'Connect with fellow brewers, share experiences, and get advice',
            buttonText: 'Join Now',
            to: '/community',
            icon: <Users size={24} />
        }
    ];

    const recipes = [
        {
            title: 'Bock',
            description: 'A strong, dark German beer',
            difficulty: 'Intermediate'
        },
        {
            title: 'Pilsener',
            description: 'Fresh malt, fresh hops, correct population of yeast',
            difficulty: 'Beginner'
        },
        {
            title: 'Weizen',
            description: 'A wheat beer of South German or Bavarian origin',
            difficulty: 'Beginner'
        },
        {
            title: 'Triple',
            description: 'A strong malty, hop bitter taste heavy top-fermented beer',
            difficulty: 'Advanced'
        },
        {
            title: 'IPA',
            description: 'A perfectly balanced India Pale Ale with citrus notes',
            difficulty: 'Intermediate'
        },
        {
            title: 'Summer Wheat',
            description: 'Light and refreshing wheat beer perfect for warm days',
            difficulty: 'Beginner'
        },
        {
            title: 'Dark Stout',
            description: 'Rich and creamy with coffee and chocolate notes',
            difficulty: 'Advanced'
        },
    ];

    return (
        <main className="main-content">
            <section className="feature-section">
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card-wrapper">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    {feature.icon}
                                </div>
                                <h2>{feature.title}</h2>
                                <p>{feature.description}</p>
                                <Link to={feature.to} className="feature-link">
                                    <span>{feature.buttonText}</span>
                                    <ChevronRight size={20} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="feature-section">
                {/*<h2 className="section-title">Popular Recipes</h2>*/}
                <div className="recipes-grid">
                    {recipes.map((recipe, index) => (
                        <Link
                            key={index}
                            to={`/recipes`}
                            className="recipe-card-wrapper"
                            state={{selectedRecipeId: recipe.title}}
                            aria-label={`View recipe for ${recipe.title}`}
                        >
                            <RecipeCard {...recipe} />
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default HomePage;