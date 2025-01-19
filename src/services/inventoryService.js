const API_URL = 'http://localhost:8080/api/retailer/inventory';

const buildUrlWithParams = (baseUrl, searchTerm = '', category = '') => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (category && category !== 'all') params.append('category', category.toUpperCase());
    return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
};

export const inventoryService = {
    getAllItems: async (searchTerm = '', category = '') => {
        const url = buildUrlWithParams(API_URL, searchTerm, category);
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

    createItem: async (itemData) => {
        const token = localStorage.getItem('token');
        console.log('Using token:', token);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(itemData)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Server response:', response.status, errorBody);

            if (response.status === 403) {
                throw new Error('Not authorized. Please check if you are logged in with a retailer account.');
            }
            throw new Error(`Failed to create inventory item: ${errorBody}`);
        }

        return response.json();
    },

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

    deleteItem: async (id) => {
        return fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    },

    getDeletedItems: async (searchTerm = '', category = '') => {
        const url = buildUrlWithParams(`${API_URL}/deleted`, searchTerm, category);
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch deleted items');
        }

        return response.json();
    },

    restoreItem: async (id) => {
        const response = await fetch(`${API_URL}/${id}/restore`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to restore item');
        }

        return response.json();
    }
};