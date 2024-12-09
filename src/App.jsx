import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

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

// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated }) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// PropTypes for ProtectedRoute
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
};

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const isAuth = localStorage.getItem('isAuthenticated') === 'true';
        setIsAuthenticated(isAuth);
    }, []);

    const handleLogin = async (credentials) => {
        try {
            // Here you would typically make an API call to your backend
            // For demonstration, we'll simulate a successful login
            console.log('Processing login with credentials:', credentials);
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
    };

    const handleRegister = async (registrationData) => {
        try {
            // Here you would typically make an API call to your backend
            console.log('Processing registration:', registrationData);
            // Add your registration logic here
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    return (
        <Router>
            <div className="app">
                <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
                <main className="main-content">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route
                            path="/login"
                            element={
                                <LoginPage
                                    onLogin={handleLogin}
                                />
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <RegisterPage
                                    onRegister={handleRegister}
                                />
                            }
                        />
                        <Route path="/aboutus" element={<AboutUsPage />} />

                        {/* Protected Customer Routes */}
                        <Route
                            path="/user/dashboard"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <UserDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/user/orders"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <UserOrders />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/user/favorites"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <UserFavorites />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/user/community"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <UserCommunity />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/user/recipes" element={<UserRecipes />} />
                        <Route path="/user/guides" element={<UserGuides />} />

                        {/* Protected Retailer Routes */}
                        <Route
                            path="/retailer/dashboard"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <RetailerDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/retailer/inventory"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <RetailerInventory />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;