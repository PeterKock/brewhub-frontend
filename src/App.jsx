import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { authService } from './services/authService';

// Header
import Header from './components/header';
import Footer from './components/footer';

// Private & Public Pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/loginpage';
import RegisterPage from './pages/public/registerpage';
import AboutUsPage from './pages/public/aboutuspage';
import Community from './pages/private/community.jsx';

// User Pages
import UserDashboard from './pages/user/dashboard';
import UserOrders from './pages/user/orders';
import UserRecipes from './pages/user/recipes';
import UserGuides from './pages/user/guides';

// Retailer Pages
import RetailerDashboard from './pages/retailer/dashboard';
import RetailerInventory from './pages/retailer/inventory';
import RetailerOrders from './pages/retailer/orders';

// Moderator Page
import Dashboard from './pages/moderator/dashboard.jsx';

const navigateBasedOnRole = (user) => {
    if (user && user.role === 'RETAILER') {
        window.location.href = '/retailer/dashboard';
    } else if (user && user.role === 'MODERATOR') {
        window.location.href = '/moderator/dashboard';
    } else {
        window.location.href = '/user/dashboard';
    }
};

const ProtectedRoute = ({ children, isAuthenticated, allowedRole }) => {
    const [hasPermission, setHasPermission] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        const hasRole = !allowedRole || (user && user.role === allowedRole);
        setHasPermission(hasRole);
        setIsLoading(false);
    }, [allowedRole, isAuthenticated]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!hasPermission) {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        if (user) {
            return <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />;
        }
        return <Navigate to="/login" replace />;
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    allowedRole: PropTypes.string
};

function AppContent() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            if (!isMounted) return;

            try {
                setIsInitializing(true);
                const token = localStorage.getItem('token');
                const userStr = localStorage.getItem('user');

                if (!token || !userStr) {
                    setIsAuthenticated(false);
                    setIsInitializing(false);
                    return;
                }

                const response = await fetch('http://localhost:8080/api/auth/verify', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    setIsAuthenticated(false);
                    setIsInitializing(false);
                    return;
                }

                const user = JSON.parse(userStr);
                if (!user?.id || !user?.email || !user?.role) {
                    setIsAuthenticated(false);
                    setIsInitializing(false);
                    return;
                }

                setIsAuthenticated(true);
            } catch (error) {
                console.error(error);
                setIsAuthenticated(false);
            } finally {
                if (isMounted) {
                    setIsInitializing(false);
                }
            }
        };

        const initAuth = async () => {
            try {
                await checkAuth();
            } catch (error) {
                console.error('Initial auth check failed:', error);
            }
        };
        void initAuth();

        const handleStorageChange = () => {
            void checkAuth();
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            isMounted = false;
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleLogin = async (credentials) => {
        const response = await authService.login(credentials);
        setIsAuthenticated(true);

        const userStr = localStorage.getItem('user');
        const user = JSON.parse(userStr);
        navigateBasedOnRole(user);

        return response;
    };

    const handleLogout = () => {
        authService.logout();
        setIsAuthenticated(false);
        window.location.href = '/login';
    };

    const handleRegister = async (registrationData) => {
        await authService.register(registrationData);
        const loginResponse = await authService.login({
            email: registrationData.email,
            password: registrationData.password
        });
        setIsAuthenticated(true);

        const userStr = localStorage.getItem('user');
        const user = JSON.parse(userStr);
        navigateBasedOnRole(user);

        return loginResponse;
    };

    if (isInitializing) {
        return <div>Loading...</div>;
    }

    return (
        <div className="app">
            <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
            <main className="main-content">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                    <Route path="/register" element={<RegisterPage onRegister={handleRegister} />} />
                    <Route path="/aboutus" element={<AboutUsPage />} />

                    {/* Private Routes */}
                    <Route path="/community" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Community />
                        </ProtectedRoute>
                    } />

                    {/* Protected User Routes */}
                    <Route path="/user/dashboard" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated} allowedRole="USER">
                            <UserDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/user/orders" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated} allowedRole="USER">
                            <UserOrders />
                        </ProtectedRoute>
                    } />
                    <Route path="/recipes" element={<UserRecipes />} />
                    <Route path="/guides" element={<UserGuides />} />

                    {/* Protected Retailer Routes */}
                    <Route path="/retailer/dashboard" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated} allowedRole="RETAILER">
                            <RetailerDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/inventory" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated} allowedRole="RETAILER">
                            <RetailerInventory />
                        </ProtectedRoute>
                    } />
                    <Route path="/retailer/orders" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated} allowedRole="RETAILER">
                            <RetailerOrders />
                        </ProtectedRoute>
                    } />

                    {/* Protected Moderator Routes */}
                    <Route path="/moderator/dashboard" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated} allowedRole="MODERATOR">
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;