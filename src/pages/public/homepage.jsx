import { FeatureCard, RecipeCard, CardGrid } from '../../components/cards';

const HomePage = () => {
    const features = [
        {
            title: 'Recipes',
            description: 'Explore our collection of craft beer recipes from beginners to advanced brewers',
            buttonText: 'View Recipes',
            to: '/user/recipes'
        },
        {
            title: 'Guides',
            description: 'Step-by-step instructions and tips for perfecting your brewing process',
            buttonText: 'View Guides',
            to: '/user/guides'
        },
        {
            title: 'Community',
            description: 'Connect with fellow brewers, share experiences, and get advice',
            buttonText: 'Join Now',
            to: '/user/community'
        }
    ];

    const recipes = [
        {
            title: 'Bock',
            description: 'A strong, dark German beer',
            difficulty: 'Intermediate'
        },
        {
            title: 'Traditional Pilsener',
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
                <h2 className="section-title">Popular Recipes </h2>
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