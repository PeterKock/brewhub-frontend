import { useState, useEffect, useCallback } from 'react';
import { communityService } from '../../services/communityService';
import QuestionCard from '../../components/community/QuestionCard';
import CreateQuestionModal from '../../components/community/CreateQuestionModal';
import AnswerSection from '../../components/community/AnswerSection';
import { SearchBar } from '../../components/shared/SearchBar';

const initialState = {
    pinnedQuestions: [],
    recentQuestions: [],
    popularQuestions: [],
    totalQuestions: 0,
    totalAnswers: 0
};

const Community = () => {
    const [communityData, setCommunityData] = useState(initialState);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const loadCommunityData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await communityService.getCommunityData();
            setCommunityData(data);
        } catch (err) {
            console.error('Error loading community data:', err);
            setError('Failed to load community data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        const initializeData = async () => {
            if (!isMounted) return;
            await loadCommunityData();
        };

        void initializeData();

        return () => {
            isMounted = false;
        };
    }, [loadCommunityData]);

    useEffect(() => {
        const searchQuestions = async () => {
            if (searchTerm.trim()) {
                try {
                    setLoading(true);
                    const results = await communityService.searchQuestions(searchTerm);
                    setCommunityData({
                        ...initialState,
                        recentQuestions: results || [],
                        totalQuestions: results?.length || 0
                    });
                } catch (err) {
                    console.error('Search failed:', err);
                    setError('Failed to search questions');
                } finally {
                    setLoading(false);
                }
            } else {
                await loadCommunityData();
            }
        };

        const debounceTimeout = setTimeout(searchQuestions, 300);
        return () => clearTimeout(debounceTimeout);
    }, [searchTerm, loadCommunityData]);

    const handleCreateQuestion = async () => {
        setShowCreateModal(false);
        await loadCommunityData();
    };

    if (loading && !selectedQuestion) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">
            {error}
            <button onClick={() => setError(null)} className="close-error">×</button>
        </div>;
    }

    if (selectedQuestion) {
        return (
            <div className="community-container">
                <div className="selected-question-view">
                    <button
                        onClick={() => setSelectedQuestion(null)}
                        className="back-button"
                    >
                        Back to Questions
                    </button>
                    <QuestionCard
                        question={selectedQuestion}
                        onUpdate={() => void loadCommunityData()}
                    />
                    <AnswerSection questionId={selectedQuestion.id} />
                </div>
            </div>
        );
    }

    return (
        <div className="community-container">
                <div className="community-actions">
                    <button
                        className="create-question-button"
                        onClick={() => setShowCreateModal(true)}
                    >
                        Ask Question
                    </button>
                    <SearchBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        placeholder="Search questions..."
                    />
                </div>

            {communityData.pinnedQuestions.length > 0 && (
                <section className="pinned-questions-section">
                    <h2>Pinned Questions</h2>
                    <div className="questions-grid">
                        {communityData.pinnedQuestions.map(question => (
                            <QuestionCard
                                key={question.id}
                                question={question}
                                onUpdate={() => void loadCommunityData()}
                                onClick={() => setSelectedQuestion(question)}
                            />
                        ))}
                    </div>
                </section>
            )}

            <section className="recent-questions-section">
                <h2>Recent Questions</h2>
                <div className="questions-grid">
                    {communityData.recentQuestions.map(question => (
                        <QuestionCard
                            key={question.id}
                            question={question}
                            onUpdate={() => void loadCommunityData()}
                            onClick={() => setSelectedQuestion(question)}
                        />
                    ))}
                </div>
            </section>

            <section className="popular-questions-section">
                <h2>Popular Questions</h2>
                <div className="questions-grid">
                    {communityData.popularQuestions.map(question => (
                        <QuestionCard
                            key={question.id}
                            question={question}
                            onUpdate={() => void loadCommunityData()}
                            onClick={() => setSelectedQuestion(question)}
                        />
                    ))}
                </div>
            </section>

            {showCreateModal && (
                <CreateQuestionModal
                    onClose={() => setShowCreateModal(false)}
                    onQuestionCreated={() => void handleCreateQuestion()}
                />
            )}
        </div>
    );
};

export default Community;