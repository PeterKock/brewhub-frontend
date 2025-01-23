import { useState } from 'react';
import PropTypes from 'prop-types';
import { communityService } from '../../services/communityService';
import './styles/CreateAnswerForm.css'

const CreateAnswerForm = ({ questionId, onAnswerCreated }) => {
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            setError('Answer content is required');
            return;
        }

        if (content.length < 20) {
            setError('Answer must be at least 20 characters long');
            return;
        }

        try {
            setIsSubmitting(true);
            await communityService.createAnswer({
                questionId,
                content: content.trim()
            });
            setContent('');
            setError(null);
            if (onAnswerCreated) {
                onAnswerCreated();
            }
        } catch (err) {
            setError('Failed to post answer. Please try again.');
            console.error('Error creating answer:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-answer-form">
            <h4>Your Answer</h4>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <textarea
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                            setError(null);
                        }}
                        placeholder="Share your knowledge..."
                        disabled={isSubmitting}
                    />
                    {error && (
                        <span className="error-message">{error}</span>
                    )}
                </div>
                <button
                    type="submit"
                    className="submit-answer-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Posting...' : 'Post Answer'}
                </button>
            </form>
        </div>
    );
};

CreateAnswerForm.propTypes = {
    questionId: PropTypes.number.isRequired,
    onAnswerCreated: PropTypes.func
};

export default CreateAnswerForm;