const API_URL = 'http://localhost:8080/api';

export const recipeService = {
    getAllRecipes: async () => {
        const response = await fetch(`${API_URL}/recipes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch recipes');
        return response.json();
    },

    getRecipeById: async (id) => {
        const response = await fetch(`${API_URL}/recipes/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch recipe');
        return response.json();
    },

    searchRecipes: async (searchTerm) => {
        const response = await fetch(`${API_URL}/recipes/search?term=${encodeURIComponent(searchTerm)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to search recipes');
        return response.json();
    },

    getRecipesByDifficulty: async (difficulty) => {
        const response = await fetch(`${API_URL}/recipes/difficulty/${difficulty}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch recipes by difficulty');
        return response.json();
    },

    getRecipesByType: async (type) => {
        const response = await fetch(`${API_URL}/recipes/type/${type}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to fetch recipes by type');
        return response.json();
    },

    // Protected endpoints (require moderator role)
    createRecipe: async (recipeData) => {
        const response = await fetch(`${API_URL}/recipes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(recipeData)
        });
        if (!response.ok) throw new Error('Failed to create recipe');
        return response.json();
    },

    updateRecipe: async (id, recipeData) => {
        const response = await fetch(`${API_URL}/recipes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(recipeData)
        });
        if (!response.ok) throw new Error('Failed to update recipe');
        return response.json();
    },

    deleteRecipe: async (id) => {
        const response = await fetch(`${API_URL}/recipes/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error('Failed to delete recipe');
        return true;
    }
};