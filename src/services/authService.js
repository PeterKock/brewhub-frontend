const API_URL = 'http://localhost:8080/api/auth';

let isLoggingOut = false;
let hasCleanedUp = false;

const handleAuthResponse = (data) => {
    if (data && data['token']) {
        // Clear any existing auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Set new data
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

    const user = JSON.parse(localStorage.getItem('user'));

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
        hasCleanedUp = false;
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
        hasCleanedUp = false;
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

        if (hasCleanedUp) {
            return;
        }

        try {
            isLoggingOut = true;
            if (localStorage.getItem('token') || localStorage.getItem('user')) {
                console.log('Logging out user');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
            hasCleanedUp = true;
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
            if (!hasCleanedUp) {
                authService.logout();
            }
            return false;
        }

        try {
            const user = JSON.parse(userStr);
            const isValid = !!(user && user.id && user.email && user.role);
            if (!isValid && !hasCleanedUp) {
                authService.logout();
            }
            return isValid;
        } catch {
            if (!hasCleanedUp) {
                authService.logout();
            }
            return false;
        }
    }
};