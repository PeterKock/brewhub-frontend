import { useState } from 'react';
import PropTypes from 'prop-types';
import { communityService } from '../../services/communityService';
import { ArrowUp, ArrowDown, User, Check, Shield, Flag } from 'lucide-react';
import ReportModal from './ReportModal';

const AnswerCard = ({ answer, onUpdate }) => {
    const [isVoting, setIsVoting] = useState(false);
    const userVote = answer.userVote;
    const [showReportModal, setShowReportModal] = useState(false);

    // Rest of the component remains the same
    const handleVote = async (voteType) => {
        if (isVoting) return;

        try {
            setIsVoting(true);
            await communityService.vote({
                answerId: answer.id,
                type: voteType
            });
            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error('Error voting:', error);
        } finally {
            setIsVoting(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className={`answer-card ${answer.isAccepted ? 'accepted' : ''}`}>
            <div className="answer-content">
                <p>{answer.content}</p>
            </div>

            <div className="answer-meta">
                <div className="answer-author">
                    <User size={16} />
                    <span>{answer.authorName}</span>
                    {answer.isRetailerResponse && (
                        <span className="retailer-badge">Retailer</span>
                    )}
                    {answer.isVerified && (
                        <span className="verified-badge">
                            <Shield size={14} />
                            Verified
                        </span>
                    )}
                </div>
                <span className="answer-date">
                    {formatDate(answer.createdAt)}
                </span>
            </div>

            <div className="answer-stats">
                <div className="vote-controls">
                    <button
                        className={`vote-button ${userVote?.type === 'UPVOTE' ? 'voted' : ''}`}
                        onClick={() => handleVote('UPVOTE')}
                        disabled={isVoting}
                    >
                        <ArrowUp size={20} />
                    </button>
                    <span className="vote-count">{answer.voteCount}</span>
                    <button
                        className={`vote-button ${userVote?.type === 'DOWNVOTE' ? 'voted' : ''}`}
                        onClick={() => handleVote('DOWNVOTE')}
                        disabled={isVoting}
                    >
                        <ArrowDown size={20} />
                    </button>
                </div>

                {answer.isAccepted && (
                    <div className="accepted-indicator">
                        <Check size={20} />
                        <span>Accepted Answer</span>
                    </div>
                )}

                <button
                    className="report-button"
                    onClick={() => setShowReportModal(true)}
                    aria-label="Report answer"
                >
                    <Flag size={16} />
                    Report
                </button>
                {showReportModal && (
                    <ReportModal
                        contentId={answer.id}
                        contentType="answer"
                        onClose={(success) => {
                            setShowReportModal(false);
                            if (success) {
                                // Optionally show a success message
                            }
                        }}
                    />
                )}
            </div>
        </div>
    );
};

AnswerCard.propTypes = {
    answer: PropTypes.shape({
        id: PropTypes.number.isRequired,
        content: PropTypes.string.isRequired,
        authorName: PropTypes.string.isRequired,
        isRetailerResponse: PropTypes.bool.isRequired,
        isVerified: PropTypes.bool.isRequired,
        isAccepted: PropTypes.bool.isRequired,
        voteCount: PropTypes.number.isRequired,
        createdAt: PropTypes.string.isRequired,
        userVote: PropTypes.shape({
            type: PropTypes.string
        })
    }).isRequired,
    onUpdate: PropTypes.func
};

export default AnswerCard;