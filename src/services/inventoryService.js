const API_URL = 'http://localhost:8080/api/retailer/inventory';

export const inventoryService = {
    // Get all inventory items
    getAllItems: async (searchTerm = '', category = '') => {
        let url = API_URL;
        const params = new URLSearchParams();

        if (searchTerm) params.append('search', searchTerm);
        if (category && category !== 'all') params.append('category', category.toUpperCase());

        if (params.toString()) {
            url += '?' + params.toString();
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch inventory items');
        }

        return response.json();
    },

    // Get low stock items
    getLowStockItems: async () => {
        const response = await fetch(`${API_URL}/low-stock`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch low stock items');
        }

        return response.json();
    },

    // Create new inventory item
    createItem: async (itemData) => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(itemData)
        });

        if (!response.ok) {
            throw new Error('Failed to create inventory item');
        }

        return response.json();
    },

    // Update inventory item
    updateItem: async (id, itemData) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(itemData)
        });

        if (!response.ok) {
            throw new Error('Failed to update inventory item');
        }

        return response.json();
    },

    // Delete inventory item
    deleteItem: async (id) => {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete inventory item');
        }
    }
};