import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Header
import Header from './components/header';
import Footer from './components/footer';

// Public Pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/loginpage';
import RegisterPage from './pages/public/registerpage';
import AboutUsPage from './pages/public/aboutuspage';

// Customer Pages
import CustomerDashboard from './pages/customer/dashboard';
import CustomerOrders from './pages/customer/orders';
import CustomerFavorites from './pages/customer/favorites';
import CustomerRecipes from './pages/customer/recipes';
import CustomerGuides from './pages/customer/guides';

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

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const isAuth = localStorage.getItem('isAuthenticated') === 'true';
        setIsAuthenticated(isAuth);
    }, []);

    const handleLogin = async (formData) => {
        try {
            // Here you would typically make an API call to your backend
            // For now, we'll simulate a successful login
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
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/aboutus" element={<AboutUsPage />} />

                        {/* Protected Customer Routes */}
                        <Route
                            path="/customer/dashboard"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <CustomerDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/customer/orders"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <CustomerOrders />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/customer/favorites"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <CustomerFavorites />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/customer/recipes" element={<CustomerRecipes />} />
                        <Route path="/customer/guides" element={<CustomerGuides />} />

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