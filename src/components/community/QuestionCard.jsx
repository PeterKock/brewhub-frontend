import { useState } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { communityService } from '../../services/communityService';
import { ArrowUp, ArrowDown, MessageCircle, User, Flag } from 'lucide-react';
import ReportModal from './ReportModal';
import './styles/QuestionCard.css'

const QuestionCard = ({ question, onUpdate, onClick }) => {
    const [isVoting, setIsVoting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showReportModal, setShowReportModal] = useState(false);
    const userVote = question.userVote;

    const handleVote = async (e, voteType) => {
        e.stopPropagation();
        if (isVoting) return;

        try {
            setIsVoting(true);
            await communityService.vote({
                questionId: question.id,
                type: voteType,
                answerId: null
            });
            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error('Error voting:', error);
            setErrorMessage('Failed to register vote. Please try again.');
        } finally {
            setIsVoting(false);
        }
    };

    const handleReportClick = (e) => {
        e.stopPropagation();
        setShowReportModal(true);
    };

    return (
        <>
            <div className="question-card" onClick={onClick}>
                {errorMessage && (
                    <div className="error-message">
                        {errorMessage}
                        <button onClick={(e) => {
                            e.stopPropagation();
                            setErrorMessage('');
                        }}>×</button>
                    </div>
                )}

                {question.isPinned && (
                    <div className="pinned-indicator">
                        Pinned
                    </div>
                )}

                <div className="question-content">
                    <h3>{question.title}</h3>
                    <p>{question.content}</p>
                </div>

                <div className="question-meta">
                    <div className="question-author">
                        <User size={16} />
                        <span>{question.authorName}</span>
                        {question.isRetailerResponse && (
                            <span className="retailer-badge">Retailer</span>
                        )}
                    </div>
                    <span className="question-date">
                        {new Date(question.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </span>
                </div>

                <div className="question-stats">
                    <div className="vote-controls">
                        <button
                            className={`vote-button ${userVote?.type === 'UPVOTE' ? 'voted' : ''}`}
                            onClick={(e) => handleVote(e, 'UPVOTE')}
                            disabled={isVoting}
                        >
                            <ArrowUp size={20} />
                        </button>
                        <span className="vote-count">{question.voteCount}</span>
                        <button
                            className={`vote-button ${userVote?.type === 'DOWNVOTE' ? 'voted' : ''}`}
                            onClick={(e) => handleVote(e, 'DOWNVOTE')}
                            disabled={isVoting}
                        >
                            <ArrowDown size={20} />
                        </button>
                    </div>

                    <div className="answer-count">
                        <MessageCircle size={20} />
                        <span>{question.answerCount} answers</span>
                    </div>

                    <button
                        className="report-button"
                        onClick={handleReportClick}
                        aria-label="Report question"
                    >
                        <Flag size={16} />
                        Report
                    </button>
                </div>
            </div>

            {showReportModal && createPortal(
                <ReportModal
                    contentId={question.id}
                    contentType="question"
                    onClose={(success) => {
                        setShowReportModal(false);
                        if (success) {
                            setErrorMessage('Report submitted successfully');
                            setTimeout(() => setErrorMessage(''), 3000);
                        }
                    }}
                />,
                document.body
            )}
        </>
    );
};

QuestionCard.propTypes = {
    question: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        authorName: PropTypes.string.isRequired,
        isRetailerResponse: PropTypes.bool.isRequired,
        voteCount: PropTypes.number.isRequired,
        answerCount: PropTypes.number.isRequired,
        createdAt: PropTypes.string.isRequired,
        isPinned: PropTypes.bool.isRequired,
        userVote: PropTypes.shape({
            type: PropTypes.string
        })
    }).isRequired,
    onUpdate: PropTypes.func,
    onClick: PropTypes.func
};

export default QuestionCard;