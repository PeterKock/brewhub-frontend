const API_URL = 'http://localhost:8080/api';

export const ratingService = {
    // Get the order rating
    getOrderRating: async (orderId) => {
        try {
            const response = await fetch(`${API_URL}/public/orders/${orderId}/rating`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 403 || response.status === 404) {
                return null;
            }

            if (!response.ok) {
                console.error('Failed to fetch order rating:', response.status);
                return null;
            }

            return response.json();
        } catch (error) {
            console.error('Error fetching order rating:', error);
            return null;
        }
    },

    // Create a new rating
    createRating: async (retailerId, ratingData) => {
        const response = await fetch(`${API_URL}/user/ratings/${retailerId}/order/${ratingData.orderId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                score: ratingData.score,
                comment: ratingData.comment,
                orderId: ratingData.orderId
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to submit rating');
        }

        return response.json();
    },

    // Get all ratings for a retailer
    getRetailerRatings: async (retailerId) => {
        const response = await fetch(`${API_URL}/public/retailers/${retailerId}/ratings`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch ratings');
        }

        return response.json();
    },

    // Get average rating for a retailer
    getRetailerAverageRating: async (retailerId) => {
        const response = await fetch(`${API_URL}/public/retailers/${retailerId}/average-rating`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch average rating');
        }

        return response.json();
    }
};