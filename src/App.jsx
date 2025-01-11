import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { authService } from './services/authService';

// Header
import Header from './components/header';
import Footer from './components/footer';

// Public Pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/loginpage';
import RegisterPage from './pages/public/registerpage';
import AboutUsPage from './pages/public/aboutuspage';

// Customer Pages
import UserDashboard from './pages/user/dashboard';
import UserOrders from './pages/user/orders';
import UserFavorites from './pages/user/favorites';
import UserRecipes from './pages/user/recipes';
import UserGuides from './pages/user/guides';
import UserCommunity from './pages/user/community.jsx';

// Retailer Pages
import RetailerDashboard from './pages/retailer/dashboard';
import RetailerInventory from './pages/retailer/inventory';
import RetailerOrders from './pages/retailer/orders';

const ProtectedRoute = ({ children, isAuthenticated, allowedRole }) => {
    const [isChecking, setIsChecking] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                setIsChecking(true);
                // Get user data from localStorage
                const userStr = localStorage.getItem('user');
                const user = JSON.parse(userStr);

                if (isMounted) {
                    // Check if user has the required role
                    const hasRole = user && (allowedRole ? user.role === allowedRole : true);
                    setHasPermission(hasRole);
                    setIsChecking(false);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                if (isMounted) {
                    setHasPermission(false);
                    setIsChecking(false);
                }
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [allowedRole]);

    if (isChecking) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated || !hasPermission) {
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
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;

        const checkAuth = () => {
            if (isMounted) {
                const authStatus = authService.isAuthenticated();
                console.log('Authentication check:', authStatus);
                console.log('Current token:', localStorage.getItem('token'));
                setIsAuthenticated(authStatus);
                setIsInitializing(false);
            }
        };

        // Initial check
        checkAuth();

        // Listen for localStorage changes
        window.addEventListener('storage', checkAuth);

        // Regular token check
        const tokenCheckInterval = setInterval(checkAuth, 1000);

        // Cleanup
        return () => {
            isMounted = false;
            window.removeEventListener('storage', checkAuth);
            clearInterval(tokenCheckInterval);
        };
    }, [location.pathname]);

    const handleLogin = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            console.log('Login successful, setting auth state to true');
            setIsAuthenticated(true);

            // Get the stored user data
            const userStr = localStorage.getItem('user');
            const user = JSON.parse(userStr);

            // Redirect based on role
            if (user && user.role === 'RETAILER') {
                window.location.href = '/retailer/dashboard';
            } else {
                window.location.href = '/user/dashboard';
            }
            return response;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const handleLogout = () => {
        authService.logout();
        setIsAuthenticated(false);
        window.location.href = '/login';
    };

    const handleRegister = async (registrationData) => {
        try {
            await authService.register(registrationData);
            const loginResponse = await authService.login({
                email: registrationData.email,
                password: registrationData.password
            });
            setIsAuthenticated(true);

            // Get the stored user data
            const userStr = localStorage.getItem('user');
            const user = JSON.parse(userStr);

            // Redirect based on role
            if (user && user.role === 'RETAILER') {
                window.location.href = '/retailer/dashboard';
            } else {
                window.location.href = '/user/dashboard';
            }
            return loginResponse;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
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

                    {/* Protected Customer Routes */}
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
                    <Route path="/user/favorites" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated} allowedRole="USER">
                            <UserFavorites />
                        </ProtectedRoute>
                    } />
                    <Route path="/user/community" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated} allowedRole="USER">
                            <UserCommunity />
                        </ProtectedRoute>
                    } />
                    <Route path="/user/recipes" element={<UserRecipes />} />
                    <Route path="/user/guides" element={<UserGuides />} />

                    {/* Protected Retailer Routes */}
                    <Route path="/retailer/dashboard" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated} allowedRole="RETAILER">
                            <RetailerDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/retailer/inventory" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated} allowedRole="RETAILER">
                            <RetailerInventory />
                        </ProtectedRoute>
                    } />
                    <Route path="/retailer/orders" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated} allowedRole="RETAILER">
                            <RetailerOrders />
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