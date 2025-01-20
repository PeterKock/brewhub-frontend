import { useState, useEffect } from 'react';
import { MessageCircle, Store } from 'lucide-react';
import { SearchBar } from '../../components/shared/SearchBar';
import RatingComponent from '../../components/ratings/RatingComponent';
import { publicService } from '../../services/publicService';
import { ratingService } from '../../services/ratingService';

const Community = () => {
    const [topRetailers, setTopRetailers] = useState([]);
    const [recentReviews, setRecentReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadCommunityData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch retailers and their ratings
                const retailers = await publicService.getRetailers();
                const retailersWithRatings = await Promise.all(
                    retailers.map(async (retailer) => {
                        try {
                            const avgRating = await ratingService.getRetailerAverageRating(retailer.id);
                            const ratings = await ratingService.getRetailerRatings(retailer.id);
                            return {
                                ...retailer,
                                averageRating: avgRating,
                                ratings: ratings,
                                totalRatings: ratings.length
                            };
                        } catch (err) {
                            console.error('Error fetching ratings:', err);
                            return retailer;
                        }
                    })
                );

                // Sort retailers by rating
                const sortedRetailers = retailersWithRatings
                    .filter(r => r.averageRating)
                    .sort((a, b) => b.averageRating - a.averageRating)
                    .slice(0, 5);

                // Get recent reviews and properly handle dates
                const allReviews = retailersWithRatings.flatMap(retailer =>
                    retailer.ratings?.map(rating => ({
                        ...rating,
                        retailerName: retailer.name,
                        // Ensure we have a valid date object
                        createdAt: rating.createdAt ? new Date(rating.createdAt) : new Date()
                    })) || []
                );

                const sortedReviews = allReviews
                    .sort((a, b) => b.createdAt - a.createdAt)
                    .slice(0, 10);

                setTopRetailers(sortedRetailers);
                setRecentReviews(sortedReviews);
            } catch (err) {
                console.error('Error loading community data:', err);
                setError('Failed to load community data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        // Properly handle the Promise
        loadCommunityData().catch(err => {
            console.error('Failed to load community data:', err);
            setError('Failed to load community data. Please try again later.');
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="loading">Loading community data...</div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <section className="dashboard-section">
                <div className="welcome-header">
                    <h1>Brewing Community</h1>
                    <p className="subtitle">Connect with fellow brewers and discover top retailers</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    placeholder="Search community..."
                />

                <div className="community-stats">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <Store size={24} />
                        </div>
                        <div className="stat-content">
                            <h2>Active Retailers</h2>
                            <p>{topRetailers.length}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">
                            <MessageCircle size={24} />
                        </div>
                        <div className="stat-content">
                            <h2>Recent Reviews</h2>
                            <p>{recentReviews.length}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="dashboard-section">
                <h2 className="section-title">Top Rated Retailers</h2>
                <div className="retailers-list">
                    {topRetailers.map(retailer => (
                        <div key={retailer.id} className="retailer-card">
                            <div className="retailer-info">
                                <h3>{retailer.name}</h3>
                                <RatingComponent
                                    retailerId={retailer.id}
                                    initialRating={retailer.averageRating}
                                    readOnly
                                />
                                <span className="rating-count">
                                    {retailer.totalRatings} reviews
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="dashboard-section">
                <h2 className="section-title">Recent Reviews</h2>
                <div className="reviews-list">
                    {recentReviews.map(review => (
                        <div key={review.id} className="review-card">
                            <div className="review-header">
                                <h4>{review.retailerName}</h4>
                                <RatingComponent
                                    retailerId={review.retailerId}
                                    initialRating={review.score}
                                    readOnly
                                />
                            </div>
                            <p className="review-comment">{review.comment}</p>
                            <div className="review-meta">
                                <span>{review.createdAt.toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Community;