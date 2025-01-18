const API_URL = 'http://localhost:8080/api';

export const orderService = {
    // Create a new order
    createOrder: async (orderData) => {
        const response = await fetch(`${API_URL}/user/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to create order');
        }

        return response.json();
    },

    // Get user's orders
    getUserOrders: async () => {
        const response = await fetch(`${API_URL}/user/orders`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }

        return response.json();
    },

    // Get retailer's orders
    getRetailerOrders: async () => {
        const response = await fetch(`${API_URL}/retailer/orders`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }

        return response.json();
    },

    // Get specific order details (user)
    getUserOrder: async (orderId) => {
        const response = await fetch(`${API_URL}/user/orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch order details');
        }

        return response.json();
    },

    // Get specific order details (retailer)
    getRetailerOrder: async (orderId) => {
        const response = await fetch(`${API_URL}/retailer/orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch order details');
        }

        return response.json();
    },

    // Update order status (retailer only)
    updateOrderStatus: async (orderId, status) => {
        const response = await fetch(`${API_URL}/retailer/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            throw new Error('Failed to update order status');
        }

        return response.json();
    },

    // Cancel order (user only)
    cancelOrder: async (orderId) => {
        const response = await fetch(`${API_URL}/user/orders/${orderId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to cancel order');
        }
    },

    // Retailer Dashboard
    getRetailerDashboardStats: async () => {
        const response = await fetch(`${API_URL}/retailer/dashboard/stats`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch dashboard stats');
        }

        return response.json();
    },

    getRetailerRecentOrders: async () => {
        const response = await fetch(`${API_URL}/retailer/dashboard/recent-orders`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch recent orders');
        }

        return response.json();
    },

    // User Dashboard
    getUserDashboardStats: async () => {
        const response = await fetch(`${API_URL}/user/dashboard/stats`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user stats');
        }

        return response.json();
    },

    getUserRecentOrders: async () => {
        const response = await fetch(`${API_URL}/user/dashboard/recent-orders`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch recent orders');
        }

        return response.json();
    }
};