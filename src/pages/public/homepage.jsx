import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Separate Layout component
const Layout = ({ children }) => (
    <main className="main-content">
        {children}
    </main>
);

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <Layout>
            <section className="features">
                <h2 className="section-title">Start Brewing</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <h3>Brewing Guide</h3>
                        <p>Explore our collection of craft beer recipes from beginners to advanced brewers</p>
                        <button className="feature-button" onClick={() => navigate('/recipes')}>
                            View Recipes
                        </button>
                    </div>

                    <div className="feature-card">
                        <h3>Brewing Recipes</h3>
                        <p>Step-by-step instructions and tips for perfecting your brewing process</p>
                        <button className="feature-button" onClick={() => navigate('/guide')}>
                            Learn More
                        </button>
                    </div>

                    <div className="feature-card">
                        <h3>Community</h3>
                        <p>Connect with fellow brewers, share experiences, and get advice</p>
                        <button className="feature-button" onClick={() => navigate('/community')}>
                            Join Now
                        </button>
                    </div>
                </div>
            </section>

            <section className="latest-recipes">
                <h2 className="section-title">Latest Recipes</h2>
                <div className="recipe-grid">
                    <div className="recipe-card">
                        <h3>IPA Classic</h3>
                        <p>A perfectly balanced India Pale Ale with citrus notes</p>
                        <span className="difficulty difficulty-intermediate">Intermediate</span>
                    </div>

                    <div className="recipe-card">
                        <h3>Summer Wheat</h3>
                        <p>Light and refreshing wheat beer perfect for warm days</p>
                        <span className="difficulty difficulty-beginner">Beginner</span>
                    </div>

                    <div className="recipe-card">
                        <h3>Dark Stout</h3>
                        <p>Rich and creamy with coffee and chocolate notes</p>
                        <span className="difficulty difficulty-advanced">Advanced</span>
                    </div>
                </div>
            </section>
        </Layout>
    );
}