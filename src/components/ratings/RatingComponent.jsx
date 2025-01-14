import { useState } from 'react';
import PropTypes from 'prop-types';
import { Star } from 'lucide-react';
import { ratingService } from '../../services/ratingService';

const RatingComponent = ({ retailerId, onRatingSubmit, initialRating, readOnly }) => {
    const [rating, setRating] = useState(initialRating || 0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                comment: comment.trim()
            });

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

    const renderStar = (index) => {
        const filled = (hover || rating) >= index;

        return (
            <Star
                key={index}
                size={24}
                className={`cursor-pointer transition-colors ${
                    filled ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
                onMouseEnter={() => !readOnly && setHover(index)}
                onMouseLeave={() => !readOnly && setHover(0)}
                onClick={() => !readOnly && setRating(index)}
            />
        );
    };

    if (readOnly) {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(index => renderStar(index))}
                <span className="text-primary-text-color ml-2">
                    {rating.toFixed(1)}
                </span>
            </div>
        );
    }

    return (
        <div className="rating-container">
            {error && <div className="error-message">{error}</div>}

            <div className="stars-container flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map(index => renderStar(index))}
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
    onRatingSubmit: PropTypes.func,
    initialRating: PropTypes.number,
    readOnly: PropTypes.bool
};

RatingComponent.defaultProps = {
    readOnly: false,
    initialRating: 0
};

export default RatingComponent;