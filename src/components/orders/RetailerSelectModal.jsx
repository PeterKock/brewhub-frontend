import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, MapPin } from 'lucide-react';
import RatingComponent from '../../components/ratings/RatingComponent';
import { ratingService } from '../../services/ratingService';
import { publicService } from '../../services/publicService.js';

const RetailerSelectModal = ({ isOpen, onClose, onSelect }) => {
    const [retailers, setRetailers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        const loadRetailers = async () => {
            if (!isOpen) return;

            try {
                setIsLoading(true);
                setError('');
                const data = await publicService.getRetailers();

                if (isMounted) {
                    // Fetch ratings for each retailer
                    const retailersWithRatings = await Promise.all(
                        data.map(async (retailer) => {
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
                                console.error(`Failed to fetch ratings for retailer ${retailer.id}:`, err);
                                return retailer;
                            }
                        })
                    );
                    setRetailers(retailersWithRatings);
                }
            } catch (err) {
                console.error('Error loading retailers:', err);
                if (isMounted) {
                    setError('Failed to load retailers. Please check your connection and try again.');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadRetailers().catch(err => {
            if (isMounted) {
                console.error('Failed to load retailers:', err);
                setError('Failed to load retailers. Please try again later.');
                setIsLoading(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [isOpen]);

    const filteredRetailers = retailers.filter(retailer =>
        retailer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Select a Retailer</h3>
                    <button
                        className="modal-close-button"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="retailer-search">
                        <input
                            type="text"
                            placeholder="Search retailers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {isLoading ? (
                        <div className="loading">Loading retailers...</div>
                    ) : (
                        <div className="retailers-list">
                            {filteredRetailers.map(retailer => (
                                <div
                                    key={retailer.id}
                                    className="retailer-card"
                                    onClick={() => onSelect(retailer)}
                                >
                                    <div className="retailer-info">
                                        <h4>{retailer.name}</h4>
                                        <div className="retailer-details">
                                            <span className="retailer-location">
                                                <MapPin size={16} />
                                                {retailer.location}
                                            </span>
                                            {retailer.averageRating !== null && (
                                                <div className="retailer-rating">
                                                    <RatingComponent
                                                        retailerId={retailer.id}
                                                        initialRating={retailer.averageRating}
                                                        readOnly
                                                    />
                                                    <span className="rating-count">
                                                        ({retailer.totalRatings} {retailer.totalRatings === 1 ? 'rating' : 'ratings'})
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredRetailers.length === 0 && (
                                <div className="no-results">
                                    No retailers found matching your search
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

RetailerSelectModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired
};

export default RetailerSelectModal;