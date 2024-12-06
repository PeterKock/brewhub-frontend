import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Header
import Header from './components/header';

// Public Pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/loginpage';
import RegisterPage from './pages/public/registerpage';

// Customer Pages
import CustomerDashboard from './pages/customer/dashboard';
import CustomerOrders from './pages/customer/orders';
import CustomerFavorites from './pages/customer/favorites';
import CustomerRecipes from './pages/customer/recipes';
import CustomerGuides from './pages/customer/guides';

// Retailer Pages
import RetailerDashboard from './pages/retailer/dashboard';
import RetailerInventory from './pages/retailer/inventory';

function App() {
    return (
        <Router>
            <div className="app">
                <Header />
                <main className="main-content">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* Customer Routes */}
                        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
                        <Route path="/customer/orders" element={<CustomerOrders />} />
                        <Route path="/customer/favorites" element={<CustomerFavorites />} />
                        <Route path="/customer/recipes" element={<CustomerRecipes />} />
                        <Route path="/customer/guides" element={<CustomerGuides />} />

                        {/* Retailer Routes */}
                        <Route path="/retailer/dashboard" element={<RetailerDashboard />} />
                        <Route path="/retailer/inventory" element={<RetailerInventory />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;