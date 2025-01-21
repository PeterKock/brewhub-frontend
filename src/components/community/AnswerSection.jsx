import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { communityService } from '../../services/communityService';
import AnswerCard from './AnswerCard';
import CreateAnswerForm from './CreateAnswerForm';

const AnswerSection = ({ questionId }) => {
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadAnswers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await communityService.getAnswers(questionId);
            setAnswers(data);
        } catch (err) {
            setError('Failed to load answers');
            console.error('Error loading answers:', err);
        } finally {
            setLoading(false);
        }
    }, [questionId]);

    useEffect(() => {
        void loadAnswers();
    }, [loadAnswers]);

    const handleAnswerCreated = useCallback(() => {
        void loadAnswers();
    }, [loadAnswers]);

    if (loading) {
        return <div className="loading">Loading answers...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="answer-section">
            <h3 className="answers-title">
                {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
            </h3>

            <div className="answers-list">
                {answers.map(answer => (
                    <AnswerCard
                        key={answer.id}
                        answer={answer}
                        onUpdate={() => void loadAnswers()}
                    />
                ))}
            </div>

            <CreateAnswerForm
                questionId={questionId}
                onAnswerCreated={handleAnswerCreated}
            />
        </div>
    );
};

AnswerSection.propTypes = {
    questionId: PropTypes.number.isRequired
};

export default AnswerSection;