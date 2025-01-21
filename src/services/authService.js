const API_URL = 'http://localhost:8080/api/auth';

let isLoggingOut = false;

const handleAuthResponse = (data) => {
    if (data && data['token']) {
        // Clear any existing auth data first
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Then set the new data
        localStorage.setItem('token', data['token']);
        localStorage.setItem('user', JSON.stringify({
            id: data.id,
            email: data.email,
            role: data.role,
            firstName: data.firstName,
            averageRating: data.averageRating,
            totalRatings: data.totalRatings
        }));
    }

    // Get fresh user data from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    // Force a slight delay to ensure storage is updated
    setTimeout(() => {
        if (user && user.role === 'RETAILER') {
            window.location.href = '/retailer/dashboard';
        } else if (user && user.role === 'MODERATOR') {
            window.location.href = '/moderator/dashboard';
        } else {
            window.location.href = '/user/dashboard';
        }
    }, 100);

    return data;
};

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
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            const errorText = await response.text();
            throw new Error(errorText || 'Login failed');
        }

        const data = await response.json();
        console.log('Server response:', data);
        return handleAuthResponse(data);
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
            const errorText = await response.text();
            throw new Error(errorText || 'Registration failed');
        }

        const data = await response.json();
        return handleAuthResponse(data);
    },

    logout: () => {
        if (isLoggingOut) {
            console.log('Logout already in progress');
            return;
        }

        try {
            isLoggingOut = true;
            console.log('Logging out user');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } finally {
            setTimeout(() => {
                isLoggingOut = false;
            }, 100);
        }
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
            return false;
        }

        try {
            const user = JSON.parse(userStr);
            return !!(user && user.id && user.email && user.role);
        } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return false;
        }
    }
};