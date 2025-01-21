import { useState } from 'react';
import PropTypes from 'prop-types';
import { communityService } from '../../services/communityService';

const CreateQuestionModal = ({ onClose, onQuestionCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length < 10) {
            newErrors.title = 'Title must be at least 10 characters long';
        } else if (formData.title.length > 150) {
            newErrors.title = 'Title cannot exceed 150 characters';
        }

        if (!formData.content.trim()) {
            newErrors.content = 'Content is required';
        } else if (formData.content.length < 20) {
            newErrors.content = 'Content must be at least 20 characters long';
        } else if (formData.content.length > 2000) {
            newErrors.content = 'Content cannot exceed 2000 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            setIsSubmitting(true);
            await communityService.createQuestion(formData);
            if (onQuestionCreated) {
                onQuestionCreated();
            }
        } catch (error) {
            setErrors({
                submit: 'Failed to create question. Please try again.'
            });
            console.error('Error creating question:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Ask a Question</h3>
                    <button
                        className="modal-close-button"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="What's your question?"
                            disabled={isSubmitting}
                        />
                        {errors.title && (
                            <span className="error-message">{errors.title}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Description</label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Provide more details about your question..."
                            rows={5}
                            disabled={isSubmitting}
                        />
                        {errors.content && (
                            <span className="error-message">{errors.content}</span>
                        )}
                    </div>

                    {errors.submit && (
                        <div className="error-message">{errors.submit}</div>
                    )}

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="modal-cancel-button"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="modal-submit-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Posting...' : 'Post Question'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

CreateQuestionModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onQuestionCreated: PropTypes.func
};

export default CreateQuestionModal;