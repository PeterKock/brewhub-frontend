const API_URL = 'http://localhost:8080/api/auth';

export const authService = {
    login: async (credentials) => {
        console.log('Login attempt with:', credentials.email);
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Login failed');
        }

        const data = await response.json();
        console.log('Server response:', data);

        if (data && data['token']) {
            console.log('Storing auth data in localStorage');
            localStorage.setItem('token', data['token']);
            localStorage.setItem('user', JSON.stringify({
                id: data['id'],
                email: data['email'],
                role: data['role']
            }));
        }
        return data;
    },

    register: async (userData) => {
        console.log('Registration attempt for:', userData.email);
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Registration failed');
        }

        return response.json();
    },

    logout: () => {
        console.log('Logging out user');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        console.log('Auth check - Token exists:', !!token);
        console.log('Auth check - User exists:', !!user);
        return !!token && !!user;
    }
};