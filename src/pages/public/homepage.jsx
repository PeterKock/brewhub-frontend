import { useState, useEffect } from 'react';
import { RecipeCard } from '../../components/shared/cards.jsx';
import { Link } from 'react-router-dom';
import { Coffee, Book, Users, ChevronRight } from 'lucide-react';
import { recipeService } from '../../services/recipeService';
import './styles/homepage.css';

const HomePage = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        void loadRecipes();
    }, []);

    const loadRecipes = async () => {
        try {
            setLoading(true);
            const data = await recipeService.getAllRecipes();
            setRecipes(data);
        } catch (err) {
            console.error('Error loading recipes:', err);
            setError('Failed to load recipes');
        } finally {
            setLoading(false);
        }
    };

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
                <h2 className="section-title">Popular Recipes</h2>
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading recipes...</p>
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <p className="error-message">{error}</p>
                        <button onClick={loadRecipes} className="retry-button">
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="recipes-grid">
                        {recipes.map((recipe) => (
                            <Link
                                key={recipe.id}
                                to="/recipes"
                                className="recipe-card-wrapper"
                                state={{selectedRecipeId: recipe.id}}
                                aria-label={`View recipe for ${recipe.title}`}
                            >
                                <RecipeCard
                                    title={recipe.title}
                                    description={recipe.description}
                                    difficulty={recipe.difficulty}
                                />
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};

export default HomePage;