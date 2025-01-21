import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { communityService } from '../../services/communityService';

const ReportModal = ({ onClose, contentId, contentType }) => {
    const [formData, setFormData] = useState({
        reason: '',
        description: ''
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const reasonOptions = [
        'Inappropriate content',
        'Spam',
        'Harassment',
        'Incorrect information',
        'Other'
    ];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                onClose(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!formData.reason) {
            setError('Please select a reason for reporting');
            return;
        }

        try {
            setIsSubmitting(true);
            const reportData = {
                reason: formData.reason,
                description: formData.description,
                [contentType === 'question' ? 'questionId' : 'answerId']: contentId
            };

            await communityService.reportContent(reportData);
            onClose(true);
        } catch (err) {
            if (err.message && err.message.includes('already reported')) {
                setError(err.message);
            } else {
                setError('Failed to submit report. Please try again.');
            }
            console.error('Error submitting report:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div
            className="modal-overlay"
            onClick={(e) => e.stopPropagation()}
        >
            <div
                className="modal-content"
                onClick={handleModalClick}
            >
                <div className="modal-header">
                    <h3>Report {contentType}</h3>
                    <button
                        className="modal-close-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose(false);
                        }}
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="reason">Reason for reporting</label>
                        <select
                            id="reason"
                            name="reason"
                            value={formData.reason}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        >
                            <option value="">Select a reason</option>
                            {reasonOptions.map(reason => (
                                <option key={reason} value={reason}>
                                    {reason}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Additional details (optional)</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Please provide any additional context..."
                            rows={4}
                            disabled={isSubmitting}
                        />
                    </div>

                    {error && (
                        <div className="error-message">{error}</div>
                    )}

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="modal-cancel-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose(false);
                            }}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="modal-submit-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Report'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

ReportModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    contentId: PropTypes.number.isRequired,
    contentType: PropTypes.oneOf(['question', 'answer']).isRequired
};

export default ReportModal;