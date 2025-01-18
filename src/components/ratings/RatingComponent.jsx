import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Star } from 'lucide-react';
import { ratingService } from '../../services/ratingService';

const RatingComponent = ({ retailerId, orderId, onRatingSubmit, initialRating, readOnly }) => {
    const [rating, setRating] = useState(initialRating || 0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        setRating(initialRating || 0);
    }, [initialRating]);

    const handleRatingSubmit = async () => {
        if (!rating) {
            setError('Please select a rating');
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');

            await ratingService.createRating(retailerId, {
                score: rating,
                comment: comment.trim(),
                orderId: orderId
            });

            setSubmitted(true);
            if (onRatingSubmit) {
                onRatingSubmit(rating);
            }

            setComment('');
        } catch (err) {
            setError(err.message || 'Failed to submit rating');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="rating-success">
                <p>Thank you for your rating!</p>
                <div className="stars-container">
                    {[1, 2, 3, 4, 5].map((index) => (
                        <Star
                            key={index}
                            size={24}
                            style={{
                                color: index <= rating ? '#FFD700' : '#7f8c8d',
                                fill: index <= rating ? '#FFD700' : 'none'
                            }}
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (readOnly) {
        return (
            <div className="rating-display">
                {[1, 2, 3, 4, 5].map(index => (
                    <Star
                        key={index}
                        size={20}
                        style={{
                            color: index <= rating ? '#FFD700' : '#7f8c8d',
                            fill: index <= rating ? '#FFD700' : 'none'
                        }}
                    />
                ))}
                <span className="rating-value">
                    {rating.toFixed(1)}
                </span>
            </div>
        );
    }

    return (
        <div className="rating-container">
            {error && <div className="error-message">{error}</div>}

            <div className="stars-container">
                {[1, 2, 3, 4, 5].map(index => (
                    <Star
                        key={index}
                        size={24}
                        style={{
                            cursor: 'pointer',
                            color: (hover || rating) >= index ? '#FFD700' : '#7f8c8d',
                            fill: (hover || rating) >= index ? '#FFD700' : 'none',
                            transition: 'all var(--transition-default-value)'
                        }}
                        onMouseEnter={() => !readOnly && setHover(index)}
                        onMouseLeave={() => !readOnly && setHover(0)}
                        onClick={() => !readOnly && setRating(index)}
                    />
                ))}
            </div>

            <div className="form-group">
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment (optional)"
                    rows={3}
                />
            </div>

            <button
                onClick={handleRatingSubmit}
                disabled={isSubmitting}
                className="modal-submit-button"
            >
                {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </button>
        </div>
    );
};

RatingComponent.propTypes = {
    retailerId: PropTypes.number.isRequired,
    orderId: PropTypes.number,
    onRatingSubmit: PropTypes.func,
    initialRating: PropTypes.number,
    readOnly: PropTypes.bool
};

RatingComponent.defaultProps = {
    readOnly: false,
    initialRating: 0
};

export default RatingComponent;