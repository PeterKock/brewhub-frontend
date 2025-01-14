// Constants
const API_URL = 'http://localhost:8080/api/auth';

// Main Service Export
export const authService = {
    // Authentication Methods
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
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.dispatchEvent(new Event('storage'));
            const errorText = await response.text();
            throw new Error(errorText || 'Login failed');
        }

        const data = await response.json();
        console.log('Server response:', data);

        if (data && data['token']) {
            console.log('Storing auth data in localStorage');
            localStorage.setItem('token', data['token']);
            localStorage.setItem('user', JSON.stringify({
                id: data.id,
                email: data.email,
                role: data.role,
                firstName: data.firstName
            }));
            window.dispatchEvent(new Event('storage'));
        }
        return data;
    },

    // Registration Method
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
            const errorText = await response.text();
            throw new Error(errorText || 'Registration failed');
        }

        return response.json();
    },

    // Session Management Methods
    logout: () => {
        console.log('Logging out user');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('storage'));
    },

    // Authentication State Check
    isAuthenticated: () => {
        const userStr = localStorage.getItem('user');

        if (!localStorage.getItem('token') || !userStr) {
            return false;
        }

        try {
            const user = JSON.parse(userStr);
            const isValid = !!(user && user.id && user.email && user.role);

            console.log('Auth check - Token exists:', !!localStorage.getItem('token'));
            console.log('Auth check - User valid:', isValid);

            return isValid;
        } catch {
            return false;
        }
    }
};