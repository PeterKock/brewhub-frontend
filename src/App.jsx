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
import Community from './pages/private/community.jsx';

// Customer Pages
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
    const [isChecking, setIsChecking] = useState(true);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                if (isMounted) {
                    setIsChecking(true);
                    const userStr = localStorage.getItem('user');
                    const user = userStr ? JSON.parse(userStr) : null;
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

        const checkAuth = async () => {
            if (!isMounted) return;

            try {
                setIsInitializing(true);
                const token = localStorage.getItem('token');
                const userStr = localStorage.getItem('user');

                if (!token || !userStr) {
                    authService.logout();
                    setIsAuthenticated(false);
                    setIsInitializing(false);
                    return;
                }

                // Verify token with backend
                const response = await fetch('http://localhost:8080/api/auth/verify', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    authService.logout();
                    setIsAuthenticated(false);
                    setIsInitializing(false);
                    return;
                }

                // Parse and validate user data
                const user = JSON.parse(userStr);
                if (!user?.id || !user?.email || !user?.role) {
                    console.error('Invalid user data');
                    authService.logout();
                    setIsAuthenticated(false);
                    setIsInitializing(false);
                    return;
                }

                setIsAuthenticated(true);
                console.log('Authentication check successful');

            } catch (error) {
                console.error('Auth check failed:', error);
                authService.logout();
                setIsAuthenticated(false);
            } finally {
                if (isMounted) {
                    setIsInitializing(false);
                }
            }
        };

        // Execute initial auth check immediately
        (async () => {
            try {
                await checkAuth();
            } catch (error) {
                console.error('Initial auth check failed:', error);
                if (isMounted) {
                    setIsAuthenticated(false);
                    setIsInitializing(false);
                }
            }
        })();

        // Storage event listener with proper async handling
        const handleStorageChange = () => {
            checkAuth().catch(console.error);
        };
        window.addEventListener('storage', handleStorageChange);

        // Regular token check
        const tokenCheckInterval = setInterval(() => {
            checkAuth().catch(console.error);
        }, 3600000);

        // Cleanup
        return () => {
            isMounted = false;
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(tokenCheckInterval);
        };
    }, [location.pathname]);

    const handleLogin = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            console.log('Login successful, setting auth state to true');
            setIsAuthenticated(true);

            const userStr = localStorage.getItem('user');
            const user = JSON.parse(userStr);
            navigateBasedOnRole(user);

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

            const userStr = localStorage.getItem('user');
            const user = JSON.parse(userStr);
            navigateBasedOnRole(user);

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

                    {/* Private Routes */}
                    <Route path="/community" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Community />
                        </ProtectedRoute>
                    } />

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