const API_URL = 'http://localhost:8080/api/community';

export const communityService = {
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

    createAnswer: async (answerData) => {
        const response = await fetch(`${API_URL}/answers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(answerData)
        });

        if (!response.ok) {
            throw new Error('Failed to create answer');
        }

        return response.json();
    },

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

    vote: async (voteData) => {
        const endpoint = voteData.questionId ? 'votes/question' : 'votes/answer';
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                type: voteData.type,
                questionId: voteData.questionId,
                answerId: voteData.answerId
            })
        });

        if (!response.ok) {
            throw new Error('Failed to vote');
        }

        return true;
    },

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

    getPendingReports: async () => {
        const response = await fetch(`${API_URL}/reports/pending`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch pending reports');
        }

        const data = await response.json();

        return data.map(report => ({
            id: report.id,
            reason: report.reason,
            description: report.description,
            status: report.status,
            reporterName: report.reporterName,
            createdAt: report.createdAt,
            resolvedAt: report.resolvedAt,
            reporterId: report.reporterId
        }));
    },

    updateReportStatus: async (reportId, status) => {
        const response = await fetch(`${API_URL}/reports/${reportId}/status?status=${status}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to update report status');
        }

        const data = await response.json();

        return {
            id: data.id,
            reason: data.reason,
            description: data.description,
            status: data.status,
            reporterName: data.reporterName,
            createdAt: data.createdAt,
            resolvedAt: data.resolvedAt,
            reporterId: data.reporterId
        };
    },

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
    },

    searchQuestions: async (searchTerm) => {
        const response = await fetch(`${API_URL}/questions/search?query=${encodeURIComponent(searchTerm)}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to search questions');
        }

        return response.json();
    }
};