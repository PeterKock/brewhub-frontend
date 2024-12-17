import { useNavigate } from 'react-router-dom';
import { FeatureCard, RecipeCard, CardGrid } from '/src/components/cards';

const HomePage = () => {
    const navigate = useNavigate();

    const features = [
        {
            title: 'Recipes',
            description: 'Explore our collection of craft beer recipes from beginners to advanced brewers',
            buttonText: 'View Recipes',
            onClick: () => navigate('/recipes')
        },
        {
            title: 'Guides',
            description: 'Step-by-step instructions and tips for perfecting your brewing process',
            buttonText: 'View Guides',
            onClick: () => navigate('/guides')
        },
        {
            title: 'Community',
            description: 'Connect with fellow brewers, share experiences, and get advice',
            buttonText: 'Join Now',
            onClick: () => navigate('/community')
        }
    ];

    const recipes = [
        {
            title: 'IPA Classic',
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
        }
    ];

    return (
        <main className="main-content">
            <section className="features">
                <h2 className="section-title">Start Brewing</h2>
                <CardGrid>
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            {...feature}
                        />
                    ))}
                </CardGrid>
            </section>

            <section className="latest-recipes">
                <h2 className="section-title">Latest Recipes</h2>
                <CardGrid>
                    {recipes.map((recipe, index) => (
                        <RecipeCard
                            key={index}
                            {...recipe}
                        />
                    ))}
                </CardGrid>
            </section>
        </main>
    );
};

export default HomePage;