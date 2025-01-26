const API_URL = 'http://localhost:8080/api';

export const guideService = {
    getAllGuides: async () => {
        const response = await fetch(`${API_URL}/guides`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch guides');
        return response.json();
    },

    getGuideById: async (id) => {
        const response = await fetch(`${API_URL}/guides/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch guide');
        return response.json();
    },

    searchGuides: async (searchTerm) => {
        const response = await fetch(`${API_URL}/guides/search?term=${encodeURIComponent(searchTerm)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to search guides');
        return response.json();
    },

    getGuidesByCategory: async (category) => {
        const response = await fetch(`${API_URL}/guides/category/${category}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch guides by category');
        return response.json();
    },

    // Protected endpoints (require moderator role)
    createGuide: async (guideData) => {
        const response = await fetch(`${API_URL}/guides`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(guideData)
        });
        if (!response.ok) throw new Error('Failed to create guide');
        return response.json();
    },

    updateGuide: async (id, guideData) => {
        const response = await fetch(`${API_URL}/guides/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(guideData)
        });
        if (!response.ok) throw new Error('Failed to update guide');
        return response.json();
    },

    deleteGuide: async (id) => {
        const response = await fetch(`${API_URL}/guides/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error('Failed to delete guide');
        return true;
    }
};