const API_URL = 'http://localhost:8080/api/community';

export const communityService = {
    // Questions
    getAllQuestions: async () => {
        const response = await fetch(`${API_URL}/questions`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch questions');
        }

        return response.json();
    },

    createQuestion: async (questionData) => {
        const response = await fetch(`${API_URL}/questions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(questionData)
        });

        if (!response.ok) {
            throw new Error('Failed to create question');
        }

        return response.json();
    },

    // Answers
    getAnswers: async (questionId) => {
        const response = await fetch(`${API_URL}/answers/question/${questionId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch answers');
        }

        return response.json();
    },

    // Votes
    vote: async (voteData) => {
        const endpoint = voteData.questionId ? 'votes/question' : 'votes/answer';
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(voteData)
        });

        if (!response.ok) {
            throw new Error('Failed to vote');
        }

        return response.json();
    },

    // Reports
    reportContent: async (reportData) => {
        const response = await fetch(`${API_URL}/reports`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(reportData)
        });

        if (!response.ok) {
            throw new Error('Failed to submit report');
        }

        return response.json();
    },

    // Community page data
    getCommunityData: async () => {
        const response = await fetch(`${API_URL}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch community data');
        }

        return response.json();
    }
};