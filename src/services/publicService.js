const API_URL = 'http://localhost:8080/api/public';

export const publicService = {
    // Get all retailers
    getRetailers: async () => {
        const response = await fetch(`${API_URL}/retailers`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Server response:', errorData);
            throw new Error('Failed to load retailers');
        }

        return response.json();
    },

    // Get ingredients for a specific retailer
    getRetailerIngredients: async (retailerId) => {
        const response = await fetch(`${API_URL}/retailers/${retailerId}/ingredients`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Server response:', errorData);
            throw new Error('Failed to load ingredients');
        }

        return response.json();
    }
};